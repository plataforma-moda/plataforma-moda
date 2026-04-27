import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/plans'
import MobileNav from './MobileNav'

export const metadata: Metadata = {
  title: 'SN Moda — A maior rede B2B do setor têxtil brasileiro',
  description:
    'Conectamos fornecedores e compradores de toda a cadeia têxtil brasileira. 129+ fornecedores verificados, 15 categorias, 60+ subcategorias. Cadastre sua empresa grátis.',
  keywords:
    'fornecedores têxteis, moda B2B, cadeia produtiva moda, fornecedores confecção, setor têxtil Brasil',
  openGraph: {
    title: 'SN Moda — A maior rede B2B do setor têxtil brasileiro',
    description:
      'Conectamos fornecedores e compradores de toda a cadeia têxtil brasileira. Cadastre sua empresa grátis.',
    url: 'https://snmoda.com.br',
    siteName: 'SN Moda',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SN Moda — A maior rede B2B do setor têxtil brasileiro',
    description: 'Conectamos fornecedores e compradores da cadeia têxtil brasileira.',
  },
  alternates: {
    canonical: 'https://snmoda.com.br',
  },
}

const CATEGORY_ICONS: Record<string, string> = {
  'Matéria-Prima': '🌱',
  'Indústria Têxtil': '🏭',
  'Beneficiamento': '🎨',
  'Aviamentos': '🧵',
  'Confecção': '👕',
  'Private Label': '🏷️',
  'Design': '✏️',
  'Logística': '🚚',
  'Distribuição': '📦',
  'Varejo': '🛍️',
  'Marketing': '📣',
  'Tecnologia': '💻',
  'Sustentabilidade': '♻️',
  'Educação': '🎓',
  'Serviços': '⚙️',
}

function getCategoryIcon(name: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase().slice(0, 5))) return icon
  }
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
  return '⚙️'
}

export default async function Home() {
  const supabase = await createClient()

  const [
    { count: fornecedoresCount },
    { count: categoriasCount },
    { count: subcategoriasCount },
    { count: especializacoesCount },
    { data: estadosData },
    { data: categorias },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('fornecedores').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('subcategories').select('*', { count: 'exact', head: true }),
    supabase.from('specializations').select('*', { count: 'exact', head: true }),
    supabase.from('fornecedores').select('estado'),
    supabase.from('categories').select('id, name').order('id'),
    supabase.auth.getUser(),
  ])

  const estadosUnicos = new Set(
    (estadosData ?? []).map((f: { estado: string | null }) => f.estado).filter(Boolean)
  ).size

  const totalFornecedores = fornecedoresCount ?? 129
  const totalCategorias = categoriasCount ?? 15
  const totalSubcategorias = subcategoriasCount ?? 60
  const totalEspecializacoes = especializacoesCount ?? 322
  const totalEstados = estadosUnicos || 18

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'SN Moda — Sistema Nacional da Moda',
        url: 'https://snmoda.com.br',
        description: 'Plataforma B2B que conecta fornecedores e compradores da cadeia têxtil brasileira',
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        name: 'SN Moda',
        url: 'https://snmoda.com.br',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://snmoda.com.br/matching?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-animate { animation: fadeUp 0.7s ease both; }
        .hero-animate-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .hero-animate-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .hero-animate-3 { animation: fadeUp 0.7s 0.35s ease both; }
        .hero-animate-4 { animation: fadeUp 0.7s 0.5s ease both; }
        .stat-card:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
        .benefit-card:hover { border-color: #3B82F6 !important; transform: translateY(-2px); transition: all 0.2s ease; }
        .cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: white; padding: 16px 32px; border-radius: 12px;
          font-weight: 700; font-size: 16px; text-decoration: none;
          box-shadow: 0 4px 20px rgba(59,130,246,0.4);
          transition: all 0.2s ease;
          animation: pulse-glow 2.5s infinite;
        }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(59,130,246,0.5); }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: white; padding: 16px 32px;
          border-radius: 12px; font-weight: 600; font-size: 16px;
          text-decoration: none; border: 1.5px solid rgba(255,255,255,0.3);
          transition: all 0.2s ease; backdrop-filter: blur(4px);
        }
        .cta-secondary:hover { border-color: white; background: rgba(255,255,255,0.07); }
        .step-circle {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: white; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59,130,246,0.35);
        }
        .nav-link { color: #93C5FD; font-size: 14px; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: white; }
        .cat-card { transition: all 0.2s ease; }
        .cat-card:hover { transform: translateY(-3px); border-color: #3B82F6 !important; background: #0F2844 !important; }
        .gold-text {
          background: linear-gradient(180deg, #F0D98A 0%, #E5C45A 35%, #BFA46F 65%, #9A7D3A 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-sub { font-size: 16px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .personas-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .cats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
          .nav-mobile-cta { display: flex !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
          .hero-ctas a { text-align: center; justify-content: center; }
          .benefits-cols { grid-template-columns: 1fr !important; }
          .final-cta-title { font-size: 30px !important; }
          .hero-stats-bar { flex-direction: column !important; gap: 12px !important; }
          .hero-stats-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; padding: 8px 0 !important; }
          .hero-stats-item:last-child { border-bottom: none !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 28px !important; }
          .cats-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main style={{ fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0B1F3B', color: 'white', overflowX: 'hidden' }}>

        {/* ── NAVBAR ── */}
        <header className="site-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'rgba(11,31,59,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontFamily: 'inherit', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: 'white' }}>SN</span>
              <span className="gold-text">Moda</span>
            </span>
          </a>

          <nav className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="/matching" className="nav-link">Fornecedores</a>
            <a href="/polos" className="nav-link">Polos Têxteis</a>
            <a href="/planos" className="nav-link">Planos</a>
            <a href="/sobre" className="nav-link">Sobre</a>
          </nav>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {user ? (
              <a href="/minha-conta" className="nav-mobile-hide" style={{ fontSize: '14px', color: 'white', textDecoration: 'none', backgroundColor: '#3B82F6', padding: '8px 18px', borderRadius: '8px', fontWeight: 600 }}>Minha conta</a>
            ) : (
              <>
                <a href="/login" className="nav-mobile-hide" style={{ fontSize: '14px', color: '#93C5FD', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>Entrar</a>
                <a href="/cadastro" className="nav-mobile-hide" style={{ fontSize: '14px', color: 'white', textDecoration: 'none', backgroundColor: '#3B82F6', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, whiteSpace: 'nowrap' }}>Cadastre grátis</a>
              </>
            )}
            <MobileNav isLoggedIn={!!user} />
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="hero-section-wrap" style={{ padding: '80px 24px 60px', textAlign: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.15) 0%, transparent 70%), #0B1F3B', minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="hero-animate" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block', boxShadow: '0 0 8px #22C55E' }}></span>
            <span style={{ fontSize: '12px', color: '#93C5FD', fontWeight: 500, letterSpacing: '0.05em' }}>
              {totalFornecedores}+ fornecedores ativos · Plataforma B2B nacional
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-animate-1 hero-title" style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.08, maxWidth: '820px', margin: '0 auto 20px', color: 'white', letterSpacing: '-1.5px' }}>
            Seu próximo cliente está aqui.<br />
            <span className="gold-text">Seu próximo fornecedor também.</span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-animate-2 hero-sub" style={{ fontSize: '18px', color: '#93C5FD', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.65 }}>
            A plataforma B2B que conecta toda a cadeia têxtil brasileira —
            da matéria-prima ao varejo. <strong style={{ color: 'white' }}>Grátis para começar.</strong>
          </p>

          {/* CTAs */}
          <div className="hero-animate-3 hero-ctas" style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '36px' }}>
            <a href="/cadastro" className="cta-primary">
              Cadastre sua empresa grátis
              <span style={{ fontSize: '18px' }}>→</span>
            </a>
            <a href="/matching" className="cta-secondary">
              Encontrar fornecedores
              <span style={{ fontSize: '18px' }}>→</span>
            </a>
          </div>

          {/* Trust line */}
          <p className="hero-animate-4" style={{ marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
            Sem cartão de crédito · Cadastro em menos de 5 minutos
          </p>

          {/* Stats bar */}
          <div className="hero-animate-4" style={{ marginTop: '64px', width: '100%', maxWidth: '720px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px 32px' }}>
              <div className="hero-stats-bar" style={{ display: 'flex', justifyContent: 'space-around', gap: '0' }}>
                {[
                  { value: `${totalFornecedores}+`, label: 'Fornecedores', sub: 'cadastrados' },
                  { value: `${totalEstados}`, label: 'Estados', sub: 'cobertos' },
                  { value: `${totalCategorias}`, label: 'Categorias', sub: 'da cadeia têxtil' },
                  { value: `${totalEspecializacoes}+`, label: 'Especializações', sub: 'disponíveis' },
                ].map((stat, i) => (
                  <div key={i} className="hero-stats-item" style={{ textAlign: 'center', flex: 1, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', padding: '0 16px' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-1px', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0', marginTop: '4px' }}>{stat.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── URGENCY STRIP ── */}
        <div style={{ backgroundColor: '#1E3A5F', borderTop: '1px solid rgba(59,130,246,0.2)', borderBottom: '1px solid rgba(59,130,246,0.2)', padding: '14px 24px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#93C5FD' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>⚡ {totalFornecedores} fornecedores</span> já estão sendo encontrados por compradores agora.{' '}
            <a href="/cadastro" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'underline' }}>Seja o próximo →</a>
          </p>
        </div>

        {/* ── PARA FORNECEDORES ── */}
        <section style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="benefits-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* Copy */}
              <div>
                <div style={{ display: 'inline-block', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '100px', marginBottom: '20px', textTransform: 'uppercase' }}>
                  Para Fornecedores
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0B1F3B', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                  Pare de vender só<br />para quem te conhece.
                </h2>
                <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                  Enquanto você depende de indicações, seus concorrentes estão sendo encontrados por compradores de todo o Brasil. Na SN Moda, sua empresa aparece para quem está buscando <strong>exatamente o que você faz</strong>.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                  {[
                    { icon: '🌎', title: 'Visibilidade nacional', desc: 'Seja encontrado por compradores de qualquer estado, sem sair de casa' },
                    { icon: '✅', title: 'Perfil que transmite credibilidade', desc: 'Dados técnicos estruturados: capacidade produtiva, MOQ, prazos, certificações' },
                    { icon: '📩', title: 'Receba cotações direto', desc: 'Compradores interessados entram em contato com você — sem intermediários' },
                    { icon: '🏆', title: 'Destaque entre os primeiros', desc: 'Quanto antes você cadastrar, maior sua vantagem competitiva na plataforma' },
                  ].map((item, i) => (
                    <div key={i} className="benefit-card" style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                      <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0B1F3B', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0B1F3B', color: 'white', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                  Cadastre sua empresa grátis →
                </a>
              </div>

              {/* Visual card */}
              <div className="supplier-visual-card" style={{ background: 'linear-gradient(135deg, #0B1F3B 0%, #1E3A5F 100%)', borderRadius: '20px', padding: '36px', color: 'white' }}>
                <div style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 600, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Perfil de fornecedor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👕</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Confecções Brasil Ltda.</div>
                    <div style={{ fontSize: '13px', color: '#93C5FD' }}>Confecção · São Paulo, SP</div>
                  </div>
                  <div style={{ marginLeft: 'auto', backgroundColor: '#22C55E', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px' }}>Verificado</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: 'Capacidade', value: '10.000 pcs/mês' },
                    { label: 'MOQ', value: '500 unidades' },
                    { label: 'Prazo médio', value: '20 dias' },
                    { label: 'Certificações', value: 'ISO 9001' },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ backgroundColor: 'rgba(59,130,246,0.15)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📩</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#60A5FA' }}>3 novas cotações esta semana</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Compradores interessados no seu perfil</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARA COMPRADORES ── */}
        <section style={{ backgroundColor: '#F1F5F9', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="benefits-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* Visual card */}
              <div className="buyer-visual-card" style={{ background: '#0B1F3B', borderRadius: '20px', padding: '36px', color: 'white', order: 0 }}>
                <div style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 600, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Busca de fornecedores
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#64748B' }}>🔍</span>
                  <span style={{ fontSize: '14px', color: '#94A3B8' }}>Tecido plano — São Paulo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Têxtil Paulista', tag: 'Tecido Plano', local: 'SP', rating: '★★★★★' },
                    { name: 'Fios do Sul Ltda.', tag: 'Fios & Fibras', local: 'SC', rating: '★★★★☆' },
                    { name: 'Malharia Centro-Oeste', tag: 'Malharia', local: 'GO', rating: '★★★★★' },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#60A5FA' }}>{item.tag} · {item.local}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#F59E0B' }}>{item.rating}</div>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ backgroundColor: '#1D4ED8', color: 'white', fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '6px' }}>Solicitar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
                  {totalFornecedores}+ fornecedores verificados disponíveis
                </div>
              </div>

              {/* Copy */}
              <div>
                <div style={{ display: 'inline-block', backgroundColor: '#F0FDF4', color: '#15803D', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '100px', marginBottom: '20px', textTransform: 'uppercase' }}>
                  Para Compradores
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0B1F3B', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                  Chega de fornecedor<br />descoberto na indicação.
                </h2>
                <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                  Encontre fornecedores verificados por categoria, estado e capacidade produtiva. Compare dados reais, solicite cotações e feche negócios — sem depender de feiras ou contatos informais.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                  {[
                    { icon: '🔍', title: 'Busca por especialização', desc: `${totalEspecializacoes}+ especializações para você encontrar o fornecedor certo para cada necessidade` },
                    { icon: '📊', title: 'Dados técnicos reais', desc: 'Capacidade produtiva, MOQ, prazos e certificações estruturados em cada perfil' },
                    { icon: '💬', title: 'Solicite cotações direto', desc: 'Entre em contato com múltiplos fornecedores e compare propostas em um só lugar' },
                    { icon: '🗺️', title: `Cobertura em ${totalEstados} estados`, desc: 'Fornecedores de todas as regiões do Brasil, incluindo os principais polos têxteis' },
                  ].map((item, i) => (
                    <div key={i} className="benefit-card" style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                      <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0B1F3B', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/matching" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0B1F3B', color: 'white', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                  Encontrar fornecedores →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section style={{ backgroundColor: '#0B1F3B', padding: '80px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '100px', marginBottom: '20px', textTransform: 'uppercase' }}>
              Como funciona
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Comece a ser encontrado<br />em menos de 5 minutos
            </h2>
            <p style={{ fontSize: '16px', color: '#93C5FD', marginBottom: '56px', lineHeight: 1.6 }}>
              Processo simples, resultado imediato. Sem burocracia.
            </p>
            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
              {[
                {
                  step: '1',
                  title: 'Cadastre sua empresa',
                  desc: 'Crie seu perfil com dados básicos da empresa. É grátis e leva menos de 5 minutos.',
                  highlight: 'Grátis para sempre',
                },
                {
                  step: '2',
                  title: 'Complete seu perfil',
                  desc: 'Adicione categorias, capacidade produtiva, localização e o que você faz de melhor.',
                  highlight: 'Mais completo = mais encontrado',
                },
                {
                  step: '3',
                  title: 'Receba contatos',
                  desc: 'Compradores de todo o Brasil encontram sua empresa e entram em contato diretamente.',
                  highlight: 'Sem intermediários',
                },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px 24px' }}>
                  <div className="step-circle" style={{ marginBottom: '20px' }}>{item.step}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>{item.desc}</p>
                  <div style={{ display: 'inline-block', backgroundColor: 'rgba(34,197,94,0.12)', color: '#4ADE80', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>
                    ✓ {item.highlight}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '48px' }}>
              <a href="/cadastro" className="cta-primary" style={{ fontSize: '16px' }}>
                Começar agora — é grátis →
              </a>
            </div>
          </div>
        </section>

        {/* ── CATEGORIAS ── */}
        <section style={{ padding: '80px 24px', backgroundColor: '#060F1E' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '100px', marginBottom: '16px', textTransform: 'uppercase' }}>
                Cadeia produtiva completa
              </div>
              <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                Da fibra ao varejo, em um só lugar
              </h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>
                {totalCategorias} categorias · {totalSubcategorias}+ subcategorias · {totalEspecializacoes}+ especializações
              </p>
            </div>
            <div className="cats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {(categorias ?? []).map((cat: { id: number; name: string }) => (
                <a key={cat.id} href={`/categoria/${cat.id}`} style={{ textDecoration: 'none' }}>
                  <div className="cat-card" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 14px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>{getCategoryIcon(cat.name)}</div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '13px', lineHeight: 1.3 }}>{cat.name}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF NUMBERS ── */}
        <section style={{ backgroundColor: '#1E3A5F', padding: '64px 24px', borderTop: '1px solid rgba(59,130,246,0.2)', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#60A5FA', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '40px', textTransform: 'uppercase' }}>
              A maior base de dados do setor têxtil brasileiro
            </p>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { value: `${totalFornecedores}+`, label: 'Fornecedores', desc: 'verificados na plataforma', color: '#60A5FA' },
                { value: `${totalEstados}`, label: 'Estados', desc: 'de presença nacional', color: '#34D399' },
                { value: `${totalSubcategorias}+`, label: 'Subcategorias', desc: 'para busca precisa', color: '#F59E0B' },
                { value: `${totalEspecializacoes}+`, label: 'Especializações', desc: 'mapeadas e estruturadas', color: '#F472B6' },
              ].map((stat, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '24px 16px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: stat.color, letterSpacing: '-1.5px', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginTop: '8px' }}>{stat.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4 }}>{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLANOS TEASER ── */}
        <section style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '100px', marginBottom: '20px', textTransform: 'uppercase' }}>
              Planos e preços
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#0B1F3B', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px' }}>
              Comece grátis. Cresça com a plataforma.
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.65 }}>
              Cadastro gratuito para todos. Empresas com planos pagos têm destaque prioritário na busca e acesso a recursos avançados.
            </p>
            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'left', marginBottom: '40px' }}>
              {PLANS.map((plan) => {
                const isFree = plan.priceMonthly === 0
                const price = isFree ? 'R$ 0' : `R$ ${plan.priceMonthly}/mês`
                const includedFeatures = plan.features.filter(f => f.included).map(f => f.text)
                const isHighlighted = !!plan.highlight
                return (
                  <div key={plan.id} style={{ borderRadius: '16px', padding: '28px 24px', border: isHighlighted ? '2px solid #3B82F6' : '1px solid #E2E8F0', backgroundColor: isHighlighted ? '#EFF6FF' : '#F8FAFC', position: 'relative' }}>
                    {isHighlighted && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3B82F6', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                        {plan.highlight}
                      </div>
                    )}
                    <div style={{ fontWeight: 800, fontSize: '18px', color: '#0B1F3B', marginBottom: '4px' }}>{plan.name}</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#3B82F6', marginBottom: '8px' }}>{price}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.5 }}>{plan.tagline}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {includedFeatures.map((f, j) => (
                        <li key={j} style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#22C55E', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
            <a href="/planos" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1D4ED8', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
              Ver todos os planos e recursos →
            </a>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: 'linear-gradient(135deg, #0B1F3B 0%, #1E3A5F 50%, #0B1F3B 100%)', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
            <h2 className="final-cta-title" style={{ fontSize: '44px', fontWeight: 800, color: 'white', maxWidth: '680px', margin: '0 auto 16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
              Não fique de fora.
            </h2>
            <p style={{ fontSize: '22px', color: '#93C5FD', maxWidth: '560px', margin: '0 auto 12px', lineHeight: 1.4, fontWeight: 500 }}>
              <span style={{ color: '#F59E0B', fontWeight: 800 }}>{totalFornecedores} fornecedores</span> já estão sendo encontrados por compradores de todo o Brasil.
            </p>
            <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '44px', maxWidth: '480px', margin: '0 auto 44px' }}>
              A rede está crescendo agora. Cada dia sem presença online é um cliente que não te encontrou.
            </p>
            <div className="hero-ctas" style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/cadastro" className="cta-primary" style={{ fontSize: '17px', padding: '18px 36px' }}>
                Cadastre sua empresa grátis →
              </a>
              <a href="/matching" className="cta-secondary" style={{ fontSize: '17px', padding: '18px 36px' }}>
                Explorar fornecedores
              </a>
            </div>
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#475569' }}>
              Sem cartão de crédito · Cancele quando quiser · Suporte em português
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="page-footer" style={{ backgroundColor: '#060F1E', padding: '56px 24px 32px', color: '#94A3B8' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
              {/* Brand */}
              <div>
                <a href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'inherit', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    <span style={{ color: 'white' }}>SN</span>
                    <span className="gold-text">Moda</span>
                  </span>
                </a>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748B', maxWidth: '280px' }}>
                  Sistema Nacional da Moda — a plataforma B2B que conecta fornecedores e compradores de toda a cadeia têxtil brasileira.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  {['Instagram', 'LinkedIn', 'WhatsApp'].map((social) => (
                    <a key={social} href="#" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '15px', color: '#94A3B8' }}>
                      {social === 'Instagram' ? '📷' : social === 'LinkedIn' ? '💼' : '💬'}
                    </a>
                  ))}
                </div>
              </div>

              {/* Plataforma */}
              <div>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Plataforma</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Fornecedores', href: '/matching' },
                    { label: 'Cadastre sua empresa', href: '/cadastro' },
                    { label: 'Polos Têxteis', href: '/polos' },
                    { label: 'Planos', href: '/planos' },
                    { label: 'Sobre', href: '/sobre' },
                  ].map((link) => (
                    <a key={link.href} href={link.href} style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Para fornecedores */}
              <div>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Para Fornecedores</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Como funciona', href: '/sobre' },
                    { label: 'Cadastro gratuito', href: '/cadastro' },
                    { label: 'Ver planos', href: '/planos' },
                    { label: 'Minha conta', href: '/minha-conta' },
                  ].map((link) => (
                    <a key={link.href} href={link.href} style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Legal</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Termos para Fornecedores', href: '/termos-fornecedor' },
                    { label: 'Termos para Clientes', href: '/termos-cliente' },
                    { label: 'Política de Privacidade', href: '/privacidade' },
                  ].map((link) => (
                    <a key={link.href} href={link.href} style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
                © 2026 Sistema Nacional da Moda. Todos os direitos reservados.
              </p>
              <p style={{ fontSize: '13px', color: '#1E293B', margin: 0 }}>
                snmoda.com.br · CNPJ em registro
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
