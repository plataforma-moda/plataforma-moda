import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: categorias } = await supabase
    .from('categories')
    .select('*, subcategories(id, name)')
    .order('id')

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
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0B1F3B', color: 'white' }}>

      {/* NAVBAR */}
      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#0B1F3B', zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/matching" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Explorar</a>
          <a href="/cadastro" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Cadastrar empresa</a>
          <a href="/polos" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Polos Texteis</a>
          <a href="/sobre" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none' }}>Sobre</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ padding: '100px 40px', textAlign: 'center', backgroundColor: '#0B1F3B' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '20px' }}>
          Sistema Nacional da Moda
        </p>
        <h1 style={{ fontSize: '56px', fontWeight: 700, lineHeight: 1.1, maxWidth: '860px', margin: '0 auto 24px', color: 'white' }}>
          A infraestrutura de dados da cadeia produtiva da moda no Brasil.
        </h1>
        <p style={{ fontSize: '18px', color: '#93C5FD', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          
        </p>Encontre fornecedores, ganhe visibilidade e tome decisões com base em dados — da matéria-prima ao varejo.
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '48px' }}>
          <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
            Cadastrar empresa
          </a>
          <a href="/matching" style={{ backgroundColor: 'transparent', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid #3B82F6' }}>
            Buscar fornecedores
          </a>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0B1F3B', marginBottom: '20px' }}>
            O setor é grande. Mas ainda opera de forma fragmentada.
          </h2>
          <p style={{ color: '#555', marginBottom: '40px', lineHeight: 1.8, fontSize: '16px' }}>
            O setor têxtil e de confecção brasileiro é um dos mais complexos do mundo. São dezenas de elos interdependentes distribuídos por todo o território nacional.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              'Fornecedores com pouca visibilidade',
              'Compradores sem referência confiável',
              'Dados dispersos e despadronizados',
              'Decisões baseadas em contatos informais',
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '12px', border: '1px solid #eee', fontSize: '15px', color: '#333' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUCAO */}
      <section style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: '#0B1F3B' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
            Uma nova infraestrutura para a moda brasileira
          </h2>
          <p style={{ color: '#93C5FD', lineHeight: 1.8, fontSize: '16px' }}>
            O Sistema Nacional da Moda organiza e conecta fornecedores, indústrias e marcas por meio de dados estruturados, padronizados e verificáveis.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { titulo: 'Mapeamento', texto: 'Empresas com dados técnicos padronizados' },
            { titulo: 'Estruturação', texto: 'Organização por categoria e localização' },
            { titulo: 'Conexão', texto: 'Busca eficiente entre compradores e fornecedores' },
            { titulo: 'Escala', texto: 'A rede cresce e gera mais valor' },
          ].map((item, i) => (
            <div key={i}>
              <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0B1F3B', marginBottom: '8px' }}>{item.titulo}</h3>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6 }}>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{ padding: '80px 40px', backgroundColor: '#0B1F3B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              Cadeia produtiva completa
            </h2>
            <p style={{ fontSize: '16px', color: '#93C5FD' }}>Da fibra ao varejo — 15 categorias, 60 subcategorias, 322 especializações</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {categorias?.map((cat: any) => (
              <a key={cat.id} href={`/categoria/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ border: '1px solid #1a3a5c', borderRadius: '12px', padding: '20px', cursor: 'pointer', backgroundColor: '#0F2844', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{getIcone(cat.name)}</span>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    

                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {[
            { titulo: 'Mais visibilidade', texto: 'Seja encontrado em todo o Brasil' },
            { titulo: 'Melhores decisões', texto: 'Baseadas em dados confiáveis' },
            { titulo: 'Redução de risco', texto: 'Mais clareza sobre parceiros' },
            { titulo: 'Eficiência operacional', texto: 'Menos tempo buscando, mais tempo produzindo' },
          ].map((item, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0B1F3B', marginBottom: '8px' }}>{item.titulo}</h3>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: '#0B1F3B' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
            Não é um diretório. É uma base estruturada.
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '16px', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Dados organizados com critérios técnicos para apoiar decisões reais na cadeia produtiva da moda.
          </p>
        </div>
      </section>

      {/* MODELO */}
      <section style={{ backgroundColor: '#ffffff', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0B1F3B', marginBottom: '16px' }}>
            Acesso aberto. Visibilidade ampliada.
          </h2>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.8 }}>
            O cadastro é aberto a todos. Empresas com planos pagos terão maior destaque, com critérios claros e públicos.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 40px', textAlign: 'center', backgroundColor: '#0B1F3B' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 700, color: 'white', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.2 }}>
          A cadeia da moda já existe. Falta você estar nela.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
            Cadastrar empresa
          </a>
          <a href="/matching" style={{ backgroundColor: 'transparent', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid #3B82F6' }}>
            Buscar fornecedores
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#060F1E', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>
          2026 Sistema Nacional da Moda — Infraestrutura de dados da cadeia produtiva
        </div>
      </footer>

    </main>
  )
}