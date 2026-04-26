import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// POST /api/billing/cancel
// Agenda cancelamento para o fim do periodo pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription_id, fornecedor_id } = body as {
      subscription_id: string
      fornecedor_id: string
    }

    if (!subscription_id || !fornecedor_id) {
      return Response.json(
        { error: 'subscription_id e fornecedor_id obrigatorios' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    // Verificar que o fornecedor pertence ao usuario
    const { data: fornecedor } = await supabase
      .from('fornecedores')
      .select('id')
      .eq('id', fornecedor_id)
      .eq('user_id', user.id)
      .single()

    if (!fornecedor) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, plan_id, status, period_end')
      .eq('id', subscription_id)
      .eq('fornecedor_id', fornecedor_id)
      .single()

    if (!sub) {
      return Response.json({ error: 'Assinatura nao encontrada' }, { status: 404 })
    }

    if (sub.status === 'free') {
      return Response.json({ error: 'Plano gratuito nao pode ser cancelado' }, { status: 400 })
    }

    // Agendar cancelamento para o fim do periodo
    const cancelAt = sub.period_end ?? new Date().toISOString()

    const { error } = await supabase
      .from('subscriptions')
      .update({ cancel_at: cancelAt })
      .eq('id', subscription_id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: 'Cancelamento agendado para o fim do periodo',
      cancel_at: cancelAt,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/billing/cancel - Desfazer cancelamento agendado
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription_id, fornecedor_id } = body as {
      subscription_id: string
      fornecedor_id: string
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const { data: fornecedor } = await supabase
      .from('fornecedores')
      .select('id')
      .eq('id', fornecedor_id)
      .eq('user_id', user.id)
      .single()

    if (!fornecedor) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 })
    }

    await supabase
      .from('subscriptions')
      .update({ cancel_at: null })
      .eq('id', subscription_id)
      .eq('fornecedor_id', fornecedor_id)

    return Response.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
