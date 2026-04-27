export default function Sobre() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <nav className="simple-header" style={{ backgroundColor: '#0B1F3B', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px' }}>S</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SNM</div>
            <div style={{ color: '#93C5FD', fontSize: '10px', lineHeight: 1 }}>Sistema Nacional da Moda</div>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/matching" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Buscar fornecedor</a>
          <a href="/cadastro" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Cadastrar empresa</a>
        </div>
      </nav>

      <section style={{ backgroundColor: '#0B1F3B', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#2C5282', color: '#93C5FD', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, marginBottom: '20px' }}>
          Infraestrutura de Dados da Cadeia Produtiva da Moda Brasileira
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
          Sistema Nacional da Moda
        </h1>
        <p style={{ color: '#93C5FD', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          
        </p>Uma iniciativa técnica nacional para organizar, mapear e estruturar a cadeia produtiva da moda no Brasil.
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 40px' }}>

        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '40px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '40px', backgroundColor: '#0B1F3B', borderRadius: '2px' }}></div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F3B' }}>Apresentação</h2>
          </div>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
            O setor têxtil e de confecção brasileiro é um dos mais complexos do mundo — da fibra ao varejo, são dezenas de elos interdependentes, distribuídos por todo o território nacional.
          </p>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
            No entanto, essa cadeia opera de forma fragmentada. Fornecedores invisíveis. Compradores sem referência. Dados dispersos. Conexoes que dependem de relacionamentos pessoais e feiras anuais.
          </p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#0B1F3B', lineHeight: 1.6 }}>
            O Sistema Nacional da Moda nasce para mudar isso.
          </p>
        </div>

        <div className="card-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
              🎯
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Missão</h2>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }}>
              Organizar, mapear e estruturar a cadeia produtiva da moda brasileira por meio de uma infraestrutura de dados técnica, confiável e acessível a todos os elos do setor.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
              💡
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Propósito</h2>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }}>
              Reduzir a fragmentação do setor têxtil e de confecção, ampliar a visibilidade de fornecedores, fabricantes e profissionais, e estabelecer uma base de dados industriais padronizada que sirva de referência para empresas, investidores e políticas públicas.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
              🔭
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3B', marginBottom: '12px' }}>Visão</h2>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }}>
              Tornar-se a principal infraestrutura de dados da cadeia produtiva da moda brasileira — a fonte técnica de referência nacional para quem produz, compra, investe ou regula o setor.
            </p>
          </div>

          <div style={{ backgroundColor: '#0B1F3B', border: '1px solid #0B1F3B', borderRadius: '16px', padding: '32px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#2C5282', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
              🏛️
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>O que é o SNM</h2>
            <p style={{ fontSize: '14px', color: '#93C5FD', lineHeight: 1.8 }}>
              Uma plataforma técnica nacional estruturada para mapear e conectar os agentes da cadeia produtiva da moda no Brasil — da matéria-prima ao varejo — com rigor, padronização e escala industrial.
            </p>
          </div>

        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '40px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '4px', height: '40px', backgroundColor: '#0B1F3B', borderRadius: '2px' }}></div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F3B' }}>Valores</h2>
          </div>
          <div className="card-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { icone: '📐', titulo: 'Rigor técnico', texto: 'Dados estruturados, padronizados e verificáveis, construidos com critério industrial.' },
              { icone: '👁️', titulo: 'Transparência', texto: 'Visibilidade para todos os elos da cadeia, do menor fornecedor ao grande distribuidor.' },
              { icone: '🔒', titulo: 'Independencia', texto: 'Plataforma privada e autossustentável, sem vinculação a associações, sindicatos ou grupos econômicos do setor.' },
              { icone: '📊', titulo: 'Transparência comercial', texto: 'Fornecedores com planos pagos têm mais visibilidade na plataforma, e isso é declarado abertamente. Os critérios de destaque são públicos e iguais para todos.' },
              { icone: '🗺️', titulo: 'Escala nacional', texto: 'Cobertura de todos os estados e polos produtivos do Brasil.' },
              { icone: '🤝', titulo: 'Compromisso com o setor', texto: 'Construída por e para quem produz.' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{v.icone}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3B', marginBottom: '4px' }}>{v.titulo}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{v.texto}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1F3B', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            Faça parte da infraestrutura
          </h2>
          <p style={{ color: '#93C5FD', marginBottom: '32px', fontSize: '15px' }}>
            Cadastre sua empresa e contribua para a construção do maior mapa da cadeia produtiva da moda no Brasil.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/cadastro" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
              Cadastrar minha empresa
            </a>
            <a href="/matching" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: 'transparent', color: 'white', border: '2px solid #3B82F6', borderRadius: '8px', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              Buscar fornecedores
            </a>
          </div>
        </div>

      </div>

      <footer style={{ backgroundColor: '#0F2238', padding: '24px 40px', textAlign: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '13px' }}>SNM - Sistema Nacional da Moda 2026</div>
      </footer>

    </main>
  )
}
