'use client'

import { useState } from 'react'

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button — hidden on desktop via CSS, visible on mobile */}
      <button
        className="hamburger-btn"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          padding: '8px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown nav */}
      <nav className={`site-header-nav${open ? ' open' : ''}`}>
        <a href="/matching" style={{ color: '#93C5FD', fontSize: '15px', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          Fornecedores
        </a>
        <a href="/polos" style={{ color: '#93C5FD', fontSize: '15px', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          Polos Têxteis
        </a>
        <a href="/planos" style={{ color: '#93C5FD', fontSize: '15px', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          Planos
        </a>
        <a href="/sobre" style={{ color: '#93C5FD', fontSize: '15px', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          Sobre
        </a>
        {isLoggedIn ? (
          <a href="/minha-conta" style={{ display: 'block', textAlign: 'center', backgroundColor: '#3B82F6', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', marginTop: '8px' }}>
            Minha conta
          </a>
        ) : (
          <>
            <a href="/login" style={{ display: 'block', textAlign: 'center', color: '#93C5FD', padding: '12px', textDecoration: 'none', marginTop: '8px' }}>
              Entrar
            </a>
            <a href="/cadastro" style={{ display: 'block', textAlign: 'center', backgroundColor: '#3B82F6', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
              Cadastre grátis
            </a>
          </>
        )}
      </nav>
    </>
  )
}
