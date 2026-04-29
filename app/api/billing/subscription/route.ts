import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// GET /api/billing/subscription?fornecedor_id=xxx
// Retorna plano ativo do fornecedor
export async function GET(request: NextRequest) {
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
    const { searchParams } = request.nextUrl
    const fornecedorId = searchParams.get('fornecedor_id')

    if (!fornecedorId) {
      return Response.json({ error: 'fornecedor_id obrigatorio' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, plan_id, status, period_start, period_end, cancel_at, created_at, mp_payment_id, gateway, metadata')
      .eq('fornecedor_id', fornecedorId)
      .in('status', ['active', 'free', 'trialing', 'pending', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return Response.json({ subscription: sub ?? null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
