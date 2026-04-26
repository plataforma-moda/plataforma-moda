'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']
const DRAFT_KEY = 'snm_cadastro_draft_v2'

type Category = { id: number; name: string }
type Subcategory = { id: number; name: string; category_id: number }
type Specialization = { id: number; name: string; subcategory_id: number }

type FormState = {
  cnpj: string
  nome: string
  razao_social: string
  telefone: string
  celular: string
  whatsapp: string
  email: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  capacidade_produtiva: string
  moq: string
  prazo_medio_dias: string
  certificacoes: string
  descricao: string
}

const initialForm: FormState = {
  cnpj: '', nome: '', razao_social: '',
  telefone: '', celular: '', whatsapp: '', email: '',
  cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  capacidade_produtiva: '', moq: '', prazo_medio_dias: '',
  certificacoes: '', descricao: '',
}

const STEP_LABELS = ['Dados da Empresa', 'Endereço e Polo', 'Categorias']

export default function Cadastro() {
  const supabase = createClient()

  // Reference data
  const [categorias, setCategorias] = useState<Category[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([])
  const [especializacoes, setEspecializacoes] = useState<Specialization[]>([])
  const [polos, setPolos] = useState<{ id: number; nome: string; estado: string }[]>([])

  // Wizard state
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialForm)
  const [categoryId, setCategoryId] = useState('')
  const [subcsSelecionadas, setSubcsSelecionadas] = useState<number[]>([])
  const [espsSelecionadas, setEspsSelecionadas] = useState<number[]>([])
  const [poloId, setPoloId] = useState('')

  // UI state
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [cnpjExistente, setCnpjExistente] = useState(false)
  const [fornecedorExistenteId, setFornecedorExistenteId] = useState<string | null>(null)
  const [termosAceitos, setTermosAceitos] = useState(false)
  const [rascunhoId, setRascunhoId] = useState<string | null>(null)
  const [salvandoRascunho, setSalvandoRascunho] = useState(false)
  const [transiting, setTransiting] = useState(false)
  const [draftReady, setDraftReady] = useState(false)

  // Track if state was changed by user (not initial mount) before persisting
  const isFirstRender = useRef(true)

  // Load reference data
  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: subs }, { data: esps }, { data: pols }] = await Promise.all([
        supabase.from('categories').select('*').order('id'),
        supabase.from('subcategories').select('*').order('id'),
        supabase.from('specializations').select('*').order('id'),
        supabase.from('polos_texteis').select('id, nome, estado').order('nome'),
      ])
      if (cats) setCategorias(cats)
      if (subs) setSubcategorias(subs)
      if (esps) setEspecializacoes(esps)
      if (pols) setPolos(pols)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Restore draft on mount
  useEffect(() => {
    async function restoreFromSupabase() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'rascunho')
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        const r = data[0]
        setRascunhoId(r.id)
        setForm({
          cnpj: r.cnpj || '',
          nome: r.nome || '',
          razao_social: r.razao_social || '',
          telefone: r.telefone || '',
          celular: r.celular || '',
          whatsapp: r.whatsapp || '',
          email: r.email || '',
          cep: r.cep || '',
          endereco: r.endereco || '',
          numero: '',
          complemento: '',
          bairro: r.bairro || '',
          cidade: r.cidade || '',
          estado: r.estado || '',
          capacidade_produtiva: r.capacidade_produtiva || '',
          moq: r.moq || '',
          prazo_medio_dias: r.prazo_medio_dias || '',
          certificacoes: r.certificacoes || '',
          descricao: r.descricao || '',
        })
        if (r.polo_id) setPoloId(String(r.polo_id))
        const resumeStep = r.cidade && r.estado ? 3 : r.nome ? 2 : 1
        setStep(resumeStep)
      }
    }

    // Check localStorage first
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const d = JSON.parse(saved)
        if (d.form?.nome) {
          if (d.form) setForm(d.form)
          if (d.step) setStep(d.step)
          if (d.categoryId) setCategoryId(d.categoryId)
          if (d.subcsSelecionadas) setSubcsSelecionadas(d.subcsSelecionadas)
          if (d.espsSelecionadas) setEspsSelecionadas(d.espsSelecionadas)
          if (d.poloId) setPoloId(d.poloId)
          if (d.rascunhoId) setRascunhoId(d.rascunhoId)
          setDraftReady(true)
          return
        }
      }
    } catch { /* ignore parse errors */ }

    // Fallback to Supabase rascunho
    restoreFromSupabase().finally(() => setDraftReady(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist draft to localStorage whenever state changes
  useEffect(() => {
    if (!draftReady) return
    if (isFirstRender.current) { isFirstRender.current = false; return }
    const draft = { step, form, categoryId, subcsSelecionadas, espsSelecionadas, poloId, rascunhoId }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [step, form, categoryId, subcsSelecionadas, espsSelecionadas, poloId, rascunhoId, draftReady])

  // Derived state
  const subsDisponiveis = subcategorias.filter(s => s.category_id === Number(categoryId))
  const espsDisponiveis = especializacoes.filter(e => subcsSelecionadas.includes(e.subcategory_id))

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
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    }
  }

  async function verificarCnpj(cnpj: string) {
    const cnpjLimpo = cnpj.replace(/\D/g, '')
    if (cnpjLimpo.length !== 14) { setCnpjExistente(false); setFornecedorExistenteId(null); return }

    // Only check against active registrations (not drafts)
    const { data } = await supabase
      .from('fornecedores')
      .select('id')
      .eq('status', 'ativo')
      .or(`cnpj.eq.${cnpj},cnpj.eq.${cnpjLimpo}`)
      .limit(1)

    if (data !== null && data.length > 0) {
      setCnpjExistente(true)
      setFornecedorExistenteId(data[0].id)
      return
    }
    setCnpjExistente(false)
    setFornecedorExistenteId(null)

    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`)
      if (res.ok) {
        const info = await res.json()
        const razao = info.razao_social || ''
        const cep = info.estabelecimento?.cep?.replace(/\D/g, '') || ''
        const numero = info.estabelecimento?.numero || ''
        const complemento = info.estabelecimento?.complemento || ''
        const bairro = info.estabelecimento?.bairro || ''
        const cidade = info.estabelecimento?.cidade?.nome || ''
        const estado = info.estabelecimento?.estado?.sigla || ''
        const telefone = info.estabelecimento?.ddd1 && info.estabelecimento?.telefone1
          ? `(${info.estabelecimento.ddd1}) ${info.estabelecimento.telefone1}` : ''
        const email = info.estabelecimento?.email || ''
        const nomeFantasia = info.estabelecimento?.nome_fantasia || ''

        setForm(prev => ({
          ...prev,
          razao_social: razao,
          nome: nomeFantasia || prev.nome,
          cep: cep,
          numero: numero,
          complemento: complemento,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          telefone: telefone,
          email: email,
        }))

        if (cep.length === 8) {
          const cepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
          const cepData = await cepRes.json()
          if (!cepData.erro) {
            setForm(prev => ({
              ...prev,
              endereco: cepData.logradouro || prev.endereco,
            }))
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar CNPJ:', err)
    }
  }

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

  function validateStep(s: number): string {
    if (s === 1) {
      if (!form.nome.trim()) return 'Nome fantasia é obrigatório.'
      if (!form.email.trim()) return 'E-mail é obrigatório.'
      if (!form.telefone.trim()) return 'Telefone é obrigatório.'
      if (cnpjExistente) return 'Este CNPJ já está cadastrado.'
    }
    if (s === 2) {
      if (!form.cidade.trim()) return 'Cidade é obrigatória.'
      if (!form.estado) return 'Estado é obrigatório.'
    }
    if (s === 3) {
      if (!categoryId) return 'Selecione pelo menos uma categoria.'
      if (!termosAceitos) return 'Você precisa aceitar os Termos de Uso para continuar.'
    }
    return ''
  }

  async function saveRascunho(currentForm: FormState, currentPoloId: string) {
    if (salvandoRascunho || !currentForm.nome) return
    setSalvandoRascunho(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const payload = {
        user_id: user.id,
        nome: currentForm.nome,
        razao_social: currentForm.razao_social || null,
        cnpj: currentForm.cnpj || null,
        telefone: currentForm.telefone || null,
        celular: currentForm.celular || null,
        whatsapp: currentForm.whatsapp || null,
        email: currentForm.email || null,
        cep: currentForm.cep || null,
        endereco: (currentForm.endereco +
          (currentForm.numero ? ', ' + currentForm.numero : '') +
          (currentForm.complemento ? ' - ' + currentForm.complemento : '')) || null,
        bairro: currentForm.bairro || null,
        cidade: currentForm.cidade || null,
        estado: currentForm.estado || null,
        status: 'rascunho',
        polo_id: currentPoloId ? Number(currentPoloId) : null,
        polo_textil: polos.find(p => p.id === Number(currentPoloId))?.nome || null,
      }

      if (rascunhoId) {
        await supabase.from('fornecedores').update(payload).eq('id', rascunhoId)
      } else {
        const { data } = await supabase.from('fornecedores').insert([payload]).select()
        if (data && data[0]) setRascunhoId(data[0].id)
      }
    } finally {
      setSalvandoRascunho(false)
    }
  }

  async function goToStep(nextStep: number) {
    const validationError = validateStep(step)
    if (validationError) { setErro(validationError); return }
    setErro('')

    // Save rascunho to Supabase when moving forward
    if (nextStep > step) {
      await saveRascunho(form, poloId)
    }

    setTransiting(true)
    setTimeout(() => {
      setStep(nextStep)
      setTransiting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 180)
  }

  function goBack() {
    setErro('')
    setTransiting(true)
    setTimeout(() => {
      setStep(s => s - 1)
      setTransiting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 180)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validateStep(3)
    if (validationError) { setErro(validationError); return }

    setEnviando(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    const cat = categorias.find(c => c.id === Number(categoryId))
    const subPrincipal = subcategorias.find(s => s.id === subcsSelecionadas[0])
    const espPrincipal = especializacoes.find(e => e.id === espsSelecionadas[0])

    const payload = {
      user_id: user?.id || null,
      nome: form.nome,
      razao_social: form.razao_social || null,
      cnpj: form.cnpj || null,
      telefone: form.telefone || null,
      celular: form.celular || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      cep: form.cep || null,
      endereco: form.endereco +
        (form.numero ? ', ' + form.numero : '') +
        (form.complemento ? ' - ' + form.complemento : ''),
      bairro: form.bairro || null,
      cidade: form.cidade || null,
      estado: form.estado || null,
      category_id: Number(categoryId),
      subcategory_id: subPrincipal?.id || null,
      specialization_id: espPrincipal?.id || null,
      categoria_nome: cat?.name || '',
      subcategoria_nome: subPrincipal?.name || '',
      especializacao_nome: espPrincipal?.name || '',
      capacidade_produtiva: form.capacidade_produtiva || null,
      moq: form.moq || null,
      prazo_medio_dias: form.prazo_medio_dias || null,
      certificacoes: form.certificacoes || null,
      descricao: form.descricao || null,
      status: 'ativo',
      polo_id: poloId ? Number(poloId) : null,
      polo_textil: polos.find(p => p.id === Number(poloId))?.nome || '',
    }

    let fornecedorId: string
    let insertError: unknown

    if (rascunhoId) {
      const { data, error } = await supabase
        .from('fornecedores')
        .update(payload)
        .eq('id', rascunhoId)
        .select()
      insertError = error
      fornecedorId = data?.[0]?.id || rascunhoId
    } else {
      const { data, error } = await supabase.from('fornecedores').insert([payload]).select()
      insertError = error
      if (!data || !data[0]) {
        setErro('Erro ao enviar cadastro. Tente novamente.')
        setEnviando(false)
        return
      }
      fornecedorId = data[0].id
    }

    if (insertError) {
      setErro('Erro ao enviar cadastro. Tente novamente.')
      setEnviando(false)
      return
    }

    // Registrar aceite dos termos
    await supabase.from('terms_acceptances').insert([{
      user_id: user?.id || null,
      entity_type: 'fornecedor' as const,
      entity_id: fornecedorId,
      terms_version: '1.0',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    }])

    // Insert fornecedor_categorias
    type CatRow = {
      fornecedor_id: string
      category_id: number
      subcategory_id: number | null
      specialization_id: number | null
      categoria_nome: string
      subcategoria_nome: string
      especializacao_nome: string
    }
    const rows: CatRow[] = subcsSelecionadas.length > 0
      ? subcsSelecionadas.flatMap<CatRow>(subId => {
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
      })
      : [{
        fornecedor_id: fornecedorId,
        category_id: Number(categoryId),
        subcategory_id: null,
        specialization_id: null,
        categoria_nome: cat?.name || '',
        subcategoria_nome: '',
        especializacao_nome: '',
      }]

    if (rows.length > 0) {
      await supabase.from('fornecedor_categorias').insert(rows)
    }

    // Clear draft
    localStorage.removeItem(DRAFT_KEY)
    setEnviando(false)
    window.location.href = `/fornecedores/${fornecedorId}`
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: '14px',
    border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none',
    marginTop: '6px', boxSizing: 'border-box', backgroundColor: 'white',
  }
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block' }
  const sec: React.CSSProperties = {
    backgroundColor: 'white', border: '1px solid #E2E8F0',
    borderRadius: '12px', padding: '24px', marginBottom: '20px',
  }
  const tit: React.CSSProperties = {
    fontSize: '15px', fontWeight: 600, color: '#0B1F3B',
    marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9',
  }
  const optLabel: React.CSSProperties = { color: '#64748B', fontWeight: 400, fontSize: '12px' }
  const req: React.CSSProperties = { color: '#EF4444' }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/matching" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Buscar fornecedor</a>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: '#0B1F3B', padding: '28px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Cadastre sua empresa no SNM</h1>
        <p style={{ color: '#93C5FD', fontSize: '14px', margin: 0 }}>Apareça para compradores de todo o Brasil — cadastro gratuito em 3 minutos</p>
      </section>

      {/* Progress bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '20px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'flex-start' }}>
          {STEP_LABELS.map((label, idx) => {
            const num = idx + 1
            const isDone = step > num
            const isActive = step === num
            return (
              <div key={num} style={{ display: 'flex', alignItems: 'flex-start', flex: idx < 2 ? 1 : undefined }}>
                {/* Step */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '72px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, flexShrink: 0,
                    backgroundColor: isDone ? '#10B981' : isActive ? '#0B1F3B' : '#E2E8F0',
                    color: isDone || isActive ? 'white' : '#94A3B8',
                    transition: 'all 0.3s ease',
                  }}>
                    {isDone ? '✓' : num}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0B1F3B' : isDone ? '#10B981' : '#94A3B8',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {label}
                  </span>
                </div>
                {/* Connector */}
                {idx < 2 && (
                  <div style={{
                    flex: 1, height: '2px', marginTop: '17px', marginLeft: '4px', marginRight: '4px',
                    backgroundColor: step > num ? '#10B981' : '#E2E8F0',
                    transition: 'background-color 0.3s ease',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 16px' }}>
        <form onSubmit={handleSubmit}>

          <div style={{
            opacity: transiting ? 0 : 1,
            transform: transiting ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}>

            {/* ── STEP 1: Dados da Empresa ── */}
            {step === 1 && (
              <div>
                <div style={sec}>
                  <h2 style={tit}>Identificação da empresa</h2>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>CNPJ <span style={optLabel}>(opcional — preenche dados automaticamente)</span></label>
                    <input
                      name="cnpj" value={form.cnpj}
                      onChange={e => { handleChange(e); verificarCnpj(e.target.value) }}
                      placeholder="00.000.000/0000-00"
                      style={{ ...inp, maxWidth: '260px', borderColor: cnpjExistente ? '#DC2626' : '#E2E8F0' }}
                    />
                    {cnpjExistente && (
                      <div style={{ marginTop: '10px', padding: '16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
                        <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '10px', fontWeight: 600 }}>
                          Este CNPJ já está cadastrado no SNM.
                        </p>
                        <a href={`/fornecedores/${fornecedorExistenteId}`}
                          style={{ padding: '8px 16px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                          Ver meu perfil
                        </a>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={lbl}>Nome fantasia <strong style={req}>*</strong></label>
                      <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Tecidos Silva" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Razão social <span style={optLabel}>(opcional)</span></label>
                      <input name="razao_social" value={form.razao_social} onChange={handleChange} placeholder="Ex: Tecidos Silva Ltda" style={inp} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={lbl}>Telefone <strong style={req}>*</strong></label>
                      <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 0000-0000" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Celular <span style={optLabel}>(opcional)</span></label>
                      <input name="celular" value={form.celular} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>WhatsApp <span style={optLabel}>(opcional)</span></label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(11) 00000-0000" style={inp} />
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>E-mail <strong style={req}>*</strong></label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contato@empresa.com.br" style={{ ...inp, maxWidth: '340px' }} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Endereço e Polo ── */}
            {step === 2 && (
              <div>
                <div style={sec}>
                  <h2 style={tit}>Localização</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={lbl}>CEP <span style={optLabel}>(opcional — preenche endereço)</span></label>
                      <input name="cep" value={form.cep} onChange={e => { handleChange(e); buscarCep(e.target.value) }} placeholder="00000-000" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Estado <strong style={req}>*</strong></label>
                      <select name="estado" value={form.estado} onChange={handleChange} style={inp}>
                        <option value="">UF</option>
                        {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Cidade <strong style={req}>*</strong></label>
                    <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: São Paulo" style={inp} />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Endereço <span style={optLabel}>(opcional)</span></label>
                    <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Ex: Rua das Flores" style={inp} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={lbl}>Número <span style={optLabel}>(opcional)</span></label>
                      <input name="numero" value={form.numero} onChange={handleChange} placeholder="Ex: 123" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Complemento <span style={optLabel}>(opcional)</span></label>
                      <input name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ex: Apto 42, Bloco B" style={inp} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Bairro <span style={optLabel}>(opcional)</span></label>
                    <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Bom Retiro" style={inp} />
                  </div>

                  <div>
                    <label style={lbl}>Polo têxtil <span style={optLabel}>(opcional)</span></label>
                    <select value={poloId} onChange={e => setPoloId(e.target.value)} style={inp}>
                      <option value="">Não faz parte de um polo têxtil</option>
                      {polos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.estado}</option>)}
                    </select>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Se sua empresa faz parte de um polo produtivo conhecido, selecione acima</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Categorias e Finalização ── */}
            {step === 3 && (
              <div>
                <div style={sec}>
                  <h2 style={tit}>Categorias de atuação</h2>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                    Escolha a categoria e marque todas as subcategorias e especializações que se aplicam.
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={lbl}>Categoria principal <strong style={req}>*</strong></label>
                    <select
                      value={categoryId}
                      onChange={e => { setCategoryId(e.target.value); setSubcsSelecionadas([]); setEspsSelecionadas([]) }}
                      style={inp}
                    >
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
                          <label key={s.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 12px',
                            border: `1px solid ${subcsSelecionadas.includes(s.id) ? '#BFDBFE' : '#E2E8F0'}`,
                            borderRadius: '8px', cursor: 'pointer',
                            backgroundColor: subcsSelecionadas.includes(s.id) ? '#EFF6FF' : 'white',
                            fontSize: '13px',
                            color: subcsSelecionadas.includes(s.id) ? '#1E40AF' : '#374151',
                            fontWeight: subcsSelecionadas.includes(s.id) ? 600 : 400,
                          }}>
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
                        Especializações — marque as que se aplicam:
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
                                <label key={e.id} style={{
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                  padding: '8px 10px',
                                  border: `1px solid ${espsSelecionadas.includes(e.id) ? '#BFDBFE' : '#E2E8F0'}`,
                                  borderRadius: '6px', cursor: 'pointer',
                                  backgroundColor: espsSelecionadas.includes(e.id) ? '#EFF6FF' : 'white',
                                  fontSize: '12px',
                                  color: espsSelecionadas.includes(e.id) ? '#1E40AF' : '#374151',
                                }}>
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
                  <h2 style={tit}>Capacidade produtiva <span style={optLabel}>(opcional)</span></h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={lbl}>Capacidade mensal</label>
                      <input name="capacidade_produtiva" value={form.capacidade_produtiva} onChange={handleChange} placeholder="Ex: 5.000 peças/mês" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>MOQ mínimo</label>
                      <input name="moq" value={form.moq} onChange={handleChange} placeholder="Ex: 100 peças" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Prazo médio (dias)</label>
                      <input name="prazo_medio_dias" value={form.prazo_medio_dias} onChange={handleChange} placeholder="Ex: 30" style={inp} />
                    </div>
                  </div>
                </div>

                <div style={sec}>
                  <h2 style={tit}>Diferenciais <span style={optLabel}>(opcional)</span></h2>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Descrição da empresa</label>
                    <textarea name="descricao" value={form.descricao} onChange={handleChange}
                      placeholder="Conte sobre sua empresa, produtos e diferenciais..."
                      style={{ ...inp, height: '100px', resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={lbl}>Certificações</label>
                    <input name="certificacoes" value={form.certificacoes} onChange={handleChange} placeholder="Ex: OEKO-TEX, ABNT, GOTS, ISO 9001" style={inp} />
                  </div>
                </div>

                {/* Terms acceptance */}
                <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={termosAceitos}
                      onChange={e => setTermosAceitos(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#0B1F3B', flexShrink: 0, marginTop: '2px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                      Li e aceito os{' '}
                      <a href="/termos-fornecedor" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
                        Termos de Uso para Fornecedores
                      </a>{' '}
                      e a{' '}
                      <a href="/privacidade" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
                        Política de Privacidade
                      </a>{' '}
                      do Sistema Nacional da Moda. <strong>*</strong>
                    </span>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Error message */}
          {erro && (
            <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
              {erro}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                style={{ padding: '12px 24px', backgroundColor: 'white', color: '#374151', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              >
                ← Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => goToStep(step + 1)}
                disabled={cnpjExistente || salvandoRascunho}
                style={{
                  flex: 1, maxWidth: '300px',
                  padding: '14px 24px',
                  backgroundColor: cnpjExistente || salvandoRascunho ? '#94A3B8' : '#0B1F3B',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: 600,
                  cursor: cnpjExistente || salvandoRascunho ? 'not-allowed' : 'pointer',
                }}
              >
                {salvandoRascunho ? 'Salvando...' : `Próximo →`}
              </button>
            ) : (
              <button
                type="submit"
                disabled={enviando || !termosAceitos}
                style={{
                  flex: 1, maxWidth: '300px',
                  padding: '14px 24px',
                  backgroundColor: enviando || !termosAceitos ? '#94A3B8' : '#0B1F3B',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: 600,
                  cursor: enviando || !termosAceitos ? 'not-allowed' : 'pointer',
                }}
              >
                {enviando ? 'Cadastrando...' : 'Cadastrar minha empresa'}
              </button>
            )}
          </div>

          {/* Step indicator text */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginBottom: '32px' }}>
            Etapa {step} de 3
            {step < 3 && <> — progresso salvo automaticamente</>}
          </p>

        </form>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#060F1E', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>2026 Sistema Nacional da Moda</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href="/termos-fornecedor" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Fornecedor</a>
          <a href="/termos-cliente" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Cliente</a>
          <a href="/privacidade" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Política de Privacidade</a>
        </div>
      </footer>

    </main>
  )
}
