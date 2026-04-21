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

  const [categoryId, setCategoryId] = useState('')
  const [subcsSelecionadas, setSubcsSelecionadas] = useState<number[]>([])
  const [espsSelecionadas, setEspsSelecionadas] = useState<number[]>([])

  const [form, setForm] = useState({
    nome: '', razao_social: '', cnpj: '',
    telefone: '', celular: '', whatsapp: '', email: '',
    cep: '', endereco: '', bairro: '', cidade: '', estado: '',
    capacidade_produtiva: '', moq: '', prazo_medio_dias: '',
    certificacoes: '', descricao: '',
  })

  const [polos, setPolos] = useState<{id: number; nome: string; estado: string}[]>([])
  const [poloId, setPoloId] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function load() {
      const { data: cats } = await supabase.from('categories').select('*').order('id')
      const { data: subs } = await supabase.from('subcategories').select('*').order('id')
      const { data: esps } = await supabase.from('specializations').select('*').order('id')
      const { data: pols } = await supabase.from('polos_texteis').select('id, nome, estado').order('nome')
      if (cats) setCategorias(cats)
      if (subs) setSubcategorias(subs)
      if (esps) setEspecializacoes(esps)
      if (pols) setPolos(pols)
    }
    load()
  }, [])

  const subsDisponiveis = subcategorias.filter(s => s.category_id === Number(categoryId))
  const espsDisponiveis = especializacoes.filter(e => subcsSelecionadas.includes(e.subcategory_id))

  function toggleSub(id: number) {
    setSubcsSelecionadas(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
    setEspsSelecionadas(prev =>
      prev.filter(espId => {
        const esp = especializacoes.find(e => e.id === espId)
        return esp && esp.subcategory_id !== id
      })
    )
  }

  function toggleEsp(id: number) {
    setEspsSelecionadas(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryId) { setErro('Selecione pelo menos uma categoria.'); return }
    setEnviando(true)
    setErro('')

    const cat = categorias.find(c => c.id === Number(categoryId))
    const subPrincipal = subcategorias.find(s => s.id === subcsSelecionadas[0])
    const espPrincipal = especializacoes.find(e => e.id === espsSelecionadas[0])

    const { data, error } = await supabase.from('fornecedores').insert([{
      nome: form.nome, razao_social: form.razao_social, cnpj: form.cnpj,
      telefone: form.telefone, celular: form.celular, whatsapp: form.whatsapp,
      email: form.email, cep: form.cep, endereco: form.endereco,
      bairro: form.bairro, cidade: form.cidade, estado: form.estado,
      category_id: Number(categoryId),
      subcategory_id: subPrincipal?.id || null,
      specialization_id: espPrincipal?.id || null,
      categoria_nome: cat?.name || '',
      subcategoria_nome: subPrincipal?.name || '',
      especializacao_nome: espPrincipal?.name || '',
      capacidade_produtiva: form.capacidade_produtiva,
      moq: form.moq, prazo_medio_dias: form.prazo_medio_dias,
      certificacoes: form.certificacoes, descricao: form.descricao,
      status: 'ativo',
      polo_id: poloId ? Number(poloId) : null,
      polo_textil: polos.find(p => p.id === Number(poloId))?.nome || '',
    }]).select()

    if (error || !data || !data[0]) {
      setErro('Erro ao enviar cadastro. Tente novamente.')
      setEnviando(false)
      return
    }

    const fornecedorId = data[0].id

    const rows = subcsSelecionadas.map(subId => {
      const sub = subcategorias.find(s => s.id === subId)
      const espsDoSub = espsSelecionadas.filter(espId => {
        const esp = especializacoes.find(e => e.id === espId)
        return esp?.subcategory_id === subId
      })
      if (espsDoSub.length > 0) {
        return espsDoSub.map(espId => {
          const esp = especializacoes.find(e => e.id === espId)
          return {
            fornecedor_id: fornecedorId,
            category_id: Number(categoryId),
            subcategory_id: subId,
            specialization_id: espId,
            categoria_nome: cat?.name || '',
            subcategoria_nome: sub?.name || '',
            especializacao_nome: esp?.name || '',
          }
        })
      }
      return [{
        fornecedor_id: fornecedorId,
        category_id: Number(categoryId),
        subcategory_id: subId,
        specialization_id: null,
        categoria_nome: cat?.name || '',
        subcategoria_nome: sub?.name || '',
        especializacao_nome: '',
      }]
    }).flat()

    if (rows.length > 0) {
      await supabase.from('fornecedor_categorias').insert(rows)
    }

    setEnviando(false)
    window.location.href = `/fornecedores/${fornecedorId}`
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block' }
  const sec: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }
  const tit: React.CSSProperties = { fontSize: '15px', fontWeight: 600, color: '#0B1F3B', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }

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
        <a href="/matching" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Buscar fornecedor</a>
      </nav>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Cadastre sua empresa no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Apareça para compradores de todo o Brasil — cadastro gratuito</p>
      </section>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>

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
            <h2 style={tit}>2. Onde sua empresa atua</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              Escolha a categoria e marque todas as subcategorias e especializacoes que se aplicam.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Categoria principal *</label>
              <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setSubcsSelecionadas([]); setEspsSelecionadas([]) }} required style={inp}>
                <option value="">Selecione a categoria...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {subsDisponiveis.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3B', marginBottom: '10px' }}>
                  Subcategorias — marque todas que se aplicam:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {subsDisponiveis.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: `1px solid ${subcsSelecionadas.includes(s.id) ? '#BFDBFE' : '#E2E8F0'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: subcsSelecionadas.includes(s.id) ? '#EFF6FF' : 'white', fontSize: '13px', color: subcsSelecionadas.includes(s.id) ? '#1E40AF' : '#374151', fontWeight: subcsSelecionadas.includes(s.id) ? 600 : 400 }}>
                      <input type="checkbox" checked={subcsSelecionadas.includes(s.id)} onChange={() => toggleSub(s.id)}
                        style={{ width: '16px', height: '16px', accentColor: '#0B1F3B', flexShrink: 0 }} />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {espsDisponiveis.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3B', marginBottom: '10px' }}>
                  Especializacoes — marque as que se aplicam:
                </div>
                {subcsSelecionadas.map(subId => {
                  const sub = subcategorias.find(s => s.id === subId)
                  const espsDoSub = especializacoes.filter(e => e.subcategory_id === subId)
                  if (espsDoSub.length === 0) return null
                  return (
                    <div key={subId} style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sub?.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {espsDoSub.map(e => (
                          <label key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: `1px solid ${espsSelecionadas.includes(e.id) ? '#BFDBFE' : '#E2E8F0'}`, borderRadius: '6px', cursor: 'pointer', backgroundColor: espsSelecionadas.includes(e.id) ? '#EFF6FF' : 'white', fontSize: '12px', color: espsSelecionadas.includes(e.id) ? '#1E40AF' : '#374151' }}>
                            <input type="checkbox" checked={espsSelecionadas.includes(e.id)} onChange={() => toggleEsp(e.id)}
                              style={{ width: '14px', height: '14px', accentColor: '#0B1F3B', flexShrink: 0 }} />
                            {e.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
              <div><label style={lbl}>Cidade *</label><input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: Sao Paulo" style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>CEP</label><input name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" style={inp} /></div>
              <div><label style={lbl}>Bairro</label><input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Bom Retiro" style={inp} /></div>
            </div>
            <div><label style={lbl}>Endereco</label><input name="endereço" value={form.endereco} onChange={handleChange} placeholder="Rua, numero" style={inp} /></div>

            <div style={{ marginTop: '16px' }}>
              <label style={lbl}>Polo têxtil (opcional)</label>
              <select value={poloId} onChange={e => setPoloId(e.target.value)} style={inp}>
                <option value="">Não faz parte de um polo têxtil</option>
                {polos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.estado}</option>)}
              </select>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Se sua empresa faz parte de um polo produtivo conhecido, selecione acima</p>
            </div>
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
              <div><label style={lbl}>Prazo médio (dias)</label><input name="prazo_medio_dias" value={form.prazo_medio_dias} onChange={handleChange} placeholder="Ex: 30" style={inp} /></div>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>6. Diferenciais</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Descrição da empresa</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange}
                placeholder="Conte sobre sua empresa, produtos e diferenciais..."
                style={{ ...inp, height: '100px', resize: 'vertical' }} />
            </div>
            <div><label style={lbl}>Certificações</label><input name="certificacoes" value={form.certificacoes} onChange={handleChange} placeholder="Ex: OEKO-TEX, ABNT, GOTS, ISO 9001" style={inp} /></div>
          </div>

          {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{erro}</div>}

          <button type="submit" disabled={enviando} style={{ width: '100%', padding: '16px', backgroundColor: enviando ? '#94A3B8' : '#0B1F3B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
            {enviando ? 'Cadastrando...' : 'Cadastrar minha empresa no SNM'}
          </button>

        </form>
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}