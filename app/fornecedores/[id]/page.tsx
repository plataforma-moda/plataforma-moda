import { createClient } from '@/lib/supabase/server'

export default async function PerfilFornecedor({ params }: any) {
  const supabase = await createClient()
  const { id } = await params

  const { data: f, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !f) {
    return (
      <main style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '80px' }}>
        <h2 style={{ color: '#1E3A5F' }}>Fornecedor não encontrado</h2>
        <a href="/fornecedores" style={{ color: '#3B82F6' }}>Voltar ao diretório</a>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1E3A5F', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
            <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
          </div>
        </a>
        <a href="/matching" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          Buscar fornecedor
        </a>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', fontSize: '13px', color: '#64748B' }}>
          <a href="/" style={{ color: '#3B82F6', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <a href="/fornecedores" style={{ color: '#3B82F6', textDecoration: 'none' }}>Fornecedores</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <span>{f.nome}</span>
        </div>

        {/* Header do perfil */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
                🏭
              </div>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1E3A5F', marginBottom: '4px' }}>{f.nome}</h1>
                {f.razao_social && <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '12px' }}>{f.razao_social}</p>}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {f.categoria_nome && (
                    <span style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>
                      {f.categoria_nome}
                    </span>
                  )}
                  {f.subcategoria_nome && (
                    <span style={{ fontSize: '12px', backgroundColor: '#F5F3FF', color: '#5B21B6', padding: '4px 12px', borderRadius: '20px' }}>
                      {f.subcategoria_nome}
                    </span>
                  )}
                  {f.especializacao_nome && (
                    <span style={{ fontSize: '12px', backgroundColor: '#F0FDF4', color: '#166534', padding: '4px 12px', borderRadius: '20px' }}>
                      {f.especializacao_nome}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', backgroundColor: '#F0FDF4', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontWeight: 500, border: '1px solid #BBF7D0' }}>
                Ativo
              </span>
              <a href={`/editar/${f.id}`} style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '6px 14px', borderRadius: '20px', fontWeight: 500, border: '1px solid #BFDBFE', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Editar cadastro
              </a>
            </div>
          </div>
        </div>

        {/* Descricao */}
        {f.descricao && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E3A5F', marginBottom: '12px' }}>Sobre a empresa</h2>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>{f.descricao}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Localização */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 Localização
            </h2>
            {f.cidade && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Cidade</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.cidade}</span></div>}
            {f.estado && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Estado</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.estado}</span></div>}
            {f.bairro && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Bairro</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.bairro}</span></div>}
            {f.cep && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}><span style={{ color: '#64748B' }}>CEP</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.cep}</span></div>}
          </div>

          {/* Contato */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📞 Contato
            </h2>
            {f.telefone && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Telefone</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.telefone}</span></div>}
            {f.celular && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Celular</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.celular}</span></div>}
            {f.whatsapp && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>WhatsApp</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.whatsapp}</span></div>}
            {f.email && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>E-mail</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.email}</span></div>}
            {f.cnpj && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}><span style={{ color: '#64748B' }}>CNPJ</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.cnpj}</span></div>}
          </div>

          {/* Capacidade */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏭 Capacidade produtiva
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Capacidade mensal</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.capacidade_produtiva || 'A consultar'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}><span style={{ color: '#64748B' }}>MOQ mínimo</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.moq || 'A consultar'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}><span style={{ color: '#64748B' }}>Prazo médio</span><span style={{ color: '#1A202C', fontWeight: 500 }}>{f.prazo_medio_dias ? `${f.prazo_medio_dias} dias` : 'A consultar'}</span></div>
          </div>

          {/* Certificações */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Certificações
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{f.certificacoes || 'Nao informado'}</p>
          </div>

        </div>

        

      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center', marginTop: '40px' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}