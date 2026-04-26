import { NextRequest } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getPaymentClient } from '@/lib/mercadopago'

export const dynamic = 'force-dynamic'

// Webhook do Mercado Pago - idempotente
// MP envia notificacoes para este endpoint quando um pagamento ocorre
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const payload = JSON.parse(body) as MPWebhookPayload

    // Criar cliente Supabase com service role (sem RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const eventType = payload.type ?? payload.action ?? 'unknown'
    const gatewayEventId = payload.id?.toString() ?? `${eventType}_${Date.now()}`

    // Idempotencia: verificar se evento ja foi processado
    const { data: existingEvent } = await supabase
      .from('subscription_events')
      .select('id, processed_at')
      .eq('gateway', 'mercadopago')
      .eq('gateway_event_id', gatewayEventId)
      .single()

    if (existingEvent?.processed_at) {
      return new Response('Already processed', { status: 200 })
    }

    // Inserir evento (pode ja existir sem processed_at)
    let eventId: string | null = existingEvent?.id ?? null
    if (!eventId) {
      const { data: ev } = await supabase
        .from('subscription_events')
        .insert({
          event_type: eventType,
          gateway: 'mercadopago',
          gateway_event_id: gatewayEventId,
          payload,
        })
        .select('id')
        .single()
      eventId = ev?.id ?? null
    }

    // Processar evento de pagamento
    if (eventType === 'payment' || eventType === 'payment.created' || eventType === 'payment.updated') {
      const paymentId = payload.data?.id ?? payload.id
      if (paymentId) {
        await processPaymentEvent(supabase, paymentId.toString(), eventId)
      }
    }

    // Marcar evento como processado
    if (eventId) {
      await supabase
        .from('subscription_events')
        .update({ processed_at: new Date().toISOString() })
        .eq('id', eventId)
    }

    return new Response('OK', { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    console.error('[webhook] error:', message)
    // Retornar 200 para MP nao retentar (erros de parsing sao nosso problema)
    return new Response('Error logged', { status: 200 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processPaymentEvent(
  supabase: SupabaseClient<any, any, any>,
  paymentId: string,
  eventId: string | null
) {
  try {
    // Buscar detalhes do pagamento no MP
    const paymentClient = getPaymentClient()
    const payment = await paymentClient.get({ id: Number(paymentId) })

    const externalRef = payment.external_reference ?? ''
    // external_reference = "{fornecedor_id}|{plan_id}|{interval}"
    const [fornecedorId, planIdStr, interval] = externalRef.split('|')
    const planId = parseInt(planIdStr ?? '1', 10)

    if (!fornecedorId || !planId) {
      console.error('[webhook] external_reference invalido:', externalRef)
      return
    }

    const status = payment.status // 'approved' | 'pending' | 'rejected' | 'cancelled' | etc.

    // Atualizar evento com fornecedor_id
    if (eventId) {
      await supabase
        .from('subscription_events')
        .update({ fornecedor_id: fornecedorId })
        .eq('id', eventId)
    }

    if (status === 'approved') {
      const now = new Date()
      const periodEnd = interval === 'yearly'
        ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

      // Buscar subscription pendente ou existente
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('fornecedor_id', fornecedorId)
        .in('status', ['pending', 'active', 'free'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) {
        await supabase
          .from('subscriptions')
          .update({
            plan_id: planId,
            status: 'active',
            mp_payment_id: paymentId,
            period_start: now.toISOString(),
            period_end: periodEnd.toISOString(),
            cancel_at: null,
            canceled_at: null,
            metadata: { interval },
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('subscriptions').insert({
          fornecedor_id: fornecedorId,
          plan_id: planId,
          status: 'active',
          gateway: 'mercadopago',
          mp_payment_id: paymentId,
          period_start: now.toISOString(),
          period_end: periodEnd.toISOString(),
          metadata: { interval },
        })
      }
    } else if (status === 'rejected' || status === 'cancelled') {
      // Reverter para pending sem limpar (nao cancelar assinatura ativa)
      await supabase
        .from('subscriptions')
        .update({ status: 'pending' })
        .eq('fornecedor_id', fornecedorId)
        .eq('status', 'pending')
    }
  } catch (err) {
    console.error('[webhook] processPaymentEvent error:', err)
    throw err
  }
}

// Tipos do webhook MP
interface MPWebhookPayload {
  id?: number | string
  type?: string
  action?: string
  data?: { id?: number | string }
  [key: string]: unknown
}
