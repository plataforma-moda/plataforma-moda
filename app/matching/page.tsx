'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const categorias: Record<string, string[]> = {
  'Matéria-prima': [
    'Matéria-prima – Tecidos',
    'Matéria-prima – Aviamentos',
    'Matéria-prima – Tags e embalagens',
  ],
  'Indústria Têxtil': [
    'Indústria Têxtil – Malharia',
    'Indústria Têxtil – Fiação',
    'Indústria Têxtil – Tecelagem',
    'Indústria Têxtil – Beneficiamento',
    'Indústria Têxtil – Estamparia industrial',
  ],
  'Confecção': [
    'Confecção – Costura',
    'Confecção – Modelagem',
    'Confecção – Corte',
    'Confecção – Acabamento',
    'Confecção – Private Label',
  ],
  'Desenvolvimento': [
    'Desenvolvimento – Modelagem',
    'Desenvolvimento – Design',
    'Desenvolvimento – Produto',
    'Desenvolvimento – Engenharia Têxtil',
  ],
  'Distribuição': [
    'Distribuição – Logística',
    'Distribuição – Representação comercial',
    'Distribuição – Atacado',
  ],
  'Comercialização': [
    'Comercialização – Marcas',
    'Comercialização – E-commerce',
    'Comercialização – Varejo físico',
  ],
  'Serviços de apoio': [
    'Serviços de apoio – Estamparia',
    'Serviços de apoio – Bordado',
    'Serviços de apoio – Conteúdo',
    'Serviços de apoio – Marketing',
    'Serviços de apoio – Tecnologia',
    'Serviços de apoio – Consultoria',
  ],
  'Ecossistema': [
    'Ecossistema – Associações',
    'Ecossistema – Eventos',
    'Ecossistema – Educação',
  ],
}

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type Fornecedor = {
  id: string
  Nome: string
  Segmento: string
  Cidade: string
  Estado: string
  Telefone: string
  Celular: string
}

export default function Matching() {
  const [form, setForm] = useState({ produto: '', segmento: '', subcategoria: '', estado: '', prazo: '' })
  const [resultados, setResultados] = useState<Fornecedor[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  const subcategorias = form.segmento ? categorias[form.segmento] : []

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'segmento' ? { subcategoria: '' } : {}) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBuscando(true)
    setBuscou(false)

    let query = supabase.from('fornecedores').select('*')

    if (form.subcategoria) {
      query = query.eq('Segmento', form.subcategoria)
    } else if (form.segmento) {
      query = query.ilike('Segmento', `%${form.segmento}%`)
    }

    if (form.estado) {
      query = query.eq('Estado', form.estado)
    }

    const { data, error } = await query.limit(6)

    setBuscando(false)
    setBuscou(true)
    if (!error && data) {
      setResultados(data as Fornecedor[])
    }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#1E3A5F', display: 'block' }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← Voltar</a>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginTop: '10px' }}>Encontre o fornecedor ideal</h1>
        <p style={{ color: '#666', marginTop: '6px' }}>Descreva o que você precisa e encontramos os fornecedores certos</p>
      </header>

      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '24px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '30px' }}>

        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>O que você precisa produzir? *</label>
          <textarea name="produto" value={form.produto} onChange={handleChange} required
            placeholder="Ex: 500 jaquetas corta-vento personalizadas com bordado no peito"
            style={{ ...inp, height: '80px', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={lbl}>Categoria</label>
            <select name="segmento" value={form.segmento} onChange={handleChange} style={inp}>
              <option value="">Todas as categorias</option>
              {Object.keys(categorias).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Especialidade</label>
            <select name="subcategoria" value={form.subcategoria} onChange={handleChange} style={inp} disabled={!form.segmento}>
              <option value="">Todas as especialidades</option>
              {subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={lbl}>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange} style={inp}>
              <option value="">Todos os estados</option>
              {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Prazo máximo (dias)</label>
            <input name="prazo" value={form.prazo} onChange={handleChange} placeholder="Ex: 30" style={inp} />
          </div>
        </div>

        <button type="submit" disabled={buscando} style={{ width: '100%', padding: '14px', backgroundColor: buscando ? '#888' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: buscando ? 'not-allowed' : 'pointer' }}>
          {buscando ? 'Buscando...' : 'Encontrar fornecedores'}
        </button>

      </form>

      {buscou && (
        <div>
          <h2 style={{ fontSize: '20px', color: '#1E3A5F', marginBottom: '6px' }}>
            {resultados.length > 0 ? `${resultados.length} fornecedores encontrados` : 'Nenhum fornecedor encontrado'}
          </h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
            {resultados.length > 0 ? 'Clique em "Ver perfil" para detalhes e cotação' : 'Tente ajustar os filtros'}
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {resultados.map((f) => (
              <div key={f.id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '6px' }}>{f.Nome}</h3>
                  <span style={{ fontSize: '12px', backgroundColor: '#E6F1FB', color: '#0C447C', padding: '3px 10px', borderRadius: '20px', marginRight: '8px' }}>{f.Segmento}</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>📍 {f.Cidade} – {f.Estado}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{f.Telefone || f.Celular}</div>
                  <a href={`/fornecedores/${f.id}`} style={{ padding: '8px 16px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>Ver perfil</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  )
}