import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const { email, name } = body as { email?: string; name?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: 'E-mail invalido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.from('waitlist_emails').insert({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
    })

    if (error) {
      // Unique violation: email already on waitlist
      if (error.code === '23505') {
        return Response.json({ ok: true, already_registered: true })
      }
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, already_registered: false })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
