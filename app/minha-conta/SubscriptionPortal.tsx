'use client'

import { useState } from 'react'
import { PLANS, type PlanConfig } from '@/lib/plans'

interface Subscription {
  id: string
  plan_id: number
  status: string
  period_start?: string | null
  period_end?: string | null
  cancel_at?: string | null
  created_at?: string | null
  metadata?: Record<string, unknown> | null
}

interface Props {
  fornecedorId: string
  subscription: Subscription | null
  activePlan: PlanConfig | null
}

export default function SubscriptionPortal({ fornecedorId, subscription, activePlan }: Props) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')
  const [localSub, setLocalSub] = useState(subscription)
  const [upgradingTo, setUpgradingTo] = useState<number | null>(null)

  const statusLabel: Record<string, string> = {
    active: 'Ativo',
    free: 'Gratuito',
    pending: 'Aguardando pagamento',
    past_due: 'Pagamento em atraso',
    trialing: 'Trial',
    canceled: 'Cancelado',
  }

  const statusColor: Record<string, string> = {
    active: '#16A34A',
    free: '#64748B',
    pending: '#D97706',
    past_due: '#DC2626',
    trialing: '#7C3AED',
    canceled: '#DC2626',
  }

  function formatDate(iso: string | null | undefined) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pt-BR')
  }

  async function cancelarAssinatura() {
    if (!localSub) return
    if (!confirm('Tem certeza? Seu plano continuara ativo ate o fim do periodo pago.')) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: localSub.id, fornecedor_id: fornecedorId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error ?? 'Erro ao cancelar.')
      } else {
        setMsg(`Cancelamento agendado para ${formatDate(data.cancel_at)}`)
        setLocalSub({ ...localSub, cancel_at: data.cancel_at })
      }
    } catch {
      setErro('Erro de conexao.')
    }
    setLoading(false)
  }

  async function reativarAssinatura() {
    if (!localSub) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: localSub.id, fornecedor_id: fornecedorId }),
      })
      if (res.ok) {
        setMsg('Cancelamento desfeito. Sua assinatura continuara ativa.')
        setLocalSub({ ...localSub, cancel_at: null })
      } else {
        setErro('Erro ao desfazer cancelamento.')
      }
    } catch {
      setErro('Erro de conexao.')
    }
    setLoading(false)
  }

  async function mudarPlano(planId: number) {
    setUpgradingTo(planId)
    setErro('')
    try {
      const interval = (localSub?.metadata?.interval as string) ?? 'monthly'
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId, fornecedor_id: fornecedorId, interval }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErro(data.error ?? 'Erro ao processar.')
        setUpgradingTo(null)
        return
      }
      if (planId === 1 || !data.init_point) {
        window.location.href = `/planos/sucesso?fornecedor_id=${fornecedorId}&plan_id=${planId}`
        return
      }
      window.location.href = data.init_point
    } catch {
      setErro('Erro de conexao.')
      setUpgradingTo(null)
    }
  }

  const currentPlanId = localSub?.plan_id ?? 1
  const isCanceling = !!localSub?.cancel_at

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B1F3B', marginBottom: '20px' }}>
        Plano e assinatura
      </h2>

      {msg && (
        <div style={{ padding: '10px 16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#16A34A', fontSize: '13px', marginBottom: '16px' }}>
          {msg}
        </div>
      )}
      {erro && (
        <div style={{ padding: '10px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '13px', marginBottom: '16px' }}>
          {erro}
        </div>
      )}

      {localSub && activePlan ? (
        <>
          {/* Plano atual */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Plano atual</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F3B' }}>{activePlan.name}</div>
                {activePlan.priceMonthly > 0 && (
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    R${activePlan.priceMonthly}/mes
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                  backgroundColor: `${statusColor[localSub.status] ?? '#64748B'}20`,
                  color: statusColor[localSub.status] ?? '#64748B',
                  fontSize: '12px', fontWeight: 600,
                }}>
                  {statusLabel[localSub.status] ?? localSub.status}
                </span>
                {isCanceling && (
                  <div style={{ fontSize: '11px', color: '#D97706', marginTop: '4px' }}>
                    Cancela em {formatDate(localSub.cancel_at)}
                  </div>
                )}
              </div>
            </div>

            {localSub.period_end && localSub.status === 'active' && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#94A3B8' }}>
                Periodo atual: {formatDate(localSub.period_start)} — {formatDate(localSub.period_end)}
              </div>
            )}
          </div>

          {/* Cancelamento */}
          {localSub.status === 'active' && (
            <div style={{ marginBottom: '24px' }}>
              {isCanceling ? (
                <button
                  onClick={reativarAssinatura}
                  disabled={loading}
                  style={{ padding: '8px 16px', backgroundColor: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                  {loading ? 'Aguarde...' : 'Desfazer cancelamento'}
                </button>
              ) : (
                <button
                  onClick={cancelarAssinatura}
                  disabled={loading}
                  style={{ padding: '8px 16px', backgroundColor: 'white', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  {loading ? 'Aguarde...' : 'Cancelar assinatura'}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#92400E', margin: 0 }}>
            Voce nao tem uma assinatura ativa. Escolha um plano para comecar.
          </p>
        </div>
      )}

      {/* Upgrade / Downgrade */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3B', marginBottom: '12px' }}>
          {currentPlanId === 1 ? 'Fazer upgrade' : 'Mudar plano'}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {PLANS.filter(p => p.id !== currentPlanId).map(plan => (
            <button
              key={plan.id}
              onClick={() => mudarPlano(plan.id)}
              disabled={upgradingTo === plan.id}
              style={{
                padding: '10px 20px',
                backgroundColor: plan.id > currentPlanId ? '#0B1F3B' : 'white',
                color: plan.id > currentPlanId ? 'white' : '#64748B',
                border: `1px solid ${plan.id > currentPlanId ? '#0B1F3B' : '#E2E8F0'}`,
                borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                cursor: upgradingTo === plan.id ? 'not-allowed' : 'pointer',
                opacity: upgradingTo === plan.id ? 0.6 : 1,
              }}>
              {upgradingTo === plan.id ? 'Aguarde...' : (
                plan.id > currentPlanId
                  ? `Upgrade para ${plan.name} — R$${plan.priceMonthly}/mes`
                  : `Downgrade para ${plan.name}`
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
        <a href="/planos" style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'none' }}>
          Ver todos os planos e precos
        </a>
      </div>
    </div>
  )
}
