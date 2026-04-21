'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type F = {
  id: string; nome: string; categoria_nome: string;
  subcategoria_nome: string; especializacao_nome: string;
  cidade: string; estado: string; telefone: string; celular: string;
  moq: string; prazo_medio_dias: string; polo_textil: string;
}

type Polo = { id: number; nome: string; estado: string }

export default function Matching() {
  const [busca, setBusca] = useState('')
  const [estado, setEstado] = useState('')
  const [poloId, setPoloId] = useState('')
  const [polos, setPolos] = useState<Polo[]>([])
  const [resultados, setResultados] = useState<F[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    async function loadPolos() {
      const { data } = await supabase.from('polos_texteis').select('id, nome, estado').order('nome')
      if (data) setPolos(data)
    }
    loadPolos()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBuscando(true)
    setBuscou(false)

    let query = supabase.from('fornecedores').select('*')

    if (poloId) {
      const polo = polos.find(p => p.id === Number(poloId))
      if (polo) query = query.ilike('polo_textil', `%${polo.nome}%`)
    }

    const termos = busca.trim().toLowerCase().split(/\s+/).filter(Boolean)
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

  const inp: React.CSSProperties = { padding: '12px 16px', fontSize: '14px', border: '1px solid #1a3a5c', borderRadius: '8px', outline: 'none', backgroundColor: '#0F2844', color: 'white', boxSizing: 'border-box' }

  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0B1F3B', minHeight: '100vh' }}>

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#0B1F3B', zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/polos" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Polos Texteis</a>
          <a href="/cadastro" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Cadastrar empresa</a>
          <a href="/sobre" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Sobre</a>
        </nav>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '60px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Encontre o fornecedor ideal</h1>
        <p style={{ color: '#93C5FD', fontSize: '15px', marginBottom: '40px' }}>
          Busque por produto, material, servico ou polo textil
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Ex: camisetas, jaquetas, corta vento, lingerie, malha..."
              style={{ ...inp, flex: 1, minWidth: '280px' }}
            />
            <select value={estado} onChange={e => setEstado(e.target.value)}
              style={{ ...inp, minWidth: '130px' }}>
              <option value="">Todos os estados</option>
              {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            <button type="submit" disabled={buscando}
              style={{ padding: '12px 28px', backgroundColor: buscando ? '#94A3B8' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: buscando ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>ou buscar por polo:</span>
            <select value={poloId} onChange={e => setPoloId(e.target.value)}
              style={{ ...inp, minWidth: '200px', fontSize: '13px' }}>
              <option value="">Selecione um polo textil</option>
              {polos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.estado}</option>)}
            </select>
            {poloId && (
              <button type="submit" disabled={buscando}
                style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Buscar neste polo
              </button>
            )}
          </div>
        </form>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        {!buscou && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>Digite o que precisa ou selecione um polo textil</p>
          </div>
        )}

        {buscou && resultados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#0F2844', borderRadius: '16px', border: '1px solid #1a3a5c' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
            <h3 style={{ color: 'white', marginBottom: '8px' }}>Nenhum fornecedor encontrado</h3>
            <p style={{ color: '#64748B' }}>Tente outros termos ou ajuste o filtro de estado.</p>
          </div>
        )}

        {buscou && resultados.length > 0 && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                {resultados.length} fornecedor{resultados.length > 1 ? 'es' : ''} encontrado{resultados.length > 1 ? 's' : ''}
              </h2>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                {poloId ? `Polo: ${polos.find(p => p.id === Number(poloId))?.nome}` : `"${busca}"`}
              </span>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {resultados.map(f => (
                <div key={f.id} style={{ backgroundColor: '#0F2844', border: '1px solid #1a3a5c', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '52px', height: '52px', backgroundColor: '#0B1F3B', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏭</div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>{f.nome}</h3>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {f.categoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#0B1F3B', color: '#93C5FD', padding: '2px 8px', borderRadius: '20px', border: '1px solid #1a3a5c' }}>{f.categoria_nome}</span>}
                        {f.subcategoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#0B1F3B', color: '#C4B5FD', padding: '2px 8px', borderRadius: '20px', border: '1px solid #1a3a5c' }}>{f.subcategoria_nome}</span>}
                        {f.polo_textil && <span style={{ fontSize: '12px', backgroundColor: '#0B1F3B', color: '#86EFAC', padding: '2px 8px', borderRadius: '20px', border: '1px solid #1a3a5c' }}>📍 {f.polo_textil}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {f.cidade && <span style={{ fontSize: '13px', color: '#64748B' }}>📍 {f.cidade} — {f.estado}</span>}
                        {f.moq && <span style={{ fontSize: '13px', color: '#64748B' }}>📦 MOQ: {f.moq}</span>}
                        {f.prazo_medio_dias && <span style={{ fontSize: '13px', color: '#64748B' }}>⏱ {f.prazo_medio_dias} dias</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <a href={`/fornecedores/${f.id}`} style={{ padding: '8px 16px', border: '1px solid #1a3a5c', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Ver perfil</a>
                    <a href={`/cotacao/${f.id}`} style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Solicitar cotacao</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '40px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>
          2025 Sistema Nacional da Moda — Infraestrutura de dados da cadeia produtiva
        </div>
      </footer>

    </main>
  )
}