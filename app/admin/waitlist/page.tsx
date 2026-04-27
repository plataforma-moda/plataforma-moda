import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { CSSProperties } from 'react'

const ADMIN_EMAIL = 'financeiro@raafco.com.br'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export default async function AdminWaitlist() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: waitlist, error } = await supabase
    .from('waitlist_emails')
    .select('*')
    .order('created_at', { ascending: false })

  const entries = waitlist ?? []

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
    container: {
      maxWidth: '860px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    countCard: {
      backgroundColor: 'white',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px 28px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    countNumber: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#0B1F3B',
    },
    countLabel: {
      fontSize: '14px',
      color: '#64748B',
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
    },
    thead: {
      backgroundColor: '#0B1F3B',
    },
    th: {
      padding: '14px 20px',
      textAlign: 'left' as const,
      fontSize: '12px',
      fontWeight: 600,
      color: '#93C5FD',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    td: {
      padding: '14px 20px',
      fontSize: '14px',
      color: '#1A202C',
      borderBottom: '1px solid #F1F5F9',
    },
    tdDate: {
      padding: '14px 20px',
      fontSize: '13px',
      color: '#64748B',
      borderBottom: '1px solid #F1F5F9',
    },
    emptyRow: {
      padding: '40px 20px',
      textAlign: 'center' as const,
      color: '#94A3B8',
      fontSize: '14px',
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

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <a href="/" style={styles.headerLogo}>SNM</a>
        <a href="/minha-conta" style={styles.headerBack}>← Minha conta</a>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Painel Admin — Waitlist</h1>
        <p style={styles.heroSub}>Emails cadastrados na lista de espera</p>
      </section>

      <div style={styles.container}>
        {error && (
          <div style={styles.errorMsg}>
            Erro ao carregar dados: {error.message}
          </div>
        )}

        <div style={styles.countCard}>
          <span style={styles.countNumber}>{entries.length}</span>
          <span style={styles.countLabel}>
            {entries.length === 1 ? 'email cadastrado' : 'emails cadastrados'}
          </span>
        </div>

        <div className="table-scroll" style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Data de cadastro</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} style={styles.emptyRow}>
                    Nenhum email cadastrado ainda.
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry.id ?? index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F8FAFC' }}>
                    <td style={{ ...styles.td, color: '#94A3B8', width: '48px' }}>{index + 1}</td>
                    <td style={styles.td}>{entry.email}</td>
                    <td style={styles.tdDate}>{entry.created_at ? formatDate(entry.created_at) : '—'}</td>
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
