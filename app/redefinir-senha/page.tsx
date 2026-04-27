'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RedefinirSenha() {
  const supabase = createClient()
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas nao coincidem.')
      return
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    setCarregando(false)

    if (error) {
      setErro('Erro ao redefinir a senha. O link pode ter expirado. Solicite um novo.')
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

  function EyeButton({ mostrar, toggle }: { mostrar: boolean; toggle: () => void }) {
    return (
      <button
        type="button"
        onClick={toggle}
        style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0',
          color: '#64748B', display: 'flex', alignItems: 'center',
        }}
        aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {mostrar ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
      </header>

      <section className="auth-hero" style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Redefinir senha</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Escolha uma nova senha para sua conta</p>
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
                Sua senha foi redefinida com sucesso!
              </p>
              <a href="/login" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                Fazer login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={lbl}>Nova senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                    required placeholder="Minimo 6 caracteres"
                    style={{ ...inp, paddingRight: '44px' }}
                    minLength={6}
                  />
                  <EyeButton mostrar={mostrarNovaSenha} toggle={() => setMostrarNovaSenha(v => !v)} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={lbl}>Confirmar nova senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                    required placeholder="Repita a senha"
                    style={{ ...inp, paddingRight: '44px' }}
                    minLength={6}
                  />
                  <EyeButton mostrar={mostrarConfirmarSenha} toggle={() => setMostrarConfirmarSenha(v => !v)} />
                </div>
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
                {carregando ? 'Salvando...' : 'Redefinir senha'}
              </button>
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
