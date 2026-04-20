'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type Category = { id: number; name: string }
type Subcategory = { id: number; name: string; category_id: number }
type Specialization = { id: number; name: string; subcategory_id: number }

export default function Cadastro() {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([])
  const [especializacoes, setEspecializacoes] = useState<Specialization[]>([])
  const [subcatsFiltradas, setSubcatsFiltradas] = useState<Subcategory[]>([])
  const [especsFiltradas, setEspecsFiltradas] = useState<Specialization[]>([])
  const [form, setForm] = useState({
    nome: '', razao_social: '', cnpj: '',
    telefone: '', celular: '', whatsapp: '', email: '',
    cep: '', endereco: '', bairro: '', cidade: '', estado: '',
    category_id: '', subcategory_id: '', specialization_id: '',
    categoria_nome: '', subcategoria_nome: '', especializacao_nome: '',
    capacidade_produtiva: '', moq: '', prazo_medio_dias: '',
    certificacoes: '', descricao: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function load() {
      const { data: cats } = await supabase.from('categories').select('*').order('id')
      const { data: subs } = await supabase.from('subcategories').select('*').order('id')
      const { data: esps } = await supabase.from('specializations').select('*').order('id')
      if (cats) setCategorias(cats)
      if (subs) setSubcategorias(subs)
      if (esps) setEspecializacoes(esps)
    }
    load()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'category_id') {
      const cat = categorias.find(c => c.id === Number(value))
      setSubcatsFiltradas(subcategorias.filter(s => s.category_id === Number(value)))
      setEspecsFiltradas([])
      setForm(prev => ({ ...prev, category_id: value, categoria_nome: cat?.name || '', subcategory_id: '', subcategoria_nome: '', specialization_id: '', especializacao_nome: '' }))
      return
    }
    if (name === 'subcategory_id') {
      const sub = subcategorias.find(s => s.id === Number(value))
      setEspecsFiltradas(especializacoes.filter(e => e.subcategory_id === Number(value)))
      setForm(prev => ({ ...prev, subcategory_id: value, subcategoria_nome: sub?.name || '', specialization_id: '', especializacao_nome: '' }))
      return
    }
    if (name === 'specialization_id') {
      const esp = especializacoes.find(e => e.id === Number(value))
      setForm(prev => ({ ...prev, specialization_id: value, especializacao_nome: esp?.name || '' }))
      return
    }
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const { data, error } = await supabase.from('fornecedores').insert([{
      nome: form.nome, razao_social: form.razao_social, cnpj: form.cnpj,
      telefone: form.telefone, celular: form.celular, whatsapp: form.whatsapp,
      email: form.email, cep: form.cep, endereco: form.endereco,
      bairro: form.bairro, cidade: form.cidade, estado: form.estado,
      category_id: Number(form.category_id),
      subcategory_id: Number(form.subcategory_id),
      specialization_id: Number(form.specialization_id) || null,
      categoria_nome: form.categoria_nome,
      subcategoria_nome: form.subcategoria_nome,
      especializacao_nome: form.especializacao_nome,
      capacidade_produtiva: form.capacidade_produtiva,
      moq: form.moq, prazo_medio_dias: form.prazo_medio_dias,
      certificacoes: form.certificacoes, descricao: form.descricao,
      status: 'ativo',
    }]).select()
    setEnviando(false)
    if (error) { setErro('Erro ao enviar cadastro. Tente novamente.') }
    else if (data && data[0]) { window.location.href = `/planos?id=${data[0].id}` }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block' }
  const sec: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }
  const tit: React.CSSProperties = { fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }

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
        <a href="/matching" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Buscar fornecedor</a>
      </nav>

      <section style={{ backgroundColor: '#1E3A5F', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Cadastre sua empresa no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Apareca para compradores de todo o Brasil — cadastro gratuito</p>
      </section>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '20px' }}>💡</div>
          <div style={{ fontSize: '13px', color: '#1E40AF' }}>
            Preencha com atenção — suas informações aparecem exatamente assim para os compradores que buscam fornecedores.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={sec}>
            <h2 style={tit}>1. Identificacao da empresa</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Nome fantasia *</label><input name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: Tecidos Silva" style={inp} /></div>
              <div><label style={lbl}>Razao social</label><input name="razao_social" value={form.razao_social} onChange={handleChange} placeholder="Ex: Tecidos Silva Ltda" style={inp} /></div>
            </div>
            <div><label style={lbl}>CNPJ *</label><input name="cnpj" value={form.cnpj} onChange={handleChange} required placeholder="00.000.000/0000-00" style={{ ...inp, maxWidth: '260px' }} /></div>
          </div>

          <div style={sec}>
            <h2 style={tit}>2. Onde voce atua na cadeia da moda</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Selecione sua categoria — isso define como os compradores vao te encontrar no SNM.</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Categoria *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required style={inp}>
                <option value="">Selecione a categoria...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Subcategoria *</label>
              <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange} required style={inp} disabled={!form.category_id}>
                <option value="">Selecione a categoria primeiro</option>
                {subcatsFiltradas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Especializacao</label>
              <select name="specialization_id" value={form.specialization_id} onChange={handleChange} style={inp} disabled={!form.subcategory_id}>
                <option value="">Selecione a subcategoria primeiro</option>
                {especsFiltradas.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>3. Localizacao</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Estado *</label>
                <select name="estado" value={form.estado} onChange={handleChange} required style={inp}>
                  <option value="">UF</option>
                  {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Cidade *</label><input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: Sao Paulo" style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>CEP</label><input name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" style={inp} /></div>
              <div><label style={lbl}>Bairro</label><input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Bom Retiro" style={inp} /></div>
            </div>
            <div><label style={lbl}>Endereco</label><input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, numero" style={inp} /></div>
          </div>

          <div style={sec}>
            <h2 style={tit}>4. Contato</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Telefone *</label><input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 0000-0000" style={inp} /></div>
              <div><label style={lbl}>Celular</label><input name="celular" value={form.celular} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} /></div>
              <div><label style={lbl}>WhatsApp</label><input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} /></div>
            </div>
            <div><label style={lbl}>E-mail *</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="contato@empresa.com.br" style={{ ...inp, maxWidth: '340px' }} /></div>
          </div>

          <div style={sec}>
            <h2 style={tit}>5. Capacidade produtiva</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div><label style={lbl}>Capacidade mensal</label><input name="capacidade_produtiva" value={form.capacidade_produtiva} onChange={handleChange} placeholder="Ex: 5.000 pecas/mes" style={inp} /></div>
              <div><label style={lbl}>MOQ minimo</label><input name="moq" value={form.moq} onChange={handleChange} placeholder="Ex: 100 pecas" style={inp} /></div>
              <div><label style={lbl}>Prazo medio (dias)</label><input name="prazo_medio_dias" value={form.prazo_medio_dias} onChange={handleChange} placeholder="Ex: 30" style={inp} /></div>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>6. Diferenciais</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Descricao da empresa</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange}
                placeholder="Conte sobre sua empresa, produtos e diferenciais..."
                style={{ ...inp, height: '100px', resize: 'vertical' }} />
            </div>
            <div><label style={lbl}>Certificacoes</label><input name="certificacoes" value={form.certificacoes} onChange={handleChange} placeholder="Ex: OEKO-TEX, ABNT, GOTS, ISO 9001" style={inp} /></div>
            <div style={{ marginTop: '16px', border: '2px dashed #E2E8F0', borderRadius: '8px', padding: '24px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
              <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Upload de portfolio em breve</p>
              <p style={{ color: '#94A3B8', fontSize: '12px', margin: '4px 0 0' }}>Envie fotos do seu trabalho por e-mail apos o cadastro</p>
            </div>
          </div>

          {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{erro}</div>}

          <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#94A3B8' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
            {enviando ? 'Cadastrando...' : 'Cadastrar minha empresa no SNM'}
          </button>

        </form>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2025</div>
      </footer>

    </main>
  )
}