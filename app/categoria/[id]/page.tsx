'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = { id: number; name: string }
type Subcategory = { id: number; name: string; category_id: number }
type Specialization = { id: number; name: string; subcategory_id: number }
type Fornecedor = {
  id: string; nome: string; categoria_nome: string;
  subcategoria_nome: string; especializacao_nome: string;
  cidade: string; estado: string; telefone: string; celular: string;
  moq: string; prazo_medio_dias: string; descricao: string;
}

export default function Categoria({ params }: any) {
  const supabase = createClient()
  const [categoria, setCategoria] = useState<Category | null>(null)
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([])
  const [especializacoes, setEspecializacoes] = useState<Specialization[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [subSelecionada, setSubSelecionada] = useState<number | null>(null)
  const [espSelecionada, setEspSelecionada] = useState<number | null>(null)
  const [estado, setEstado] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

  useEffect(() => {
    async function load() {
      const { id } = await params
      const { data: cat } = await supabase.from('categories').select('*').eq('id', id).single()
      if (cat) setCategoria(cat)
      const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', id).order('id')
      if (subs) setSubcategorias(subs)
    }
    load()
  }, [])

  useEffect(() => {
    if (!subSelecionada) { setEspecializacoes([]); return }
    async function loadEsps() {
      const { data } = await supabase.from('specializations').select('*').eq('subcategory_id', subSelecionada).order('id')
      if (data) setEspecializacoes(data)
    }
    loadEsps()
    setEspSelecionada(null)
  }, [subSelecionada])

  async function buscar() {
    setBuscando(true)
    setBuscou(false)
    let query = supabase.from('fornecedores').select('*')
    if (espSelecionada) {
      const esp = especializacoes.find(e => e.id === espSelecionada)
      if (esp) query = query.ilike('especializacao_nome', `%${esp.name}%`)
    } else if (subSelecionada) {
      const sub = subcategorias.find(s => s.id === subSelecionada)
      if (sub) query = query.ilike('subcategoria_nome', `%${sub.name}%`)
    } else if (categoria) {
      query = query.ilike('categoria_nome', `%${categoria.name}%`)
    }
    if (estado) query = query.eq('estado', estado)
    const { data } = await query.limit(12)
    setBuscando(false)
    setBuscou(true)
    if (data) setFornecedores(data)
  }

  const btn: React.CSSProperties = { padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left' as const, width: '100%' }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <nav style={{ backgroundColor: '#1E3A5F', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
            <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/sobre" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Sobre o SNM</a>
          <a href="/matching" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Buscar fornecedor</a>
        </div>
      </nav>

      <section style={{ backgroundColor: '#1E3A5F', padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', marginBottom: '12px' }}>
            <a href="/" style={{ color: '#93C5FD', textDecoration: 'none' }}>Home</a>
            <span style={{ color: '#93C5FD', margin: '0 8px' }}>›</span>
            <span style={{ color: 'white' }}>{categoria?.name}</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
            {categoria?.name}
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '15px' }}>
            {subcategorias.length} subcategorias — encontre o fornecedor certo para sua necessidade
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>

          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', position: 'sticky', top: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A5F', marginBottom: '20px' }}>Filtros</h2>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '10px' }}>SUBCATEGORIA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => { setSubSelecionada(null); setEspSelecionada(null) }}
                  style={{ ...btn, backgroundColor: !subSelecionada ? '#EFF6FF' : 'white', color: !subSelecionada ? '#1E40AF' : '#374151', fontWeight: !subSelecionada ? 600 : 400, border: !subSelecionada ? '1px solid #BFDBFE' : '1px solid #E2E8F0' }}>
                  Todas
                </button>
                {subcategorias.map(s => (
                  <button key={s.id} onClick={() => setSubSelecionada(s.id)}
                    style={{ ...btn, backgroundColor: subSelecionada === s.id ? '#EFF6FF' : 'white', color: subSelecionada === s.id ? '#1E40AF' : '#374151', fontWeight: subSelecionada === s.id ? 600 : 400, border: subSelecionada === s.id ? '1px solid #BFDBFE' : '1px solid #E2E8F0' }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {especializacoes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '10px' }}>ESPECIALIZAÇÃO</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => setEspSelecionada(null)}
                    style={{ ...btn, backgroundColor: !espSelecionada ? '#EFF6FF' : 'white', color: !espSelecionada ? '#1E40AF' : '#374151', fontWeight: !espSelecionada ? 600 : 400, border: !espSelecionada ? '1px solid #BFDBFE' : '1px solid #E2E8F0' }}>
                    Todas
                  </button>
                  {especializacoes.map(e => (
                    <button key={e.id} onClick={() => setEspSelecionada(e.id)}
                      style={{ ...btn, fontSize: '13px', backgroundColor: espSelecionada === e.id ? '#EFF6FF' : 'white', color: espSelecionada === e.id ? '#1E40AF' : '#374151', fontWeight: espSelecionada === e.id ? 600 : 400, border: espSelecionada === e.id ? '1px solid #BFDBFE' : '1px solid #E2E8F0' }}>
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '10px' }}>ESTADO</div>
              <select value={estado} onChange={e => setEstado(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', backgroundColor: 'white' }}>
                <option value="">Todos os estados</option>
                {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>

            <button onClick={buscar} disabled={buscando}
              style={{ width: '100%', padding: '12px', backgroundColor: buscando ? '#94A3B8' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: buscando ? 'not-allowed' : 'pointer' }}>
              {buscando ? 'Buscando...' : 'Buscar fornecedores'}
            </button>
          </div>

          <div>
            {!buscou && (
              <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ color: '#1E3A5F', fontSize: '18px', marginBottom: '8px' }}>Selecione os filtros</h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Escolha a subcategoria e clique em buscar para encontrar fornecedores</p>
              </div>
            )}

            {buscou && fornecedores.length === 0 && (
              <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
                <h3 style={{ color: '#1E3A5F', fontSize: '18px', marginBottom: '8px' }}>Nenhum fornecedor encontrado</h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Tente ajustar os filtros ou cadastre sua empresa</p>
                <a href="/cadastro" style={{ padding: '10px 24px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                  Cadastrar minha empresa
                </a>
              </div>
            )}

            {buscou && fornecedores.length > 0 && (
              <div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E3A5F' }}>
                    {fornecedores.length} fornecedor{fornecedores.length > 1 ? 'es' : ''} encontrado{fornecedores.length > 1 ? 's' : ''}
                  </h2>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {fornecedores.map(f => (
                    <div key={f.id} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '52px', height: '52px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏭</div>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '6px' }}>{f.nome}</h3>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            {f.subcategoria_nome && <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{f.subcategoria_nome}</span>}
                            {f.especializacao_nome && <span style={{ fontSize: '11px', backgroundColor: '#F5F3FF', color: '#5B21B6', padding: '2px 8px', borderRadius: '20px' }}>{f.especializacao_nome}</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {f.cidade && <span style={{ fontSize: '13px', color: '#64748B' }}>📍 {f.cidade} — {f.estado}</span>}
                            {f.moq && <span style={{ fontSize: '13px', color: '#64748B' }}>📦 MOQ: {f.moq}</span>}
                            {f.prazo_medio_dias && <span style={{ fontSize: '13px', color: '#64748B' }}>⏱ {f.prazo_medio_dias} dias</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <a href={`/fornecedores/${f.id}`} style={{ padding: '8px 16px', border: '1px solid #E2E8F0', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Ver perfil</a>
                        <a href={`/cotacao/${f.id}`} style={{ padding: '8px 16px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Solicitar cotacao</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}