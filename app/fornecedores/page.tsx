import { createClient } from '@/lib/supabase/server'

export default async function Fornecedores() {
  const supabase = await createClient()
  const { data: fornecedores, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('nome', { ascending: true })

  const { data: categorias } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
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

      {/* Header */}
      <section style={{ backgroundColor: '#0B1F3B', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Diretório de Fornecedores</h1>
        <p style={{ color: '#93C5FD', fontSize: '15px' }}>{fornecedores?.length || 0} empresas cadastradas na cadeia produtiva</p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Filtros */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3B', marginRight: '4px' }}>Filtrar por:</span>
          <select style={{ padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', color: '#1A202C', backgroundColor: '#F8FAFC' }}>
            <option>Todas as categorias</option>
            {categorias?.map((c: any) => <option key={c.id}>{c.name}</option>)}
          </select>
          <select style={{ padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', color: '#1A202C', backgroundColor: '#F8FAFC' }}>
            <option>Todos os estados</option>
            {['SP','SC','PR','MG','RS','RJ','CE','BA','GO','ES'].map(uf => <option key={uf}>{uf}</option>)}
          </select>
          <input type="text" placeholder="Buscar por nome..." style={{ padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', flex: 1, minWidth: '200px', outline: 'none' }} />
        </div>

        {/* Lista */}
        {fornecedores?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
            <h3 style={{ color: '#0B1F3B', marginBottom: '8px' }}>Nenhum fornecedor ainda</h3>
            <p style={{ color: '#64748B', marginBottom: '20px' }}>Seja o primeiro a se cadastrar no SNM</p>
            <a href="/cadastro" style={{ padding: '12px 24px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
              Cadastrar empresa
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {fornecedores?.map((f: any) => (
              <div key={f.id} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                  {/* Avatar */}
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    🏭
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B1F3B', marginBottom: '6px' }}>{f.nome}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {f.categoria_nome && (
                        <span style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>
                          {f.categoria_nome}
                        </span>
                      )}
                      {f.subcategoria_nome && (
                        <span style={{ fontSize: '12px', backgroundColor: '#F5F3FF', color: '#5B21B6', padding: '3px 10px', borderRadius: '20px' }}>
                          {f.subcategoria_nome}
                        </span>
                      )}
                      {f.especializacao_nome && (
                        <span style={{ fontSize: '12px', backgroundColor: '#F0FDF4', color: '#166534', padding: '3px 10px', borderRadius: '20px' }}>
                          {f.especializacao_nome}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {f.cidade && (
                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                          📍 {f.cidade}{f.estado ? ` — ${f.estado}` : ''}
                        </span>
                      )}
                      {f.moq && (
                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                          📦 MOQ: {f.moq}
                        </span>
                      )}
                      {f.prazo_medio_dias && (
                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                          ⏱ {f.prazo_medio_dias} dias
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <a href={`/fornecedores/${f.id}`} style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0B1F3B', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                    Ver perfil
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>
          SNM - Sistema Nacional da Moda © 2026
        </div>
      </footer>

    </main>
  )
}
