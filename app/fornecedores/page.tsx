export default function Fornecedores() {
  const fornecedores = [
    { id: 1, nome: 'Dalila Textil', segmento: 'Tecidos e Malhas', cidade: 'São Paulo', estado: 'SP', telefone: '(11) 99999-0001' },
    { id: 2, nome: 'DI Palma Tecidos', segmento: 'Tecidos e Malhas', cidade: 'São Paulo', estado: 'SP', telefone: '(11) 99999-0002' },
    { id: 3, nome: 'Dtextil Malhas', segmento: 'Indústria Têxtil', cidade: 'Blumenau', estado: 'SC', telefone: '(47) 99999-0003' },
    { id: 4, nome: 'FGG Embalagens', segmento: 'Embalagens e Tags', cidade: 'São Paulo', estado: 'SP', telefone: '(11) 99999-0004' },
    { id: 5, nome: 'Dalla Confecções', segmento: 'Confecção', cidade: 'Curitiba', estado: 'PR', telefone: '(41) 99999-0005' },
  ]

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <header style={{ padding: '30px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← Voltar</a>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginTop: '10px' }}>Fornecedores</h1>
        <p style={{ color: '#666' }}>129 fornecedores cadastrados</p>
      </header>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <select style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
          <option>Todos os segmentos</option>
          <option>Tecidos e Malhas</option>
          <option>Aviamentos</option>
          <option>Confecção</option>
          <option>Estamparia</option>
          <option>Embalagens e Tags</option>
          <option>Indústria Têxtil</option>
          <option>Acessórios</option>
          <option>Bordado e Aplicações</option>
        </select>
        <select style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
          <option>Todos os estados</option>
          <option>SP</option>
          <option>SC</option>
          <option>PR</option>
          <option>MG</option>
          <option>RS</option>
          <option>RJ</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {fornecedores.map((f) => (
          <div key={f.id} style={{
            padding: '20px',
            border: '1px solid #eee',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#1E3A5F', marginBottom: '6px' }}>{f.nome}</h3>
              <span style={{
                fontSize: '12px',
                backgroundColor: '#E6F1FB',
                color: '#0C447C',
                padding: '3px 10px',
                borderRadius: '20px',
                marginRight: '8px'
              }}>
                {f.segmento}
              </span>
              <span style={{ fontSize: '13px', color: '#888' }}>📍 {f.cidade} – {f.estado}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{f.telefone}</div>
              <a href={`/fornecedores/${f.id}`} style={{
                padding: '8px 16px',
                backgroundColor: '#1E3A5F',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px'
              }}>
                Ver perfil
              </a>
            </div>
          </div>
        ))}
      </div>

    </main>
  )
}