import { supabase } from '../../../lib/supabase'

export default async function PerfilFornecedor({ params }: any) {
  const { id } = await params

  const { data: f, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !f) {
    return <p>Fornecedor não encontrado.</p>
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/fornecedores" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← Voltar para fornecedores</a>
      </header>

      <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '16px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#1E3A5F', marginBottom: '6px' }}>{f.nome}</h1>
            {f.razao_social && <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{f.razao_social}</p>}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {f.categoria_nome && (
                <span style={{ fontSize: '13px', backgroundColor: '#E6F1FB', color: '#0C447C', padding: '4px 12px', borderRadius: '20px' }}>
                  {f.categoria_nome}
                </span>
              )}
              {f.subcategoria_nome && (
                <span style={{ fontSize: '13px', backgroundColor: '#EEEDFE', color: '#3C3489', padding: '4px 12px', borderRadius: '20px' }}>
                  {f.subcategoria_nome}
                </span>
              )}
              {f.especializacao_nome && (
                <span style={{ fontSize: '13px', backgroundColor: '#EAF3DE', color: '#27500A', padding: '4px 12px', borderRadius: '20px' }}>
                  {f.especializacao_nome}
                </span>
              )}
            </div>
          </div>
          <span style={{ fontSize: '12px', backgroundColor: '#EAF3DE', color: '#27500A', padding: '4px 12px', borderRadius: '20px' }}>
            ✓ Ativo
          </span>
        </div>
      </div>

      {f.descricao && (
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '12px' }}>Sobre a empresa</h2>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{f.descricao}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>📍 Localização</h2>
          {f.cidade && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Cidade:</strong> {f.cidade}</p>}
          {f.estado && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Estado:</strong> {f.estado}</p>}
          {f.bairro && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Bairro:</strong> {f.bairro}</p>}
          {f.endereco && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Endereço:</strong> {f.endereco}</p>}
          {f.cep && <p style={{ fontSize: '14px', color: '#555' }}><strong>CEP:</strong> {f.cep}</p>}
        </div>

        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>📞 Contato</h2>
          {f.telefone && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Telefone:</strong> {f.telefone}</p>}
          {f.celular && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Celular:</strong> {f.celular}</p>}
          {f.whatsapp && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>WhatsApp:</strong> {f.whatsapp}</p>}
          {f.email && <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>E-mail:</strong> {f.email}</p>}
          {f.cnpj && <p style={{ fontSize: '14px', color: '#555' }}><strong>CNPJ:</strong> {f.cnpj}</p>}
        </div>

        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>🏭 Capacidade produtiva</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Capacidade:</strong> {f.capacidade_produtiva || 'A consultar'}</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>MOQ minimo:</strong> {f.moq || 'A consultar'}</p>
          <p style={{ fontSize: '14px', color: '#555' }}><strong>Prazo medio:</strong> {f.prazo_medio_dias ? `${f.prazo_medio_dias} dias` : 'A consultar'}</p>
        </div>

        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>⭐ Certificacoes</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>{f.certificacoes || 'Nao informado'}</p>
        </div>

      </div>

      <div style={{ padding: '30px', backgroundColor: '#1E3A5F', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>
          Quer fazer negocio com {f.nome}?
        </h2>
        <p style={{ color: '#aac4e0', marginBottom: '20px', fontSize: '14px' }}>
          Envie uma solicitacao de cotacao agora
        </p>
        <a href="/matching" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: 'white', color: '#1E3A5F', borderRadius: '8px', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>
          Solicitar cotacao
        </a>
      </div>

    </main>
  )
}