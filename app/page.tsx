export default function Home() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <header style={{ textAlign: 'center', padding: '40px 0', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '32px', color: '#1E3A5F', marginBottom: '10px' }}>
          Plataforma Moda BR
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          O maior diretório de fornecedores da cadeia produtiva da moda no Brasil
        </p>
      </header>

      <section style={{ padding: '30px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Buscar fornecedor, segmento ou cidade..."
          style={{
            width: '60%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #1E3A5F',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        <button style={{
          marginLeft: '10px',
          padding: '14px 28px',
          backgroundColor: '#1E3A5F',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Buscar
        </button>
      </section>

      <section>
        <h2 style={{ fontSize: '22px', color: '#1E3A5F', marginBottom: '20px' }}>
          Categorias
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { nome: 'Tecidos e Malhas', total: 36, icone: '🧶' },
            { nome: 'Aviamentos', total: 18, icone: '🪡' },
            { nome: 'Confecção', total: 15, icone: '👕' },
            { nome: 'Estamparia', total: 5, icone: '🎨' },
            { nome: 'Embalagens e Tags', total: 8, icone: '📦' },
            { nome: 'Bordado e Aplicações', total: 3, icone: '🧵' },
            { nome: 'Acessórios', total: 14, icone: '👜' },
            { nome: 'Indústria Têxtil', total: 7, icone: '🏭' },
          ].map((cat) => (
            <a key={cat.nome} href="/fornecedores" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icone}</div>
                <div style={{ fontWeight: '500', color: '#1E3A5F', marginBottom: '4px' }}>{cat.nome}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>{cat.total} fornecedores</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', marginTop: '50px', padding: '40px', backgroundColor: '#1E3A5F', borderRadius: '16px' }}>
        <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>
          É fornecedor? Cadastre sua empresa
        </h2>
        <p style={{ color: '#aac4e0', marginBottom: '20px' }}>
          Apareça para compradores de todo o Brasil
        </p>
        <button style={{
          padding: '14px 32px',
          backgroundColor: 'white',
          color: '#1E3A5F',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Quero me cadastrar
        </button>
      </section>

    </main>
  )
}