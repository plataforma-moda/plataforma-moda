'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const segmentos = [
  'Materia-prima','Industria Textil','Confeccao','Desenvolvimento',
  'Distribuicao','Comercializacao','Servicos de apoio','Ecossistema'
]

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

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block' }
  const sec: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }
  const tit: React.CSSProperties = { fontSize: '15px', fontWeight: 600, color: '#0B1F3B', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div><div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div><div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div></div>
        </a>
      </nav>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>OK</div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Conta criada!</h1>
        <p style={{ color: '#64748B', marginBottom: '32px' }}>
          Bem-vindo ao SNM, <strong>{form.nome}</strong>! Agora voce pode buscar fornecedores em toda a cadeia produtiva.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/matching" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Buscar fornecedores
          </a>
          <a href="/" style={{ padding: '12px 24px', border: '1px solid #E2E8F0', color: '#0B1F3B', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            Voltar para home
          </a>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div><div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div><div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div></div>
        </a>
        <a href="/cadastro" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Sou fornecedor</a>
      </nav>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Crie sua conta de comprador</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Acesse o maior diretorio B2B da moda brasileira � gratuito</p>
      </section>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>

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
              <label style={lbl}>Principal segmento de interesse</label>
              <select name="segmento_interesse" value={form.segmento_interesse} onChange={handleChange} style={inp}>
                <option value="">Selecione...</option>
                {segmentos.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{erro}</div>}

          <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#94A3B8' : '#0B1F3B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
            {enviando ? 'Criando conta...' : 'Criar minha conta no SNM'}
          </button>

        </form>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}
