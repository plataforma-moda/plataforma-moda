'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Cotacao({ params }: any) {
  const [fornecedor, setFornecedor] = useState<any>(null)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    nome: '', empresa: '', email: '', telefone: '',
    produto: '', quantidade: '', prazo: '', descricao: '',
  })

  useEffect(() => {
    async function load() {
      const { id } = await params
      const { data } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single()
      if (data) setFornecedor(data)
    }
    load()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const { error } = await supabase.from('cotacoes').insert([{
      fornecedor_id: fornecedor.id,
      fornecedor_nome: fornecedor.nome,
      nome_comprador: form.nome,
      empresa_comprador: form.empresa,
      email_comprador: form.email,
      telefone_comprador: form.telefone,
      produto: form.produto,
      quantidade: form.quantidade,
      prazo_desejado: form.prazo,
      descricao: form.descricao,
      status: 'pendente',
    }])
    setEnviando(false)
    if (error) { setErro('Erro ao enviar. Tente novamente.') }
    else { setSucesso(true) }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#1E3A5F', display: 'block' }
  const sec: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }
  const tit: React.CSSProperties = { fontSize: '16px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }

  const Navbar = () => (
    <nav style={{ backgroundColor: '#1E3A5F', padding: '0 40px', display: 'flex', alignItems: 'center', height: '64px' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
          <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
        </div>
      </a>
    </nav>
  )

  if (!fornecedor) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#64748B' }}>Carregando...</div>
    </main>
  )

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>OK</div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1E3A5F', marginBottom: '12px' }}>Cotacao enviada!</h1>
        <p style={{ color: '#64748B', marginBottom: '8px' }}>Sua solicitacao foi enviada para <strong>{fornecedor.nome}</strong>.</p>
        <p style={{ color: '#64748B', marginBottom: '32px' }}>Aguarde o contato da empresa em breve.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/fornecedores/${fornecedor.id}`} style={{ padding: '12px 24px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Voltar ao perfil do fornecedor
          </a>
          <a href="/" style={{ padding: '12px 24px', border: '1px solid #E2E8F0', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            Voltar para home
          </a>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#1E3A5F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            🏭
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600, marginBottom: '2px' }}>SOLICITACAO DE COTACAO PARA</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1E3A5F' }}>{fornecedor.nome}</div>
            {fornecedor.categoria_nome && (
              <div style={{ fontSize: '13px', color: '#64748B' }}>{fornecedor.categoria_nome} — {fornecedor.cidade}/{fornecedor.estado}</div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={sec}>
            <h2 style={tit}>1. Seus dados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Nome completo *</label><input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome" style={inp} /></div>
              <div><label style={lbl}>Empresa</label><input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nome da sua empresa" style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={lbl}>E-mail *</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="seu@email.com" style={inp} /></div>
              <div><label style={lbl}>Telefone / WhatsApp *</label><input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 00000-0000" style={inp} /></div>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>2. O que voce precisa</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Produto ou servico desejado *</label>
              <input name="produto" value={form.produto} onChange={handleChange} required placeholder="Ex: 500 camisetas polo brancas bordadas" style={inp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Quantidade</label><input name="quantidade" value={form.quantidade} onChange={handleChange} placeholder="Ex: 500 pecas" style={inp} /></div>
              <div><label style={lbl}>Prazo desejado</label><input name="prazo" value={form.prazo} onChange={handleChange} placeholder="Ex: 30 dias" style={inp} /></div>
            </div>
            <div>
              <label style={lbl}>Detalhes adicionais</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange}
                placeholder="Descreva especificacoes tecnicas, cores, materiais..."
                style={{ ...inp, height: '100px', resize: 'vertical' }} />
            </div>
          </div>

          {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{erro}</div>}

          <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#94A3B8' : '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
            {enviando ? 'Enviando...' : 'Enviar solicitacao de cotacao'}
          </button>

        </form>
      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}