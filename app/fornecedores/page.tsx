import { supabase } from '../../lib/supabase'

export default async function Home() {
  const { data: categorias } = await supabase
    .from('categories')
    .select('*, subcategories(id, name)')
    .order('id')

  const icones: Record<string, string> = {
    'Matéria-prima': '🌱',
    'Indústria Têxtil': '🏭',
    'Confecção': '👕',
    'Desenvolvimento': '✏️',
    'Distribuição': '🚚',
    'Comercialização': '🛍️',
    'Serviços de apoio': '⚙️',
    'Ecossistema': '🌐',
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

      <header style={{ textAlign: 'center', padding: '40px 0', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '32px', color: '#1E3A5F', marginBottom: '10px' }}>Plataforma Moda BR</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>O maior diretório da cadeia produtiva da moda no Brasil</p>
      </header>

      <section style={{ padding: '30px 0', textAlign: 'center' }}>
        <input type="text" placeholder="Buscar fornecedor, segmento ou cidade..."
          style={{ width: '60%', padding: '14px 20px', fontSize: '16px', border: '2px solid #1E3A5F', borderRadius: '8px', outline: 'none' }} />
        <button style={{ marginLeft: '10px', padding: '14px 28px', backgroundColor: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Buscar
        </button>
      </section>

      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '22px', color: '#1E3A5F', marginBottom: '6px' }}>Cadeia produtiva da moda</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Da fibra ao varejo — encontre fornecedores em cada elo da cadeia</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {categorias?.map((cat: any) => (
            <a key={cat.id} href={`/fornecedores?categoria=${cat.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#f9f9f9', cursor: 'pointer', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ width: '24px', height: '24px', backgroundColor: '#1E3A5F', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                    {cat.id}
                  </span>
                  <span style={{ fontSize: '20px' }}>{icones[cat.name] || '🏷️'}</span>
                </div>
                <div style={{ fontWeight: '600', color: '#1E3A5F', fontSize: '15px', marginBottom: '10px' }}>{cat.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.subcategories?.map((sub: any) => (
                    <span key={sub.id} style={{ fontSize: '11px', backgroundColor: '#E6F1FB', color: '#0C447C', padding: '2px 8px', borderRadius: '20px' }}>
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1E3A5F', borderRadius: '16px', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>Faça parte da maior rede de moda B2B do Brasil</h2>
        <p style={{ color: '#aac4e0', marginBottom: '30px' }}>Conectamos fornecedores e compradores de todo o país</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#aac4e0', fontSize: '13px', marginBottom: '10px' }}>Vende para marcas e lojistas?</p>
            <a href="/cadastro" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: 'white', color: '#1E3A5F', borderRadius: '8px', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              Sou fornecedor
            </a>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#aac4e0', fontSize: '13px', marginBottom: '10px' }}>Busca fornecedores para seu negócio?</p>
            <a href="/clientes" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: '8px', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              Sou comprador
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}