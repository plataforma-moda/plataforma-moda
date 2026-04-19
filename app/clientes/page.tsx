'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function CadastroCliente() {
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', whatsapp: '',
    empresa: '', cnpj: '', estado: '', cidade: '',
    segmento_interesse: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const { error } = await supabase.from('clientes').insert([{
      nome: form.nome, email: form.email, telefone: form.telefone,
      whatsapp: form.whatsapp, empresa: form.empresa, cnpj: form.cnpj,
      estado: form.estado, cidade: form.cidade,
      segmento_interesse: form.segmento_interesse,
    }])
    setEnviando(false)
    if (error) {
      setErro(error.code === '23505' ? 'E-mail ja cadastrado.' : 'Erro ao cadastrar.')
    } else {
      setSucesso(true)
    }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#1E3A5F', display: 'block' }
  const sec: React.CSSProperties = { marginBottom: '24px', padding: '24px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#f9f9f9' }
  const tit: React.CSSProperties = { fontSize: '16px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>OK</div>
      <h1 style={{ fontSize: '26px', color: '#1E3A5F', marginBottom: '12px' }}>Cadastro realizado!</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bem-vindo, <strong>{form.nome}</strong>! Agora voce pode buscar fornecedores.
      </p>
      <a href="/matching" style={{ padding: '14px 28px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '15px' }}>
        Buscar fornecedores
      </a>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>Voltar</a>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginTop: '10px' }}>Cadastro de comprador</h1>
        <p style={{ color: '#666', marginTop: '6px' }}>Encontre os fornecedores certos para o seu negocio</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div style={sec}>
          <h2 style={tit}>1. Seus dados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Nome completo *</label><input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome" style={inp} /></div>
            <div><label style={lbl}>E-mail *</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="seu@email.com" style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 0000-0000" style={inp} /></div>
            <div><label style={lbl}>WhatsApp</label><input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} /></div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>2. Sua empresa</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Nome da empresa</label><input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Ex: Marca da Maria" style={inp} /></div>
            <div><label style={lbl}>CNPJ</label><input name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} style={inp}>
                <option value="">UF</option>
                {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Cidade</label><input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: Sao Paulo" style={inp} /></div>
          </div>
        </div>

        <div style={sec}>
          <h2 style={tit}>3. O que voce busca</h2>
          <div>
            <label style={lbl}>Segmento de interesse</label>
            <select name="segmento_interesse" value={form.segmento_interesse} onChange={handleChange} style={inp}>
              <option value="">Selecione...</option>
              <option value="Materia-prima">Materia-prima</option>
              <option value="Industria Textil">Industria Textil</option>
              <option value="Confeccao">Confeccao</option>
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Distribuicao">Distribuicao</option>
              <option value="Comercializacao">Comercializacao</option>
              <option value="Servicos de apoio">Servicos de apoio</option>
              <option value="Ecossistema">Ecossistema</option>
            </select>
          </div>
        </div>

        {erro && <div style={{ padding: '12px', backgroundColor: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px', marginBottom: '16px', color: '#791F1F', fontSize: '14px' }}>{erro}</div>}

        <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#888' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
          {enviando ? 'Cadastrando...' : 'Criar minha conta'}
        </button>
      </form>
    </main>
  )
}