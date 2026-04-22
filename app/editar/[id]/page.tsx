'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type Category = { id: number; name: string }
type Subcategory = { id: number; name: string; category_id: number }
type Specialization = { id: number; name: string; subcategory_id: number }

export default function Editar({ params }: any) {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([])
  const [especializacoes, setEspecializacoes] = useState<Specialization[]>([])
  const [polos, setPolos] = useState<{id: number; nome: string; estado: string}[]>([])
  const [carregando, setCarregando] = useState(true)

  const [categoryId, setCategoryId] = useState('')
  const [subcsSelecionadas, setSubcsSelecionadas] = useState<number[]>([])
  const [espsSelecionadas, setEspsSelecionadas] = useState<number[]>([])
  const [poloId, setPoloId] = useState('')

  const [form, setForm] = useState({
    nome: '', telefone: '', celular: '', whatsapp: '', email: '',
    cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
    capacidade_produtiva: '', moq: '', prazo_medio_dias: '',
    certificacoes: '', descricao: '',
  })

  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [telefone, setTelefone] = useState('')

  useEffect(() => {
    async function load() {
      const { id } = await params
      setFornecedorId(id)

      const [catsRes, subsRes, espsRes, polosRes, fornRes] = await Promise.all([
        supabase.from('categories').select('*').order('id'),
        supabase.from('subcategories').select('*').order('id'),
        supabase.from('specializations').select('*').order('id'),
        supabase.from('polos_texteis').select('id, nome, estado').order('nome'),
        supabase.from('fornecedores').select('*').eq('id', id).single(),
      ])

      if (catsRes.data) setCategorias(catsRes.data)
      if (subsRes.data) setSubcategorias(subsRes.data)
      if (espsRes.data) setEspecializacoes(espsRes.data)
      if (polosRes.data) setPolos(polosRes.data)

      if (fornRes.data) {
        const f = fornRes.data
        setCnpj(f.cnpj || '')
        setRazaoSocial(f.razao_social || '')
        setForm(prev => ({ ...prev, telefone: f.telefone || '' }))
        setCategoryId(f.category_id?.toString() || '')
        setPoloId(f.polo_id?.toString() || '')
        setForm({
          nome: f.nome || '',
          telefone: f.telefone || '',
          celular: f.celular || '',
          whatsapp: f.whatsapp || '',
          email: f.email || '',
          cep: f.cep || '',
          endereco: f.endereco || '',
          numero: '',
          complemento: '',
          bairro: f.bairro || '',
          cidade: f.cidade || '',
          estado: f.estado || '',
          capacidade_produtiva: f.capacidade_produtiva || '',
          moq: f.moq || '',
          prazo_medio_dias: f.prazo_medio_dias || '',
          certificacoes: f.certificacoes || '',
          descricao: f.descricao || '',
        })

        const { data: catsForn } = await supabase
          .from('fornecedor_categorias')
          .select('subcategory_id, specialization_id')
          .eq('fornecedor_id', id)

        if (catsForn) {
          const subs = [...new Set(catsForn.map(c => c.subcategory_id).filter(Boolean))]
          const esps = [...new Set(catsForn.map(c => c.specialization_id).filter(Boolean))]
          setSubcsSelecionadas(subs as number[])
          setEspsSelecionadas(esps as number[])
        }
      }

      setCarregando(false)
    }
    load()
  }, [])

  const subsDisponiveis = subcategorias.filter(s => s.category_id === Number(categoryId))

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

  async function buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErro('')

    const cat = categorias.find(c => c.id === Number(categoryId))
    const subPrincipal = subcategorias.find(s => s.id === subcsSelecionadas[0])
    const espPrincipal = especializacoes.find(e => e.id === espsSelecionadas[0])

    const { error } = await supabase.from('fornecedores').update({
      nome: form.nome,
      telefone: form.telefone,
      celular: form.celular,
      whatsapp: form.whatsapp,
      email: form.email,
      cep: form.cep,
      endereco: form.endereco + (form.numero ? ', ' + form.numero : '') + (form.complemento ? ' - ' + form.complemento : ''),
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      category_id: Number(categoryId),
      subcategory_id: subPrincipal?.id || null,
      specialization_id: espPrincipal?.id || null,
      categoria_nome: cat?.name || '',
      subcategoria_nome: subPrincipal?.name || '',
      especializacao_nome: espPrincipal?.name || '',
      capacidade_produtiva: form.capacidade_produtiva,
      moq: form.moq,
      prazo_medio_dias: form.prazo_medio_dias,
      certificacoes: form.certificacoes,
      descricao: form.descricao,
      polo_id: poloId ? Number(poloId) : null,
      polo_textil: polos.find(p => p.id === Number(poloId))?.nome || '',
    }).eq('id', fornecedorId)

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    await supabase.from('fornecedor_categorias').delete().eq('fornecedor_id', fornecedorId)

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

    setSalvando(false)
    setSucesso(true)
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white' }
  const inpDisabled: React.CSSProperties = { ...inp, backgroundColor: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed' }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block' }
  const sec: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }
  const tit: React.CSSProperties = { fontSize: '15px', fontWeight: 600, color: '#0B1F3B', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }

  if (carregando) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748B' }}>Carregando...</p>
    </main>
  )

  if (sucesso) return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
      </header>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Cadastro atualizado!</h1>
        <p style={{ color: '#64748B', marginBottom: '32px' }}>Suas informacoes foram salvas com sucesso.</p>
        <a href={`/fornecedores/${fornecedorId}`} style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
          Ver meu perfil
        </a>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href={`/fornecedores/${fornecedorId}`} style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Ver meu perfil</a>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Editar cadastro</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px' }}>Atualize as informacoes da sua empresa no SNM</p>
      </section>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>

        


        <form onSubmit={handleSubmit}>

          <div style={sec}>
            <h2 style={tit}>1. Identificacao</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>CNPJ (nao editavel)</label>
              <input value={cnpj} disabled style={inpDisabled} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Razao social (nao editavel)</label>
                <input value={razaoSocial} disabled style={inpDisabled} />
              </div>
              <div>
                <label style={lbl}>Nome fantasia *</label>
                <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: Tecidos Silva" style={inp} />
              </div>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>2. Onde sua empresa atua</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Categoria principal *</label>
              <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setSubcsSelecionadas([]); setEspsSelecionadas([]) }} required style={inp}>
                <option value="">Selecione a categoria...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {subsDisponiveis.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3B', marginBottom: '10px' }}>Subcategorias:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {subsDisponiveis.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: `1px solid ${subcsSelecionadas.includes(s.id) ? '#BFDBFE' : '#E2E8F0'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: subcsSelecionadas.includes(s.id) ? '#EFF6FF' : 'white', fontSize: '13px', color: subcsSelecionadas.includes(s.id) ? '#1E40AF' : '#374151', fontWeight: subcsSelecionadas.includes(s.id) ? 600 : 400 }}>
                      <input type="checkbox" checked={subcsSelecionadas.includes(s.id)} onChange={() => toggleSub(s.id)} style={{ width: '16px', height: '16px', accentColor: '#0B1F3B', flexShrink: 0 }} />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {subcsSelecionadas.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3B', marginBottom: '10px' }}>Especializacoes:</div>
                {subcsSelecionadas.map(subId => {
                  const sub = subcategorias.find(s => s.id === subId)
                  const espsDoSub = especializacoes.filter(e => e.subcategory_id === subId)
                  if (espsDoSub.length === 0) return null
                  return (
                    <div key={subId} style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>{sub?.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {espsDoSub.map(e => (
                          <label key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: `1px solid ${espsSelecionadas.includes(e.id) ? '#BFDBFE' : '#E2E8F0'}`, borderRadius: '6px', cursor: 'pointer', backgroundColor: espsSelecionadas.includes(e.id) ? '#EFF6FF' : 'white', fontSize: '12px', color: espsSelecionadas.includes(e.id) ? '#1E40AF' : '#374151' }}>
                            <input type="checkbox" checked={espsSelecionadas.includes(e.id)} onChange={() => toggleEsp(e.id)} style={{ width: '14px', height: '14px', accentColor: '#0B1F3B', flexShrink: 0 }} />
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
            <h2 style={tit}>3. Localizacao</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>CEP</label>
                <input name="cep" value={form.cep} onChange={e => { handleChange(e); buscarCep(e.target.value) }} placeholder="00000-000" style={inp} />
              </div>
              <div>
                <label style={lbl}>Estado *</label>
                <select name="estado" value={form.estado} onChange={handleChange} required style={inp}>
                  <option value="">UF</option>
                  {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Cidade *</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: Sao Paulo" style={inp} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Endereco</label>
              <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Ex: Rua das Flores" style={inp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Numero</label><input name="numero" value={form.numero} onChange={handleChange} placeholder="Ex: 123" style={inp} /></div>
              <div><label style={lbl}>Complemento</label><input name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ex: Apto 42" style={inp} /></div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Bairro</label>
              <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Bom Retiro" style={inp} />
            </div>
            <div>
              <label style={lbl}>Polo textil (opcional)</label>
              <select value={poloId} onChange={e => setPoloId(e.target.value)} style={inp}>
                <option value="">Nao faz parte de um polo textil</option>
                {polos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.estado}</option>)}
              </select>
            </div>
          </div>

          <div style={sec}>
            <h2 style={tit}>4. Contato</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={lbl}>Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 0000-0000" style={inp} /></div>
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
          </div>

          {erro && <div style={{ padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{erro}</div>}

          <button type="submit" disabled={salvando} style={{ width: '100%', padding: '16px', backgroundColor: salvando ? '#94A3B8' : '#0B1F3B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer', marginBottom: '40px' }}>
            {salvando ? 'Salvando...' : 'Salvar alteracoes'}
          </button>

        </form>
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>2026 Sistema Nacional da Moda</div>
      </footer>

    </main>
  )
}