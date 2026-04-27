'use client'

import { useState, useEffect } from 'react'
import { PLANS } from '@/lib/plans'
import type { ThresholdStatus } from '@/app/api/launch/threshold/route'

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  return (
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
}

// ── Progress Gate ────────────────────────────────────────────────────────────
function LaunchGate({ status }: { status: ThresholdStatus }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [waitlistDone, setWaitlistDone] = useState(false)
  const [waitlistError, setWaitlistError] = useState('')

  const remaining = status.threshold_value - status.current_value

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setWaitlistError('')
    try {
      const res = await fetch('/api/launch/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setWaitlistError(data.error ?? 'Erro ao cadastrar. Tente novamente.')
      } else {
        setWaitlistDone(true)
      }
    } catch {
      setWaitlistError('Erro de conexao. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 20px' }}>

      {/* Banner motivacional */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.03em' }}>
          LANCAMENTO EM BREVE
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px', lineHeight: '1.3' }}>
          Estamos montando a maior rede de fornecedores da moda
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto' }}>
          As vendas serao liberadas quando atingirmos {status.threshold_value} fornecedores cadastrados. Assim voce tem acesso a uma plataforma completa desde o primeiro dia.
        </p>
      </div>

      {/* Progress card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3B' }}>Progresso de cadastros</span>
          <span style={{ fontSize: '13px', color: '#64748B' }}>
            <strong style={{ color: '#0B1F3B', fontSize: '20px' }}>{status.current_value}</strong>
            {' '}/{' '}{status.threshold_value} fornecedores
          </span>
        </div>

        {/* Barra de progresso */}
        <div style={{ backgroundColor: '#E2E8F0', borderRadius: '99px', height: '14px', overflow: 'hidden', marginBottom: '8px' }}>
          <div
            style={{
              height: '100%',
              width: `${status.percentage}%`,
              backgroundColor: status.percentage >= 80 ? '#16A34A' : '#3B82F6',
              borderRadius: '99px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
          <span>{status.percentage}% concluido</span>
          <span>Faltam {remaining} fornecedores</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F3B' }}>{status.current_value}</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Fornecedores cadastrados</div>
          </div>
          {status.categories_count > 0 && (
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F3B' }}>{status.categories_count}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Categorias disponíveis</div>
            </div>
          )}
          <div style={{ flex: 1, textAlign: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F3B' }}>{remaining}</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Faltam para abertura</div>
          </div>
        </div>
      </div>

      {/* Waitlist form */}
      <div style={{ backgroundColor: '#0B1F3B', borderRadius: '16px', padding: '32px', marginBottom: '28px' }}>
        <h3 style={{ color: 'white', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>
          Seja notificado na abertura
        </h3>
        <p style={{ color: '#93C5FD', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
          Cadastre seu e-mail e avise quando as vendas forem liberadas. Sem spam.
        </p>

        {waitlistDone ? (
          <div style={{ backgroundColor: '#1E3A5F', border: '1px solid #2C5282', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>✓</div>
            <div style={{ color: '#93C5FD', fontSize: '14px', fontWeight: 600 }}>Voce esta na lista!</div>
            <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Enviaremos um e-mail assim que as vendas abrirem.</div>
          </div>
        ) : (
          <form onSubmit={handleWaitlist} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #1E3A5F', backgroundColor: '#1E3A5F', color: 'white', fontSize: '14px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #2C5282', backgroundColor: '#1E3A5F', color: 'white', fontSize: '14px', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '12px 22px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, whiteSpace: 'nowrap' }}
              >
                {submitting ? 'Aguarde...' : 'Entrar na lista'}
              </button>
            </div>
            {waitlistError && (
              <div style={{ color: '#FCA5A5', fontSize: '13px' }}>{waitlistError}</div>
            )}
          </form>
        )}
      </div>

      {/* CTA cadastro fornecedor */}
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px' }}>
        <p style={{ fontSize: '14px', color: '#166534', marginBottom: '12px', fontWeight: 500 }}>
          Voce e fornecedor? Cada cadastro nos aproxima da abertura!
        </p>
        <a
          href="/cadastro"
          style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#16A34A', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
        >
          Cadastrar minha empresa
        </a>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Planos() {
  const [selecionado, setSelecionado] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [termosAceitos, setTermosAceitos] = useState(false)
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [threshold, setThreshold] = useState<ThresholdStatus | null>(null)
  const [thresholdLoading, setThresholdLoading] = useState(true)

  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null
  const fornecedorId = params?.get('id')
  const paymentStatus = params?.get('payment')

  useEffect(() => {
    fetch('/api/launch/threshold')
      .then(r => r.json())
      .then((data: ThresholdStatus) => setThreshold(data))
      .catch(() => setThreshold({ is_met: true, enabled: false, current_value: 0, threshold_value: 200, percentage: 100, categories_count: 0 }))
      .finally(() => setThresholdLoading(false))
  }, [])

  const salesOpen = !threshold || threshold.is_met

  async function escolherPlano(planId: number) {
    const planIsFree = planId === 1
    if (!salesOpen && !planIsFree) {
      setErro('As vendas ainda nao estao liberadas. Acompanhe o progresso acima.')
      return
    }
    if (!fornecedorId) {
      setErro('Fornecedor nao identificado. Volte e cadastre novamente.')
      return
    }
    if (!termosAceitos) {
      setErro('Voce precisa aceitar os Termos de Uso para continuar.')
      return
    }
    setErro('')
    setSelecionado(planId)
    setLoading(true)

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId, fornecedor_id: fornecedorId, interval }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setErro(data.error ?? 'Erro ao processar. Tente novamente.')
        setLoading(false)
        setSelecionado(null)
        return
      }

      if (planId === 1 || !data.init_point) {
        window.location.href = `/planos/sucesso?fornecedor_id=${fornecedorId}&plan_id=${planId}`
        return
      }

      window.location.href = data.init_point
    } catch {
      setErro('Erro de conexao. Tente novamente.')
      setLoading(false)
      setSelecionado(null)
    }
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ backgroundColor: '#0B1F3B', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#2C5282', color: '#93C5FD', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, marginBottom: '16px' }}>
          {fornecedorId ? 'Cadastro quase concluido' : 'Planos e Precos'}
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
          Escolha como quer aparecer no SNM
        </h1>
        <p style={{ color: '#93C5FD', fontSize: '14px', marginBottom: '24px' }}>
          Plano gratuito disponivel — sem cartao de credito
        </p>

        {/* Toggle mensal/anual */}
        <div style={{ display: 'inline-flex', backgroundColor: '#1E3A5F', borderRadius: '8px', padding: '4px', gap: '4px' }}>
          <button
            onClick={() => setInterval('monthly')}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              backgroundColor: interval === 'monthly' ? 'white' : 'transparent',
              color: interval === 'monthly' ? '#0B1F3B' : '#93C5FD',
              fontWeight: 600, fontSize: '13px',
            }}>
            Mensal
          </button>
          <button
            onClick={() => setInterval('yearly')}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              backgroundColor: interval === 'yearly' ? 'white' : 'transparent',
              color: interval === 'yearly' ? '#0B1F3B' : '#93C5FD',
              fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
            Anual
            <span style={{ backgroundColor: '#16A34A', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>
              -20%
            </span>
          </button>
        </div>
      </section>

      {/* Gate: progress + waitlist quando vendas fechadas */}
      {!thresholdLoading && threshold && !threshold.is_met && (
        <>
          {/* Aviso no topo */}
          <div style={{ backgroundColor: '#FFFBEB', borderBottom: '1px solid #FDE68A', padding: '14px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#92400E', fontWeight: 500 }}>
              Vendas ainda nao liberadas — acompanhe o progresso abaixo e entre na lista de espera
            </span>
          </div>
          <LaunchGate status={threshold} />
        </>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 20px' }}>

        {/* Titulo da secao de planos quando gate ativo */}
        {!thresholdLoading && threshold && !threshold.is_met && (
          <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#0B1F3B', marginBottom: '8px' }}>
            Veja os planos disponíveis na abertura
          </h2>
        )}
        {!thresholdLoading && threshold && !threshold.is_met && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginBottom: '32px' }}>
            Os planos abaixo estarao disponiveis assim que atingirmos {threshold.threshold_value} fornecedores.
          </p>
        )}

        {paymentStatus === 'failure' && (
          <div style={{ padding: '14px 20px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', marginBottom: '24px', color: '#DC2626', fontSize: '14px', textAlign: 'center' }}>
            Pagamento nao aprovado. Tente novamente ou escolha outra forma de pagamento.
          </div>
        )}

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
          {PLANS.map((plan) => {
            const price = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly
            const priceMonthEquivalent = interval === 'yearly' ? plan.priceYearly / 12 : plan.priceMonthly
            const isFree = plan.priceMonthly === 0
            const isSelected = selecionado === plan.id
            const isHighlighted = !!plan.highlight
            const isBlocked = !salesOpen && !isFree

            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: 'white',
                  border: `2px solid ${isSelected ? '#3B82F6' : isHighlighted ? '#3B82F6' : '#E2E8F0'}`,
                  borderRadius: '16px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  position: 'relative',
                  boxShadow: isHighlighted ? '0 8px 32px rgba(59,130,246,0.15)' : 'none',
                  opacity: isBlocked ? 0.75 : 1,
                }}>

                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3B82F6', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {plan.highlight}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: isHighlighted ? '#3B82F6' : '#64748B', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {plan.name}
                  </div>
                  {isFree ? (
                    <>
                      <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '4px' }}>R$ 0</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>para sempre</div>
                    </>
                  ) : interval === 'yearly' ? (
                    <>
                      <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '2px' }}>
                        R$ {priceMonthEquivalent.toFixed(0).replace('.', ',')}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>por mes — cobrado anualmente</div>
                      <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 500 }}>
                        Total: R$ {price.toFixed(2).replace('.', ',')}/ano
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '4px' }}>
                        R$ {price.toFixed(0)}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>por mes</div>
                    </>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{plan.tagline}</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((feat, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#374151', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: feat.included ? '#16A34A' : '#CBD5E1', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>
                        {feat.included ? '✓' : '✗'}
                      </span>
                      <span style={{ color: feat.included ? '#374151' : '#94A3B8' }}>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => escolherPlano(plan.id)}
                  disabled={(loading && isSelected) || isBlocked}
                  style={{
                    marginTop: 'auto',
                    padding: '13px',
                    backgroundColor: isBlocked
                      ? '#E2E8F0'
                      : isHighlighted
                        ? '#3B82F6'
                        : isSelected
                          ? '#0B1F3B'
                          : 'white',
                    color: isBlocked
                      ? '#94A3B8'
                      : isHighlighted || isSelected
                        ? 'white'
                        : '#0B1F3B',
                    border: `2px solid ${isBlocked ? '#E2E8F0' : isHighlighted ? '#3B82F6' : '#0B1F3B'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: (loading && isSelected) || isBlocked ? 'not-allowed' : 'pointer',
                    opacity: loading && isSelected ? 0.7 : 1,
                    transition: 'all 0.15s',
                  }}>
                  {isBlocked
                    ? 'Disponivel em breve'
                    : loading && isSelected
                      ? 'Aguarde...'
                      : isFree
                        ? 'Comecar gratuitamente'
                        : `Assinar ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {erro && (
          <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px', textAlign: 'center' }}>
            {erro}
          </div>
        )}

        {salesOpen && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={termosAceitos}
                onChange={e => setTermosAceitos(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#0B1F3B', flexShrink: 0, marginTop: '2px' }}
              />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                Li e aceito os{' '}
                <a href="/termos-fornecedor" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Termos de Uso</a>
                {' '}e a{' '}
                <a href="/privacidade" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Politica de Privacidade</a>
                {' '}do Sistema Nacional da Moda. <strong>*</strong>
              </span>
            </label>
          </div>
        )}

        {/* Formas de pagamento */}
        {salesOpen && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Pagamento processado com seguranca pelo Mercado Pago</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {['Pix', 'Boleto', 'Cartao de credito'].map((m) => (
                <span key={m} style={{ fontSize: '12px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
          Todos os planos incluem acesso ao diretorio e recebimento de cotacoes.
        </p>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '10px' }}>SNM - Sistema Nacional da Moda 2026</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href="/termos-fornecedor" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Fornecedor</a>
          <a href="/termos-cliente" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Cliente</a>
          <a href="/privacidade" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Politica de Privacidade</a>
        </div>
      </footer>
    </main>
  )
}
