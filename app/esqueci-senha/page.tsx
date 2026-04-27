'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default function EsqueciSenha() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: APP_URL + '/auth/callback?next=/redefinir-senha',
    })

    setCarregando(false)

    if (error) {
      setErro('Erro ao enviar o e-mail. Tente novamente.')
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

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/login" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Voltar ao login</a>
      </header>

      <section className="auth-hero" style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Esqueci minha senha</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Enviaremos um link para redefinir sua senha</p>
      </section>

      <div className="auth-body" style={{ maxWidth: '440px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="auth-card" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>

          {sucesso ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                Se este e-mail estiver cadastrado, voce recebera um link para redefinir sua senha.
              </p>
              <a href="/login" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                Voltar ao login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={lbl}>E-mail</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="seu@email.com" style={inp}
                />
              </div>

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
                {carregando ? 'Enviando...' : 'Enviar link de redefinicao'}
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
                <a href="/login" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
                  Voltar ao login
                </a>
              </div>
            </form>
          )}

        </div>
      </div>

      <footer className="auth-footer" style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>2026 Sistema Nacional da Moda</div>
      </footer>

    </main>
  )
}
