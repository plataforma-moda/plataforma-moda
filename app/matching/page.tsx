'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type F = {
  id: string; nome: string; categoria_nome: string;
  subcategoria_nome: string; especializacao_nome: string;
  cidade: string; estado: string; telefone: string; celular: string;
  moq: string; prazo_medio_dias: string;
}

export default function Matching() {
  const [busca, setBusca] = useState('')
  const [estado, setEstado] = useState('')
  const [resultados, setResultados] = useState<F[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBuscando(true)
    setBuscou(false)

    const termos = busca.trim().toLowerCase().split(/\s+/).filter(Boolean)

    let query = supabase.from('fornecedores').select('*')

    if (termos.length > 0) {
      const filtros = termos.map(termo =>
        `categoria_nome.ilike.%${termo}%,subcategoria_nome.ilike.%${termo}%,especializacao_nome.ilike.%${termo}%,cidade.ilike.%${termo}%,estado.ilike.%${termo}%,nome.ilike.%${termo}%,descricao.ilike.%${termo}%`
      ).join(',')
      query = query.or(filtros)
    }

    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query.limit(12)
    setBuscando(false)
    setBuscou(true)
    if (!error && data) setResultados(data)
  }

  const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', fontSize: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
            <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
          </div>
        </a>
        <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          Cadastrar empresa
        </a>
      </nav>

      <section style={{ backgroundColor: '#0B1F3B', padding: '48px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Encontre o fornecedor ideal</h1>
        <p style={{ color: '#93C5FD', fontSize: '15px', marginBottom: '32px' }}>
          Digite o que precisa — produto, material, servico ou cidade
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder='Ex: camisetas, jaquetas, corta vento, lingerie, malha...'
              style={{ ...inp, flex: 1, minWidth: '300px', fontSize: '15px' }}
            />
            <select value={estado} onChange={e => setEstado(e.target.value)}
              style={{ padding: '12px 16px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', backgroundColor: 'white', minWidth: '120px' }}>
              <option value="">Todos os estados</option>
              {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            <button type="submit" disabled={buscando}
              style={{ padding: '12px 28px', backgroundColor: buscando ? '#94A3B8' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: buscando ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          
        </form>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        {!buscou && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>Digite o que precisa e encontramos os fornecedores certos</p>
          </div>
        )}

        {buscou && resultados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
            <h3 style={{ color: '#0B1F3B', marginBottom: '8px' }}>Nenhum fornecedor encontrado</h3>
            <p style={{ color: '#64748B' }}>Tente outros termos ou ajuste o filtro de estado.</p>
          </div>
        )}

        {buscou && resultados.length > 0 && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F3B' }}>
                {resultados.length} fornecedor{resultados.length > 1 ? 'es' : ''} encontrado{resultados.length > 1 ? 's' : ''}
              </h2>
              <span style={{ fontSize: '13px', color: '#64748B' }}>para "{busca}"</span>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {resultados.map(f => (
                <div key={f.id} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '52px', height: '52px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏭</div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0B1F3B', marginBottom: '6px' }}>{f.nome}</h3>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {f.categoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{f.categoria_nome}</span>}
                        {f.subcategoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#F5F3FF', color: '#5B21B6', padding: '2px 8px', borderRadius: '20px' }}>{f.subcategoria_nome}</span>}
                        {f.especializacao_nome && <span style={{ fontSize: '12px', backgroundColor: '#F0FDF4', color: '#166534', padding: '2px 8px', borderRadius: '20px' }}>{f.especializacao_nome}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {f.cidade && <span style={{ fontSize: '13px', color: '#64748B' }}>📍 {f.cidade} — {f.estado}</span>}
                        {f.moq && <span style={{ fontSize: '13px', color: '#64748B' }}>📦 MOQ: {f.moq}</span>}
                        {f.prazo_medio_dias && <span style={{ fontSize: '13px', color: '#64748B' }}>⏱ {f.prazo_medio_dias} dias</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <a href={`/fornecedores/${f.id}`} style={{ padding: '8px 16px', border: '1px solid #E2E8F0', color: '#0B1F3B', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Ver perfil</a>
                    <a href={`/cotacao/${f.id}`} style={{ padding: '8px 16px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Solicitar cotacao</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2025</div>
      </footer>

    </main>
  )
}