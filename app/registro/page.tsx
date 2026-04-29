'use client'

import { useState, useEffect, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function Registro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)

  // Load Turnstile script once if site key is configured
  useEffect(() => {
    if (!SITE_KEY) return
    if (document.getElementById('cf-turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas nao coincidem.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    // Read Turnstile token if widget is present
    let turnstileToken: string | undefined
    if (SITE_KEY && turnstileRef.current) {
      const tokenInput = turnstileRef.current.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')
      turnstileToken = tokenInput?.value || undefined
      if (!turnstileToken) {
        setErro('Complete a verificacao de seguranca.')
        return
      }
    }

    setCarregando(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha, turnstileToken }),
    })

    setCarregando(false)

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setErro(data.error ?? 'Erro ao criar conta. Tente novamente.')
      // Reset Turnstile widget on failure
      if (SITE_KEY && typeof window !== 'undefined' && (window as Window & { turnstile?: { reset: () => void } }).turnstile) {
        (window as Window & { turnstile?: { reset: () => void } }).turnstile?.reset()
      }
      return
    }

    setSucesso(true)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: '14px',
    border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none',
    marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white',
  }
  const lbl: React.CSSProperties = {
    fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block',
  }

  if (sucesso) {
    return (
      <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
        <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', backgroundColor: '#0B1F3B' }}>
          <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        </header>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Verifique seu e-mail</h1>
          <p style={{ color: '#64748B', marginBottom: '8px' }}>
            Enviamos um link de confirmacao para <strong>{email}</strong>.
          </p>
          <p style={{ color: '#64748B', marginBottom: '32px' }}>
            Clique no link do e-mail para ativar sua conta e depois faca login.
          </p>
          <a href="/login" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Ir para o login
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/login" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Ja tenho conta</a>
      </header>

      <section className="auth-hero" style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Criar conta no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Cadastre-se para gerenciar sua empresa na plataforma</p>
      </section>

      <div className="auth-body" style={{ maxWidth: '440px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="auth-card" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="seu@email.com" style={inp}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Senha</label>
              <input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                required placeholder="Minimo 6 caracteres" style={inp} minLength={6}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={lbl}>Confirmar senha</label>
              <input
                type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                required placeholder="Repita a senha" style={inp} minLength={6}
              />
            </div>

            {/* Cloudflare Turnstile widget — only rendered when site key is set */}
            {SITE_KEY && (
              <div
                ref={turnstileRef}
                className="cf-turnstile"
                data-sitekey={SITE_KEY}
                style={{ marginBottom: '20px' }}
              />
            )}

            {erro && (
              <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
                {erro}
              </div>
            )}

            <button type="submit" disabled={carregando} style={{
              width: '100%', padding: '14px', backgroundColor: carregando ? '#94A3B8' : '#0B1F3B',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px',
              fontWeight: 600, cursor: carregando ? 'not-allowed' : 'pointer',
            }}>
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
            Ja tem conta?{' '}
            <a href="/login" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
              Fazer login
            </a>
          </div>
        </div>
      </div>

      <footer className="auth-footer" style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>2026 Sistema Nacional da Moda</div>
      </footer>

    </main>
  )
}
