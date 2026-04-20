'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const planos = [
  {
    id: 1,
    nome: 'FREE',
    preco: 'R$ 0',
    periodo: 'para sempre',
    descricao: 'Ideal para comecar e testar a plataforma',
    cor: '#888',
    bg: '#f9f9f9',
    border: '#ddd',
    items: [
      '5 leads por mes',
      'Perfil basico no diretorio',
      'Aparece na busca',
      'Sem destaque no ranking',
      'Sem suporte prioritario',
    ],
    destaque: false,
  },
  {
    id: 2,
    nome: 'BASIC',
    preco: 'R$ 97',
    periodo: 'por mes',
    descricao: 'Para fornecedores que querem crescer',
    cor: '#0C447C',
    bg: '#E6F1FB',
    border: '#378ADD',
    items: [
      '25 leads por mes',
      'Perfil completo com fotos',
      'Destaque na busca',
      'Aparece antes do FREE',
      'Suporte por e-mail',
    ],
    destaque: false,
  },
  {
    id: 3,
    nome: 'PRO',
    preco: 'R$ 297',
    periodo: 'por mes',
    descricao: 'Maximo alcance e prioridade total',
    cor: '#27500A',
    bg: '#EAF3DE',
    border: '#639922',
    items: [
      'Leads ilimitados',
      'Topo do ranking no matching',
      'Badge verificado',
      'Relatorios de desempenho',
      'Suporte prioritario',
    ],
    destaque: true,
  },
]

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
    if (error) {
      setErro('Erro ao salvar plano. Tente novamente.')
    } else {
      setSucesso(true)
    }
  }

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>OK</div>
      <h1 style={{ fontSize: '26px', color: '#1E3A5F', marginBottom: '12px' }}>Tudo certo!</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Seu cadastro esta completo. Seu perfil ja esta disponivel no diretorio.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={`/fornecedores/${fornecedorId}`} style={{ padding: '12px 24px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
          Ver meu perfil
        </a>
        <a href="/" style={{ padding: '12px 24px', border: '1px solid #1E3A5F', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
          Voltar para home
        </a>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      <header style={{ textAlign: 'center', padding: '40px 0', borderBottom: '1px solid #eee', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginBottom: '10px' }}>Escolha seu plano</h1>
        <p style={{ color: '#666', fontSize: '15px' }}>Voce pode mudar de plano a qualquer momento</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {planos.map((p) => (
          <div key={p.id} style={{
            padding: '28px 24px',
            border: `2px solid ${selecionado === p.id ? p.border : '#eee'}`,
            borderRadius: '16px',
            backgroundColor: selecionado === p.id ? p.bg : '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            transition: 'all 0.2s',
          }}>
            {p.destaque && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1E3A5F', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Mais popular
              </div>
            )}

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: p.cor, marginBottom: '6px' }}>{p.nome}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1E3A5F', marginBottom: '2px' }}>{p.preco}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{p.periodo}</div>
            </div>

            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{p.descricao}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {p.items.map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#444', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#1D9E75', fontWeight: 700, flexShrink: 0 }}>v</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => escolherPlano(p.id)}
              disabled={salvando && selecionado === p.id}
              style={{
                marginTop: 'auto',
                padding: '12px',
                backgroundColor: selecionado === p.id ? p.border : '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {salvando && selecionado === p.id ? 'Salvando...' : `Escolher ${p.nome}`}
            </button>
          </div>
        ))}
      </div>

      {erro && (
        <div style={{ padding: '12px', backgroundColor: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px', marginBottom: '16px', color: '#791F1F', fontSize: '14px', textAlign: 'center' }}>
          {erro}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#888' }}>
        Todos os planos incluem acesso ao diretorio e recebimento de cotacoes.
      </p>

    </main>
  )
}