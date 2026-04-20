import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: categorias } = await supabase
    .from('categories')
    .select('*, subcategories(id, name)')
    .order('id')

  const { count: totalFornecedores } = await supabase
    .from('fornecedores')
    .select('*', { count: 'exact', head: true })

  const getIcone = (name: string) => {
    if (name.includes('prima')) return '🌱'
    if (name.includes('xtil')) return '🏭'
    if (name.includes('enef')) return '🎨'
    if (name.includes('viamento')) return '🧵'
    if (name.includes('fec')) return '👕'
    if (name.includes('rivate')) return '🏷️'
    if (name.includes('esign')) return '✏️'
    if (name.includes('ogist')) return '🚚'
    if (name.includes('strib')) return '📦'
    if (name.includes('arejo')) return '🛍️'
    if (name.includes('arketing')) return '📣'
    if (name.includes('ecnolog')) return '💻'
    if (name.includes('stent')) return '♻️'
    if (name.includes('ducac')) return '🎓'
    if (name.includes('ervic')) return '⚙️'
    return '🏷️'
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1E3A5F', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
            <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/matching" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Buscar fornecedor</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: '#1E3A5F', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#2C5282', color: '#93C5FD', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
            O maior diretorio B2B da moda brasileira
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '20px', lineHeight: 1.2 }}>
            Conectamos toda a cadeia produtiva da moda no Brasil
          </h1>
          <p style={{ fontSize: '18px', color: '#93C5FD', marginBottom: '40px', lineHeight: 1.6 }}>
            De materia-prima ao varejo. Fornecedores, confeccoes, servicos e muito mais em um unico lugar.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/matching" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>
              Encontrar fornecedor
            </a>
            <a href="/cadastro" style={{ backgroundColor: 'transparent', color: 'white', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 500, textDecoration: 'none', border: '2px solid #3B82F6' }}>
              Cadastrar minha empresa
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#2C5282', padding: '24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>{totalFornecedores || 0}</div>
            <div style={{ fontSize: '13px', color: '#93C5FD' }}>Fornecedores cadastrados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>8</div>
            <div style={{ fontSize: '13px', color: '#93C5FD' }}>Elos da cadeia produtiva</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>27</div>
            <div style={{ fontSize: '13px', color: '#93C5FD' }}>Estados cobertos</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>100%</div>
            <div style={{ fontSize: '13px', color: '#93C5FD' }}>Gratuito para comecar</div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1E3A5F', marginBottom: '12px' }}>Cadeia produtiva completa</h2>
          <p style={{ fontSize: '16px', color: '#64748B' }}>Da fibra ao varejo — encontre fornecedores em cada elo</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {categorias?.map((cat: any) => (
            <a key={cat.id} href={`/fornecedores?categoria=${cat.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {getIcone(cat.name)}
                  </div>
                  <div style={{ fontWeight: 600, color: '#1E3A5F', fontSize: '15px' }}>{cat.name}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.subcategories?.slice(0, 3).map((sub: any) => (
                    <span key={sub.id} style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '20px' }}>
                      {sub.name}
                    </span>
                  ))}
                  {cat.subcategories?.length > 3 && (
                    <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '3px 8px', borderRadius: '20px' }}>
                      +{cat.subcategories.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1E3A5F', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
            Faca parte do SNM
          </h2>
          <p style={{ fontSize: '16px', color: '#93C5FD', marginBottom: '32px' }}>
            Cadastro gratuito. Sem cartao de credito. Comece agora.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#93C5FD', fontSize: '13px', marginBottom: '10px' }}>Sou fornecedor de moda</p>
              <a href="/cadastro" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                Cadastrar empresa
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#93C5FD', fontSize: '13px', marginBottom: '10px' }}>Busco fornecedores</p>
              <a href="/clientes" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: 'transparent', color: 'white', border: '2px solid #3B82F6', borderRadius: '8px', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                Criar conta gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>
          SNM - Sistema Nacional da Moda © 2025 — Conectando a cadeia produtiva do Brasil
        </div>
      </footer>

    </main>
  )
}