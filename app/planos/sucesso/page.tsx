'use client'

import { useEffect, useState } from 'react'
import { getPlanById, type PlanId } from '@/lib/plans'

export default function PlanosSuccesso() {
  const [params, setParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search))
  }, [])

  const fornecedorId = params?.get('fornecedor_id')
  const planId = parseInt(params?.get('plan_id') ?? '1', 10) as PlanId
  const status = params?.get('status') ?? 'approved'
  const plan = getPlanById(planId)

  const isPending = status === 'pending'

  const Navbar = () => (
    <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', height: '64px' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: '1' }}>SNM</div>
          <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: '1' }}>Sistema Nacional da Moda</div>
        </div>
      </a>
    </nav>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>

        {/* Icone de status */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: isPending ? '#FFFBEB' : '#F0FDF4',
          border: `2px solid ${isPending ? '#FDE68A' : '#BBF7D0'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '36px',
        }}>
          {isPending ? '⏳' : '✓'}
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>
          {isPending ? 'Pagamento em analise!' : 'Cadastro concluido!'}
        </h1>

        <p style={{ color: '#64748B', marginBottom: '8px', fontSize: '15px' }}>
          {isPending
            ? `Seu pagamento do plano ${plan.name} esta sendo processado.`
            : plan.priceMonthly === 0
              ? 'Sua empresa ja esta visivel no diretorio do SNM.'
              : `Plano ${plan.name} ativado com sucesso!`}
        </p>

        <p style={{ color: '#94A3B8', marginBottom: '8px', fontSize: '13px' }}>
          {isPending
            ? 'Assim que confirmado, seu plano sera ativado automaticamente. Voce recebera uma notificacao.'
            : 'Compradores de todo o Brasil podem encontrar voce agora.'}
        </p>

        {/* Badge do plano */}
        {plan.priceMonthly > 0 && (
          <div style={{
            display: 'inline-block', marginBottom: '32px',
            backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: '8px', padding: '10px 20px',
          }}>
            <span style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: 600 }}>
              Plano {plan.name} — {plan.priceMonthly === 0 ? 'Gratuito' : `R$${plan.priceMonthly}/mes`}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          {fornecedorId && (
            <a href={`/fornecedores/${fornecedorId}`}
              style={{ padding: '12px 28px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Ver meu perfil
            </a>
          )}
          <a href="/minha-conta"
            style={{ padding: '12px 28px', border: '1px solid #E2E8F0', color: '#0B1F3B', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            Minha conta
          </a>
        </div>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>
    </main>
  )
}
