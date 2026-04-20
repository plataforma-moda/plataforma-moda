'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const cats: Record<string, string[]> = {
  'Materia-prima': ['Tecidos', 'Aviamentos', 'Insumos complementares', 'Embalagens'],
  'Industria Textil': ['Fiacao', 'Tecelagem', 'Malharia', 'Beneficiamento', 'Estamparia industrial'],
  'Confeccao': ['Modelagem', 'Pilotagem', 'Corte', 'Costura', 'Acabamento', 'Private Label'],
  'Desenvolvimento': ['Criacao', 'Desenvolvimento de produto', 'Modelagem avancada', 'Pesquisa e tendencia', 'Engenharia textil'],
  'Distribuicao': ['Logistica', 'Representacao comercial', 'Atacado'],
  'Comercializacao': ['Marcas', 'E-commerce', 'Varejo fisico'],
  'Servicos de apoio': ['Marketing', 'Branding', 'Tecnologia', 'Sistemas de gestao', 'Conteudo', 'Consultorias'],
  'Ecossistema': ['Associacoes', 'Eventos', 'Educacao', 'Startups'],
}

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type F = { id: string; nome: string; categoria_nome: string; subcategoria_nome: string; cidade: string; estado: string; telefone: string; celular: string }

export default function Matching() {
  const [form, setForm] = useState({ produto: '', categoria: '', subcategoria: '', estado: '', prazo: '' })
  const [resultados, setResultados] = useState<F[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  const subs = form.categoria ? cats[form.categoria] : []

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'categoria' ? { subcategoria: '' } : {}) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBuscando(true)
    setBuscou(false)
    let query = supabase.from('fornecedores').select('*')
    if (form.subcategoria) {
      query = query.ilike('subcategoria_nome', `%${form.subcategoria}%`)
    } else if (form.categoria) {
      query = query.ilike('categoria_nome', `%${form.categoria}%`)
    }
    if (form.estado) query = query.eq('estado', form.estado)
    const { data, error } = await query.limit(9)
    setBuscando(false)
    setBuscou(true)
    if (!error && data) setResultados(data)
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#1E3A5F', display: 'block' }

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
        <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          Cadastrar empresa
        </a>
      </nav>

      <section style={{ backgroundColor: '#1E3A5F', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Encontre o fornecedor ideal</h1>
        <p style={{ color: '#93C5FD', fontSize: '15px' }}>Descreva o que precisa e encontramos os fornecedores certos da cadeia produtiva</p>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', marginBottom: '32px' }}>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>O que voce precisa produzir ou contratar? *</label>
              <textarea name="produto" value={form.produto} onChange={handleChange} required
                placeholder="Ex: 500 jaquetas corta-vento personalizadas com bordado no peito, entrega em SP"
                style={{ ...inp, height: '80px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Categoria</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} style={inp}>
                  <option value="">Todas as categorias</option>
                  {Object.keys(cats).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Subcategoria</label>
                <select name="subcategoria" value={form.subcategoria} onChange={handleChange} style={inp} disabled={!form.categoria}>
                  <option value="">Todas</option>
                  {subs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={lbl}>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange} style={inp}>
                  <option value="">Todos os estados</option>
                  {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Prazo maximo (dias)</label>
                <input name="prazo" value={form.prazo} onChange={handleChange} placeholder="Ex: 30" style={inp} />
              </div>
            </div>

            <button type="submit" disabled={buscando} style={{ width: '100%', padding: '14px', backgroundColor: buscando ? '#94A3B8' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: buscando ? 'not-allowed' : 'pointer' }}>
              {buscando ? 'Buscando fornecedores...' : 'Encontrar fornecedores'}
            </button>
          </form>
        </div>

        {buscou && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1E3A5F', marginBottom: '4px' }}>
                {resultados.length > 0 ? `${resultados.length} fornecedores encontrados` : 'Nenhum fornecedor encontrado'}
              </h2>
              <p style={{ color: '#64748B', fontSize: '14px' }}>
                {resultados.length > 0 ? 'Clique em "Ver perfil" para detalhes e solicitar cotacao' : 'Tente ajustar os filtros acima'}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {resultados.map((f) => (
                <div key={f.id} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏭</div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '6px' }}>{f.nome}</h3>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {f.categoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{f.categoria_nome}</span>}
                        {f.subcategoria_nome && <span style={{ fontSize: '12px', backgroundColor: '#F5F3FF', color: '#5B21B6', padding: '2px 8px', borderRadius: '20px' }}>{f.subcategoria_nome}</span>}
                      </div>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>📍 {f.cidade} — {f.estado}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <a href={`/fornecedores/${f.id}`} style={{ padding: '8px 16px', border: '1px solid #E2E8F0', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                      Ver perfil
                    </a>
                    <a href={`/cotacao/${f.id}`} style={{ padding: '8px 16px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                      Solicitar cotacao
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2025</div>
      </footer>

    </main>
  )
}