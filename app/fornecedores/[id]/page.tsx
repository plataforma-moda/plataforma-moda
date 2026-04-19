import { supabase } from '../../../lib/supabase'

export default async function PerfilFornecedor({ params }: any) {
  const { id } = await params

  const { data: f, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !f) {
    return <p>Fornecedor não encontrado. ID: {id}</p>
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/fornecedores" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← Voltar para fornecedores</a>
      </header>

      <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '16px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#1E3A5F', marginBottom: '8px' }}>{f['Nome']}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{f['Razão Social']}</p>
            <span style={{ fontSize: '13px', backgroundColor: '#E6F1FB', color: '#0C447C', padding: '4px 12px', borderRadius: '20px' }}>
              {f['Segmento']}
            </span>
          </div>
          <span style={{ fontSize: '12px', backgroundColor: '#EAF3DE', color: '#27500A', padding: '4px 12px', borderRadius: '20px' }}>
            ✓ Ativo
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>📍 Localização</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Cidade:</strong> {f['Cidade']}</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Estado:</strong> {f['Estado']}</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>CEP:</strong> {f['CEP']}</p>
          <p style={{ fontSize: '14px', color: '#555' }}><strong>Endereço:</strong> {f['Endereço']}</p>
        </div>
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>📞 Contato</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Telefone:</strong> {f['Telefone']}</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>Celular:</strong> {f['Celular']}</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>E-mail:</strong> {f['E-mail']}</p>
          <p style={{ fontSize: '14px', color: '#555' }}><strong>CNPJ:</strong> {f['CNPJ']}</p>
        </div>
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>🏭 Produção</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}><strong>MOQ mínimo:</strong> {f['MOQ (mín. peças)'] || 'A consultar'}</p>
          <p style={{ fontSize: '14px', color: '#555' }}><strong>Lead time:</strong> {f['Lead time (dias)'] ? `${f['Lead time (dias)']} dias` : 'A consultar'}</p>
        </div>
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '16px' }}>⭐ Especialidades</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>{f['Especialidades'] || 'Não informado'}</p>
        </div>
      </div>

      <div style={{ padding: '30px', backgroundColor: '#1E3A5F', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>Quer fazer negócio com {f['Nome']}?</h2>
        <p style={{ color: '#aac4e0', marginBottom: '20px', fontSize: '14px' }}>Envie uma solicitação de cotação agora</p>
        <button style={{ padding: '14px 32px', backgroundColor: 'white', color: '#1E3A5F', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
          Solicitar cotação
        </button>
      </div>

    </main>
  )
}