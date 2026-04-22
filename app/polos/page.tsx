import { supabase } from '../../lib/supabase'

type Polo = {
  id: number
  nome: string
  regiao: string
  estado: string
  cidades: string
  especialidade: string
  descricao: string
}

export default async function Polos() {
  const { data: polos } = await supabase
    .from('polos_texteis')
    .select('*')
    .order('regiao, nome')

  const regioes = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste']

  const coresPorRegiao: Record<string, { bg: string; border: string; badge: string; texto: string }> = {
    'Sudeste': { bg: '#0F2844', border: '#1a3a5c', badge: '#3B82F6', texto: '#93C5FD' },
    'Sul': { bg: '#0F2844', border: '#1a3a5c', badge: '#0EA5E9', texto: '#7DD3FC' },
    'Nordeste': { bg: '#0F2844', border: '#1a3a5c', badge: '#6366F1', texto: '#A5B4FC' },
    'Centro-Oeste': { bg: '#0F2844', border: '#1a3a5c', badge: '#8B5CF6', texto: '#C4B5FD' },
  }

  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0B1F3B', minHeight: '100vh' }}>

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#0B1F3B', zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/matching" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Explorar</a>
          <a href="/cadastro" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Cadastrar empresa</a>
          <a href="/sobre" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Sobre</a>
        </nav>
      </header>

      <section style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#0B1F3B' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '16px' }}>
          Mapa produtivo
        </p>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
          Polos Texteis do Brasil
        </h1>
        <p style={{ fontSize: '16px', color: '#93C5FD', maxWidth: '600px', margin: '0 auto' }}>
          Os principais centros produtivos da moda brasileira - da fibra ao varejo, distribuidos por todo o territorio nacional.
        </p>
      </section>

      <section style={{ padding: '20px 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          {regioes.map(r => {
            const cores = coresPorRegiao[r]
            const total = polos?.filter(p => p.regiao === r).length || 0
            return (
              <div key={r} style={{ padding: '8px 20px', backgroundColor: cores.bg, border: `1px solid ${cores.border}`, borderRadius: '20px', fontSize: '13px', color: cores.texto, fontWeight: 500 }}>
                {r} - {total} polo{total > 1 ? 's' : ''}
              </div>
            )
          })}
        </div>

        {regioes.map(regiao => {
          const polosRegiao = polos?.filter(p => p.regiao === regiao) || []
          if (polosRegiao.length === 0) return null
          const cores = coresPorRegiao[regiao]

          return (
            <div key={regiao} style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '4px', height: '32px', backgroundColor: cores.badge, borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>{regiao}</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {polosRegiao.map((polo: Polo) => (
                  <div key={polo.id} style={{ backgroundColor: cores.bg, border: `1px solid ${cores.border}`, borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'white' }}>{polo.nome}</h3>
                      <span style={{ fontSize: '12px', backgroundColor: cores.badge, color: 'white', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>
                        {polo.estado}
                      </span>
                    </div>

                    {polo.descricao && (
                      <p style={{ fontSize: '13px', color: cores.texto, marginBottom: '12px', lineHeight: 1.5 }}>
                        {polo.descricao}
                      </p>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '6px' }}>CIDADES</div>
                      <p style={{ fontSize: '13px', color: '#CBD5E1' }}>{polo.cidades}</p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', marginBottom: '6px' }}>ESPECIALIDADE</div>
                      <p style={{ fontSize: '13px', color: cores.texto }}>{polo.especialidade}</p>
                    </div>

                    <a href={`/matching?polo=${polo.id}`}
                      style={{ display: 'block', textAlign: 'center', padding: '10px', backgroundColor: 'transparent', border: `1px solid ${cores.badge}`, color: cores.texto, borderRadius: '8px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
                      Ver fornecedores deste polo
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <section style={{ backgroundColor: '#0F2844', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          Sua empresa faz parte de um polo?
        </h2>
        <p style={{ color: '#93C5FD', marginBottom: '32px', fontSize: '15px' }}>
          Cadastre-se no SNM e apareca para compradores de todo o Brasil.
        </p>
        <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
          Cadastrar minha empresa
        </a>
      </section>

      <footer style={{ backgroundColor: '#060F1E', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>
          2026 Sistema Nacional da Moda - Infraestrutura de dados da cadeia produtiva
        </div>
      </footer>

    </main>
  )
}