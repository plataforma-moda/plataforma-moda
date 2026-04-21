'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Planos() {
  const [selecionado, setSelecionado] = useState<number | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null
  const fornecedorId = params?.get('id')

  async function escolherPlano(planId: number) {
    if (!fornecedorId) {
      setErro('Fornecedor nao identificado. Volte e cadastre novamente.')
      return
    }
    setSelecionado(planId)
    setSalvando(true)
    setErro('')
    const { error } = await supabase.from('subscriptions').insert([{
      fornecedor_id: fornecedorId,
      plan_id: planId,
      status: 'active',
    }])
    setSalvando(false)
    if (error) { setErro('Erro ao salvar plano. Tente novamente.') }
    else { setSucesso(true) }
  }

  const Navbar = () => (
    <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', height: '64px' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
          <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
        </div>
      </a>
    </nav>
  )

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px', border: '2px solid #BBF7D0' }}>
          OK
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Cadastro concluido!</h1>
        <p style={{ color: '#64748B', marginBottom: '8px', fontSize: '15px' }}>
          Sua empresa ja esta visivel no diretorio do SNM.
        </p>
        <p style={{ color: '#94A3B8', marginBottom: '36px', fontSize: '13px' }}>
          Compradores de todo o Brasil podem encontrar voce agora.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/fornecedores/${fornecedorId}`} style={{ padding: '12px 28px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Ver meu perfil
          </a>
          <a href="/" style={{ padding: '12px 28px', border: '1px solid #E2E8F0', color: '#0B1F3B', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            Voltar para home
          </a>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ backgroundColor: '#0B1F3B', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#2C5282', color: '#93C5FD', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, marginBottom: '16px' }}>
          Cadastro quase concluido
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Escolha como quer aparecer no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Comece gratuitamente — sem cartao de credito</p>
      </section>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>

          {/* FREE */}
          <div style={{ backgroundColor: 'white', border: `2px solid ${selecionado === 1 ? '#3B82F6' : '#E2E8F0'}`, borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '8px' }}>GRATUITO</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '4px' }}>R$ 0</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>para sempre</div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>Ideal para comecar e testar a plataforma</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Perfil basico no diretorio', 'Aparece nas buscas', '5 contatos por mes', 'Sem destaque no ranking'].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#374151', display: 'flex', gap: '8px' }}>
                  <span style={{ color: i < 2 ? '#16A34A' : '#94A3B8', fontWeight: 700 }}>{i < 2 ? 'v' : 'x'}</span>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => escolherPlano(1)} disabled={salvando && selecionado === 1}
              style={{ marginTop: 'auto', padding: '12px', backgroundColor: selecionado === 1 ? '#0B1F3B' : 'white', color: selecionado === 1 ? 'white' : '#0B1F3B', border: '2px solid #0B1F3B', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              {salvando && selecionado === 1 ? 'Salvando...' : 'Comecar gratuitamente'}
            </button>
          </div>

          {/* BASIC */}
          <div style={{ backgroundColor: 'white', border: `2px solid ${selecionado === 2 ? '#3B82F6' : '#3B82F6'}`, borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3B82F6', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Mais popular
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#3B82F6', letterSpacing: '0.05em', marginBottom: '8px' }}>BASIC</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '4px' }}>Em breve</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>por mes</div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>Para fornecedores que querem crescer</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Perfil completo com fotos', '25 contatos por mes', 'Destaque na busca', 'Aparece antes do FREE', 'Suporte por e-mail'].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#374151', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>v</span>
                  {item}
                </li>
              ))}
            </ul>
            <button disabled style={{ marginTop: 'auto', padding: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', border: '2px solid #3B82F6', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'not-allowed' }}>
              Em breve
            </button>
          </div>

          {/* PRO */}
          <div style={{ backgroundColor: 'white', border: `2px solid ${selecionado === 3 ? '#3B82F6' : '#E2E8F0'}`, borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '8px' }}>PRO</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0B1F3B', marginBottom: '4px' }}>Em breve</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>por mes</div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>Maximo alcance e prioridade total</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Contatos ilimitados', 'Topo do ranking no matching', 'Badge verificado', 'Relatorios de desempenho', 'Suporte prioritario'].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#374151', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>v</span>
                  {item}
                </li>
              ))}
            </ul>
            <button disabled style={{ marginTop: 'auto', padding: '12px', backgroundColor: '#F8FAFC', color: '#94A3B8', border: '2px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'not-allowed' }}>
              Em breve
            </button>
          </div>

        </div>

        {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px', textAlign: 'center' }}>{erro}</div>}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
          Todos os planos incluem acesso ao diretorio e recebimento de cotacoes. Sem cartao de credito para comecar.
        </p>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}
