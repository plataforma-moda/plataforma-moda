import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // graceful degradation in dev

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, 'auth', 5)
  if (rl.limited) {
    return Response.json(
      { error: 'Muitas tentativas. Tente novamente em instantes.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const body = await request.json() as { email: string; password: string; turnstileToken?: string }
    const { email, password, turnstileToken } = body

    if (!email || !password) {
      return Response.json({ error: 'Email e senha obrigatorios' }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    // Verify Turnstile CAPTCHA if site key is configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!turnstileToken) {
        return Response.json({ error: 'Verificacao de seguranca necessaria.' }, { status: 400 })
      }
      const valid = await verifyTurnstile(turnstileToken)
      if (!valid) {
        return Response.json({ error: 'Verificacao de seguranca falhou. Tente novamente.' }, { status: 403 })
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.includes('already registered')) {
        return Response.json({ error: 'Este e-mail ja esta cadastrado. Tente fazer login.' }, { status: 409 })
      }
      return Response.json({ error: 'Erro ao criar conta. Tente novamente.' }, { status: 400 })
    }

    return Response.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
