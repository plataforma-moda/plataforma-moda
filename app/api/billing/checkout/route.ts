import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPreferenceClient } from '@/lib/mercadopago'
import { PLANS, getPlanById, type PlanId } from '@/lib/plans'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per minute per IP
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, 'billing', 5)
  if (rl.limited) {
    return Response.json(
      { error: 'Muitas tentativas. Tente novamente em instantes.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const body = await request.json()
    const { plan_id, fornecedor_id, interval = 'monthly' } = body as {
      plan_id: PlanId
      fornecedor_id: string
      interval?: 'monthly' | 'yearly'
    }

    if (!plan_id || !fornecedor_id) {
      return Response.json(
        { error: 'plan_id e fornecedor_id sao obrigatorios' },
        { status: 400 }
      )
    }

    // Gate: verificar threshold de lancamento antes de processar pagamento
    // Plano gratuito sempre permitido, independente do threshold
    if (plan_id !== 1) {
      const supabaseGate = await createClient()
      const { data: threshold } = await supabaseGate
        .from('launch_thresholds')
        .select('threshold_value, is_met, enabled')
        .eq('threshold_type', 'total_fornecedores')
        .eq('enabled', true)
        .single()

      if (threshold && !threshold.is_met) {
        const { count } = await supabaseGate
          .from('fornecedores')
          .select('*', { count: 'exact', head: true })
        const current = count ?? 0
        if (current < threshold.threshold_value) {
          return Response.json(
            {
              error: 'Vendas ainda nao liberadas',
              gate: true,
              current_value: current,
              threshold_value: threshold.threshold_value,
            },
            { status: 403 }
          )
        }
      }
    }

    const plan = getPlanById(plan_id)
    if (!plan) {
      return Response.json({ error: 'Plano invalido' }, { status: 400 })
    }

    // Para plano gratuito, salvar diretamente sem pagamento
    if (plan_id === 1) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Verificar se ja tem subscription para este fornecedor
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id, plan_id, status')
        .eq('fornecedor_id', fornecedor_id)
        .eq('status', 'active')
        .single()

      if (existing) {
        return Response.json({ subscription_id: existing.id, redirect: null })
      }

      const { data: sub, error } = await supabase
        .from('subscriptions')
        .insert({
          fornecedor_id,
          plan_id: 1,
          status: 'free',
          user_id: user?.id ?? null,
          gateway: 'none',
        })
        .select()
        .single()

      if (error) {
        return Response.json({ error: error.message }, { status: 500 })
      }

      return Response.json({ subscription_id: sub.id, redirect: null })
    }

    // Para planos pagos: criar preferencia no Mercado Pago
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://snmoda.com.br'
    const priceValue = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly

    const preference = getPreferenceClient()
    const result = await preference.create({
      body: {
        items: [
          {
            id: `plan_${plan.slug}_${interval}`,
            title: `SNM ${plan.name} — ${interval === 'yearly' ? 'Anual' : 'Mensal'}`,
            description: plan.tagline,
            quantity: 1,
            unit_price: priceValue,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${appUrl}/planos/sucesso?fornecedor_id=${fornecedor_id}&plan_id=${plan_id}`,
          failure: `${appUrl}/planos?id=${fornecedor_id}&payment=failure`,
          pending: `${appUrl}/planos/sucesso?fornecedor_id=${fornecedor_id}&plan_id=${plan_id}&status=pending`,
        },
        auto_return: 'approved',
        external_reference: `${fornecedor_id}|${plan_id}|${interval}`,
        payment_methods: {
          excluded_payment_types: [],
        },
        notification_url: `${appUrl}/api/billing/webhooks`,
        metadata: {
          fornecedor_id,
          plan_id,
          interval,
        },
      },
    })

    if (!result.id) {
      return Response.json(
        { error: 'Falha ao criar preferencia no Mercado Pago' },
        { status: 500 }
      )
    }

    // Salvar preference no DB como subscription pendente
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Remover subscription pending anterior para este fornecedor/plano
    await supabase
      .from('subscriptions')
      .delete()
      .eq('fornecedor_id', fornecedor_id)
      .eq('status', 'pending')

    const { data: sub } = await supabase
      .from('subscriptions')
      .insert({
        fornecedor_id,
        plan_id,
        status: 'pending',
        user_id: user?.id ?? null,
        gateway: 'mercadopago',
        mp_preference_id: result.id,
        metadata: { interval },
      })
      .select()
      .single()

    return Response.json({
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      subscription_id: sub?.id,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
