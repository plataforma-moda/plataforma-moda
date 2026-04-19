'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const categorias: Record<string, string[]> = {
  'Matéria-prima': ['Algodão', 'Fibras sintéticas', 'Aviamentos'],
  'Indústria Têxtil': ['Fiação', 'Tecelagem', 'Malharia', 'Beneficiamento'],
  'Confecção': ['Modelagem', 'Corte', 'Costura', 'Acabamento'],
  'Desenvolvimento': ['Design', 'Produto', 'Engenharia Têxtil'],
  'Distribuição': ['Logística', 'Representantes', 'Atacado'],
  'Comercialização': ['Marcas', 'E-commerce', 'Varejo físico'],
  'Serviços de apoio': ['Marketing', 'Branding', 'Tecnologia', 'ERP / PLM', 'Fotografia'],
  'Ecossistema': ['Associações', 'Eventos'],
}

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '', cnpj: '', segmento: '', subcategoria: '',
    estado: '', cidade: '', endereco: '',
    telefone: '', email: '', whatsapp: '',
    capacidade: '', moq: '', prazo: '', certificacoes: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const subcategorias = form.segmento ? categorias[form.segmento] : []

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'segmento' ? { subcategoria: '' } : {}) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const { error } = await supabase.from('cadastros').insert([{
      nome: form.nome, cnpj: form.cnpj, segmento: form.segmento,
      subcategoria: form.subcategoria, estado: form.estado, cidade: form.cidade,
      endereco: form.endereco, telefone: form.telefone, email: form.email,
      whatsapp: form.whatsapp, capacidade_produtiva: form.capacidade,
      moq: form.moq, prazo_medio_dias: form.prazo, certificacoes: form.certificacoes,
      status: 'pendente',
    }])
    setEnviando(false)
    if (error) { setErro('Erro ao enviar. Tente novamente.') }
    else { setSucesso(true) }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#1E3A5F', display: 'block' }
  const sec: React.CSSProperties = { marginBottom: '24px', padding: '24px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#f9f9f9' }
  const tit: React.CSSProperties = { fontSize: '16px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
      <h1 style={{ fontSize: '26px', color: '#1E3A5F', marginBottom: '12px' }}>Cadastro enviado!</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Recebemos o cadastro de <strong>{form.nome}</strong>. Nossa equipe vai analisar e publicar seu perfil em até 48 horas.</p>
      <a href="/" style={{ padding: '14px 28px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '15px' }}>Voltar para a home</a>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← Voltar</a>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginTop: '10px' }}>Cadastre sua empresa</h1>
        <p style={{ color: '#666', marginTop: '6px' }}>Apareça para compradores de todo o Brasil</p>
      </header>

      <form onSubmit={handleSubmit}>

        <div style={sec}>
          <h2 style={tit}>1. Identificação</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Nome da empresa *</label><input name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: Tecidos Silva Ltda" style={inp} /></div>
            <div><label style={lbl}>CNPJ *</label><input name="cnpj" value={form.cnpj} onChange={handleChange} required placeholder="00.000.000/0000-00" style={inp} /></div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>2. Classificação</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Segmento *</label>
              <select name="segmento" value={form.segmento} onChange={handleChange} required style={inp}>
                <option value="">Selecione...</option>
                {Object.keys(categorias).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Subcategoria *</label>
              <select name="subcategoria" value={form.subcategoria} onChange={handleChange} required style={inp} disabled={!form.segmento}>
                <option value="">Selecione o segmento primeiro</option>
                {subcategorias.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>3. Localização</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Estado *</label>
              <select name="estado" value={form.estado} onChange={handleChange} required style={inp}>
                <option value="">UF</option>
                {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Cidade *</label><input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: São Paulo" style={inp} /></div>
          </div>
          <div><label style={lbl}>Endereço</label><input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, bairro" style={inp} /></div>
        </div>

        <div style={sec}>
          <h2 style={tit}>4. Contato</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Telefone *</label><input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 0000-0000" style={inp} /></div>
            <div><label style={lbl}>E-mail *</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="contato@empresa.com" style={inp} /></div>
            <div><label style={lbl}>WhatsApp</label><input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} /></div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>5. Capacidade produtiva</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Capacidade mensal</label><input name="capacidade" value={form.capacidade} onChange={handleChange} placeholder="Ex: 5.000 peças/mês" style={inp} /></div>
            <div><label style={lbl}>MOQ mínimo</label><input name="moq" value={form.moq} onChange={handleChange} placeholder="Ex: 100 peças" style={inp} /></div>
            <div><label style={lbl}>Prazo médio (dias)</label><input name="prazo" value={form.prazo} onChange={handleChange} placeholder="Ex: 30" style={inp} /></div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>6. Diferenciais</h2>
          <div><label style={lbl}>Certificações</label><input name="certificacoes" value={form.certificacoes} onChange={handleChange} placeholder="Ex: OEKO-TEX, ABNT, GOTS" style={inp} /></div>
          <div style={{ marginTop: '16px' }}>
            <label style={lbl}>Portfólio</label>
            <div style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '30px', textAlign: 'center', marginTop: '6px', backgroundColor: 'white' }}>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Upload de fotos disponível em breve</p>
              <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0' }}>Envie seu portfólio por e-mail após o cadastro</p>
            </div>
          </div>
        </div>

        {erro && <div style={{ padding: '12px', backgroundColor: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px', marginBottom: '16px', color: '#791F1F', fontSize: '14px' }}>{erro}</div>}

        <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#888' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
          {enviando ? 'Enviando...' : 'Enviar cadastro'}
        </button>

      </form>
    </main>
  )
}