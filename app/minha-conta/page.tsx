import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPlanById, type PlanId } from '@/lib/plans'
import SubscriptionPortal from './SubscriptionPortal'

export default async function MinhaConta() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: fornecedor } = await supabase
    .from('fornecedores')
    .select('id, nome, email, cidade, estado, categoria_nome')
    .eq('user_id', user.id)
    .single()

  // Buscar subscription ativa
  let subscription = null
  if (fornecedor) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, plan_id, status, period_start, period_end, cancel_at, created_at, metadata')
      .eq('fornecedor_id', fornecedor.id)
      .in('status', ['active', 'free', 'trialing', 'pending', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    subscription = sub
  }

  const activePlan = subscription ? getPlanById(subscription.plan_id as PlanId) : null

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <form action={handleLogout}>
          <button type="submit" style={{ background: 'none', border: '1px solid #93C5FD', color: '#93C5FD', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            Sair
          </button>
        </form>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Minha conta</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>{user.email}</p>
      </section>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Dados do fornecedor */}
        {fornecedor ? (
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B1F3B', marginBottom: '16px' }}>Seu cadastro de fornecedor</h2>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Empresa: </span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A202C' }}>{fornecedor.nome}</span>
            </div>
            {fornecedor.categoria_nome && (
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Categoria: </span>
                <span style={{ fontSize: '14px', color: '#1A202C' }}>{fornecedor.categoria_nome}</span>
              </div>
            )}
            {fornecedor.cidade && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Local: </span>
                <span style={{ fontSize: '14px', color: '#1A202C' }}>{fornecedor.cidade}{fornecedor.estado ? ` — ${fornecedor.estado}` : ''}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href={`/editar/${fornecedor.id}`} style={{ padding: '10px 20px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                Editar cadastro
              </a>
              <a href={`/fornecedores/${fornecedor.id}`} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', color: '#0B1F3B', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                Ver meu perfil
              </a>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B1F3B', marginBottom: '12px' }}>Voce ainda nao tem um cadastro de fornecedor</h2>
            <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '14px' }}>Cadastre sua empresa para aparecer no diretorio do SNM.</p>
            <a href="/cadastro" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Cadastrar empresa
            </a>
          </div>
        )}

        {/* Portal da assinatura */}
        {fornecedor && (
          <SubscriptionPortal
            fornecedorId={fornecedor.id}
            subscription={subscription}
            activePlan={activePlan}
          />
        )}

        {/* Vincular fornecedor */}
        {!fornecedor && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0B1F3B', marginBottom: '12px' }}>Vincular fornecedor existente</h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
              Se sua empresa ja esta cadastrada no SNM mas ainda nao esta vinculada a sua conta, entre em contato pelo e-mail{' '}
              <strong>contato@snmoda.com.br</strong> informando o CNPJ.
            </p>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>2026 Sistema Nacional da Moda</div>
      </footer>
    </main>
  )
}
