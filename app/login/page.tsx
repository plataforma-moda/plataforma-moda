'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : 'Erro ao fazer login. Tente novamente.'
      )
      setCarregando(false)
      return
    }

    // Redirect to the page they came from, or home
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect') || '/'
    window.location.href = redirect
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

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/registro" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Criar conta</a>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Entrar no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Acesse sua conta para gerenciar seu cadastro</p>
      </section>

      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="seu@email.com" style={inp}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={lbl}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha} onChange={e => setSenha(e.target.value)}
                  required placeholder="Sua senha"
                  style={{ ...inp, paddingRight: '44px' }}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                    color: '#64748B', display: 'flex', alignItems: 'center',
                  }}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    // Eye-off icon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <a href="/esqueci-senha" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none' }}>
                Esqueci minha senha
              </a>
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
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
            Nao tem conta?{' '}
            <a href="/registro" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
              Criar conta gratuita
            </a>
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>2026 Sistema Nacional da Moda</div>
      </footer>

    </main>
  )
}
