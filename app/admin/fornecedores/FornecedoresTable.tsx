'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

interface Fornecedor {
  id: string
  nome: string
  email: string | null
  cidade: string | null
  estado: string | null
  categoria_nome: string | null
  plano: string | null
  user_id: string | null
  created_at: string
}

interface Props {
  fornecedores: Fornecedor[]
  errorMsg: string | null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

const styles: Record<string, CSSProperties> = {
  main: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
  },
  header: {
    borderBottom: '1px solid #1a3a5c',
    padding: '0 16px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1F3B',
  },
  headerLogo: {
    fontWeight: 700,
    fontSize: '18px',
    color: 'white',
    textDecoration: 'none',
  },
  headerBack: {
    fontSize: '13px',
    color: '#93C5FD',
    textDecoration: 'none',
    border: '1px solid #93C5FD',
    padding: '6px 16px',
    borderRadius: '6px',
  },
  hero: {
    backgroundColor: '#0B1F3B',
    padding: '32px 16px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'white',
    marginBottom: '8px',
  },
  heroSub: {
    color: '#93C5FD',
    fontSize: '14px',
  },
  adminNav: {
    backgroundColor: '#0B1F3B',
    borderTop: '1px solid #1a3a5c',
    padding: '0 16px',
    display: 'flex',
    gap: '0',
    justifyContent: 'center',
  },
  adminNavLink: {
    fontSize: '13px',
    color: '#93C5FD',
    textDecoration: 'none',
    padding: '10px 20px',
    display: 'inline-block',
    borderBottom: '2px solid transparent',
  },
  adminNavLinkActive: {
    fontSize: '13px',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    display: 'inline-block',
    borderBottom: '2px solid #3B82F6',
    fontWeight: 600,
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginBottom: '24px',
  },
  countCard: {
    backgroundColor: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  countNumber: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0B1F3B',
  },
  countLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  searchInput: {
    padding: '10px 16px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '280px',
    maxWidth: '100%',
    backgroundColor: 'white',
  },
  tableCard: {
    backgroundColor: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '700px',
  },
  thead: {
    backgroundColor: '#0B1F3B',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: 600,
    color: '#93C5FD',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#1A202C',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle' as const,
  },
  tdMuted: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#64748B',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle' as const,
  },
  emptyRow: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: '#94A3B8',
    fontSize: '14px',
  },
  planBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    whiteSpace: 'nowrap' as const,
  },
  errorMsg: {
    padding: '14px 18px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#DC2626',
    marginBottom: '20px',
  },
  footer: {
    backgroundColor: '#060F1E',
    padding: '24px 16px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '13px',
    color: '#64748B',
  },
}

function statusBadge(linked: boolean): CSSProperties {
  return {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    backgroundColor: linked ? '#F0FDF4' : '#FEF2F2',
    color: linked ? '#166534' : '#DC2626',
    whiteSpace: 'nowrap',
  }
}

export default function FornecedoresTable({ fornecedores, errorMsg }: Props) {
  const [search, setSearch] = useState('')

  const filtered = fornecedores.filter(f => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      (f.nome ?? '').toLowerCase().includes(q) ||
      (f.email ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <a href="/" style={styles.headerLogo}>SNM</a>
        <a href="/minha-conta" style={styles.headerBack}>← Minha conta</a>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Painel Admin — Fornecedores</h1>
        <p style={styles.heroSub}>Todos os fornecedores cadastrados na plataforma</p>
      </section>

      <nav style={styles.adminNav}>
        <a href="/admin/waitlist" style={styles.adminNavLink}>Waitlist</a>
        <a href="/admin/fornecedores" style={styles.adminNavLinkActive}>Fornecedores</a>
      </nav>

      <div style={styles.container}>
        {errorMsg && (
          <div style={styles.errorMsg}>
            Erro ao carregar dados: {errorMsg}
          </div>
        )}

        <div style={styles.topRow}>
          <div style={styles.countCard}>
            <span style={styles.countNumber}>{filtered.length}</span>
            <span style={styles.countLabel}>
              {filtered.length === 1 ? 'fornecedor' : 'fornecedores'}
              {search ? ' encontrados' : ' cadastrados'}
            </span>
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="table-scroll" style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Cidade / Estado</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Plano</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Data cadastro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.emptyRow}>
                    {search ? 'Nenhum fornecedor encontrado para esta busca.' : 'Nenhum fornecedor cadastrado ainda.'}
                  </td>
                </tr>
              ) : (
                filtered.map((f, index) => (
                  <tr key={f.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F8FAFC' }}>
                    <td style={{ ...styles.tdMuted, width: '40px' }}>{index + 1}</td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>
                      <a href={`/fornecedores/${f.id}`} style={{ color: '#0B1F3B', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                        {f.nome || '—'}
                      </a>
                    </td>
                    <td style={styles.tdMuted}>{f.email || '—'}</td>
                    <td style={styles.tdMuted}>
                      {f.cidade && f.estado
                        ? `${f.cidade} / ${f.estado}`
                        : f.cidade || f.estado || '—'}
                    </td>
                    <td style={styles.tdMuted}>{f.categoria_nome || '—'}</td>
                    <td style={styles.td}>
                      {f.plano ? (
                        <span style={styles.planBadge}>{f.plano}</span>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={statusBadge(!!f.user_id)}>
                        {f.user_id ? 'Vinculado' : 'Sem conta'}
                      </span>
                    </td>
                    <td style={styles.tdMuted}>{f.created_at ? formatDate(f.created_at) : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerText}>2026 Sistema Nacional da Moda</div>
      </footer>
    </main>
  )
}
