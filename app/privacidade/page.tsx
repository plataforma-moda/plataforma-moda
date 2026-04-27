import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — SNM Sistema Nacional da Moda',
  description: 'Como o SNM coleta, usa e protege seus dados pessoais em conformidade com a LGPD.',
}

export default function Privacidade() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Voltar ao início</a>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Política de Privacidade</h1>
        <p style={{ color: '#93C5FD', fontSize: '13px' }}>Sistema Nacional da Moda — SNM | Última atualização: janeiro de 2026</p>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.6 }}>
            O SNM tem compromisso com a transparência e a proteção dos seus dados pessoais. Esta Política descreve
            como tratamos suas informações em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei n.º 13.709/2018 — LGPD)</strong>.
          </p>
        </div>

        <article style={{ fontSize: '14px', lineHeight: 1.8, color: '#1E293B' }}>

          <h2 style={h2Style}>1. QUEM SOMOS</h2>
          <p>
            O <strong>Sistema Nacional da Moda (SNM)</strong>, acessado em <strong>snmoda.com.br</strong>, é operado por
            <strong> SN Moda Tecnologia Ltda</strong>, pessoa jurídica de direito privado, CNPJ n.º <strong>[CNPJ A SER INSERIDO]</strong>,
            com sede em <strong>São Paulo, SP, Brasil</strong>, doravante denominada "<strong>Operadora</strong>" ou "<strong>SNM</strong>".
          </p>
          <p>
            A Operadora atua como <strong>Controladora de Dados</strong> nos termos da LGPD, sendo responsável pelas
            decisões sobre o tratamento dos dados pessoais coletados por meio da Plataforma.
          </p>

          <h2 style={h2Style}>2. DADOS QUE COLETAMOS</h2>

          <p><strong>2.1 Dados fornecidos diretamente por você</strong></p>
          <p>Ao se cadastrar ou utilizar o SNM, você nos fornece:</p>
          <p style={indent}>(a) <strong>Dados pessoais:</strong> nome completo, endereço de e-mail, telefone, WhatsApp;</p>
          <p style={indent}>(b) <strong>Dados empresariais:</strong> razão social, nome fantasia, CNPJ, endereço completo, estado, cidade, bairro, CEP;</p>
          <p style={indent}>(c) <strong>Dados operacionais (fornecedores):</strong> categoria de atuação, capacidade produtiva, MOQ, prazo médio, certificações, descrição da empresa;</p>
          <p style={indent}>(d) <strong>Dados de interesse (compradores):</strong> segmento de interesse, preferências de fornecimento;</p>
          <p style={indent}>(e) <strong>Dados de pagamento:</strong> informações para processamento de assinaturas, tratados diretamente pelo gateway de pagamento parceiro (não armazenamos dados de cartão de crédito completos).</p>

          <p><strong>2.2 Dados coletados automaticamente</strong></p>
          <p>Ao acessar a Plataforma, coletamos automaticamente:</p>
          <p style={indent}>(a) <strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência, cliques, pesquisas realizadas;</p>
          <p style={indent}>(b) <strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador, sistema operacional, idioma, resolução de tela;</p>
          <p style={indent}>(c) <strong>Logs de acesso:</strong> data e hora de login, ações realizadas na conta, registros de alterações;</p>
          <p style={indent}>(d) <strong>Cookies e tecnologias similares:</strong> conforme descrito na Seção 8 desta Política.</p>

          <p><strong>2.3 Dados de terceiros</strong></p>
          <p>
            Podemos obter dados de fontes públicas como a Receita Federal (consulta de CNPJ) e o ViaCEP
            (consulta de endereço por CEP), exclusivamente para facilitar o preenchimento do cadastro.
          </p>

          <h2 style={h2Style}>3. PARA QUÊ USAMOS SEUS DADOS</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E2E8F0', fontWeight: 600 }}>Finalidade</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E2E8F0', fontWeight: 600 }}>Base Legal (LGPD)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Criar e gerenciar seu cadastro na Plataforma', 'Execução de contrato (art. 7º, V)'],
                ['Exibir o perfil do fornecedor para compradores', 'Execução de contrato (art. 7º, V)'],
                ['Encaminhar cotações entre compradores e fornecedores', 'Execução de contrato (art. 7º, V)'],
                ['Processar pagamentos de assinaturas', 'Execução de contrato (art. 7º, V)'],
                ['Enviar comunicações transacionais (confirmações, alertas)', 'Execução de contrato (art. 7º, V)'],
                ['Cumprir obrigações legais e regulatórias', 'Cumprimento de obrigação legal (art. 7º, II)'],
                ['Prevenir fraudes e garantir segurança', 'Legítimo interesse (art. 7º, IX)'],
                ['Melhorar e personalizar a experiência na Plataforma', 'Legítimo interesse (art. 7º, IX)'],
                ['Enviar comunicações de marketing e novidades', 'Consentimento (art. 7º, I)'],
                ['Análises estatísticas e de uso (de forma agregada/anonimizada)', 'Legítimo interesse (art. 7º, IX)'],
                ['Exercer direitos em processos judiciais/administrativos', 'Exercício regular de direitos (art. 7º, VI)'],
              ].map(([finalidade, base], i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                  <td style={{ padding: '8px 12px', border: '1px solid #E2E8F0' }}>{finalidade}</td>
                  <td style={{ padding: '8px 12px', border: '1px solid #E2E8F0', color: '#4B5563' }}>{base}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={h2Style}>4. COMPARTILHAMENTO DE DADOS</h2>
          <p>Seus dados poderão ser compartilhados com:</p>
          <p>
            <strong>4.1 Usuários da Plataforma:</strong> Fornecedores têm seus dados de contato e perfil empresarial
            visíveis para compradores cadastrados. Compradores têm seus dados de contato compartilhados com
            fornecedores ao enviar cotações, limitado ao necessário para viabilizar a negociação.
          </p>
          <p>
            <strong>4.2 Prestadores de serviço (suboperadores):</strong> Compartilhamos dados com fornecedores de
            tecnologia que nos ajudam a operar a Plataforma, incluindo:
          </p>
          <p style={indent}>• <strong>Supabase:</strong> infraestrutura de banco de dados e autenticação;</p>
          <p style={indent}>• <strong>Vercel:</strong> hospedagem e entrega de conteúdo;</p>
          <p style={indent}>• <strong>Gateway de pagamento Mercado Pago:</strong> processamento de transações financeiras;</p>
          <p style={indent}>• <strong>Ferramentas de analytics:</strong> análise de comportamento de uso (dados agregados/anonimizados quando possível).</p>
          <p>
            Todos os suboperadores são contratualmente obrigados a tratar os dados exclusivamente para as finalidades
            autorizadas, com garantias de confidencialidade e segurança compatíveis com a LGPD.
          </p>
          <p>
            <strong>4.3 Autoridades públicas:</strong> Poderemos compartilhar dados com autoridades governamentais,
            judiciais ou regulatórias quando exigido por lei, ordem judicial ou processo administrativo legítimo.
          </p>
          <p>
            <strong>4.4 Transferência internacional:</strong> Alguns prestadores de serviço (como Supabase e Vercel)
            podem processar dados em servidores fora do Brasil. Nesses casos, adotamos mecanismos adequados para
            garantir nível de proteção equivalente ao exigido pela LGPD, incluindo cláusulas contratuais específicas.
          </p>
          <p>
            <strong>Não vendemos, alugamos ou comercializamos seus dados pessoais a terceiros.</strong>
          </p>

          <h2 style={h2Style}>5. RETENÇÃO E EXCLUSÃO DE DADOS</h2>
          <p>
            5.1. Mantemos seus dados pelo tempo necessário para cumprir as finalidades para as quais foram coletados
            e atender às obrigações legais e regulatórias aplicáveis.
          </p>
          <p>5.2. Os prazos de retenção são:</p>
          <p style={indent}>
            • <strong>Dados de cadastro:</strong> durante todo o período de atividade da conta e por pelo menos 5 (cinco)
            anos após o encerramento, para fins de comprovação de relação contratual;
          </p>
          <p style={indent}>
            • <strong>Dados de pagamento e transações:</strong> 10 (dez) anos, conforme exigência do Código Tributário Nacional;
          </p>
          <p style={indent}>
            • <strong>Logs de acesso:</strong> 6 (seis) meses, conforme o Marco Civil da Internet (Lei n.º 12.965/2014);
          </p>
          <p style={indent}>
            • <strong>Registros de aceite de termos:</strong> indefinidamente, para fins probatórios;
          </p>
          <p style={indent}>
            • <strong>Dados de navegação e cookies:</strong> conforme prazo de cada tipo de cookie (vide Seção 8).
          </p>
          <p>
            5.3. Após o término do prazo de retenção, os dados são excluídos de forma segura ou anonimizados,
            quando a exclusão não for tecnicamente viável de imediato.
          </p>

          <h2 style={h2Style}>6. SEUS DIREITOS COMO TITULAR</h2>
          <p>
            Nos termos dos arts. 18 e 19 da LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <p style={indent}><strong>Confirmação e Acesso:</strong> confirmar se tratamos seus dados e obter cópia das informações que mantemos sobre você;</p>
          <p style={indent}><strong>Correção:</strong> solicitar a atualização ou correção de dados incompletos, inexatos ou desatualizados;</p>
          <p style={indent}><strong>Anonimização, Bloqueio ou Eliminação:</strong> de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD;</p>
          <p style={indent}><strong>Portabilidade:</strong> receber seus dados em formato estruturado para transferência a outro fornecedor de serviço;</p>
          <p style={indent}><strong>Eliminação:</strong> exclusão dos dados tratados com base no consentimento, quando aplicável;</p>
          <p style={indent}><strong>Informação:</strong> sobre as entidades com as quais compartilhamos seus dados;</p>
          <p style={indent}><strong>Revogação de Consentimento:</strong> retirar consentimento dado para tratamentos baseados nessa base legal;</p>
          <p style={indent}><strong>Oposição:</strong> opor-se a tratamentos realizados com base em outras bases legais, se em desconformidade com a LGPD;</p>
          <p style={indent}><strong>Revisão de Decisões Automatizadas:</strong> solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado de dados.</p>
          <p>
            Para exercer seus direitos, acesse <strong>sua conta em snmoda.com.br/minha-conta</strong> ou envie solicitação
            ao nosso Encarregado de Dados pelo e-mail <strong>privacidade@snmoda.com.br</strong>. Responderemos no prazo de
            15 (quinze) dias úteis.
          </p>

          <h2 style={h2Style}>7. SEGURANÇA DOS DADOS</h2>
          <p>
            7.1. Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
            destruição, perda, alteração ou divulgação indevida, incluindo:
          </p>
          <p style={indent}>• criptografia de dados em trânsito (TLS/HTTPS) e em repouso;</p>
          <p style={indent}>• controle de acesso baseado em funções (Row Level Security no banco de dados);</p>
          <p style={indent}>• autenticação robusta (Supabase Auth);</p>
          <p style={indent}>• monitoramento contínuo de segurança e logs de acesso;</p>
          <p style={indent}>• backups regulares com retenção segura.</p>
          <p>
            7.2. Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares,
            comunicaremos a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados no prazo
            previsto pela LGPD.
          </p>

          <h2 style={h2Style}>8. COOKIES E TECNOLOGIAS DE RASTREAMENTO</h2>
          <p>
            8.1. Utilizamos cookies e tecnologias similares para melhorar sua experiência na Plataforma.
          </p>
          <p><strong>Tipos de cookies utilizados:</strong></p>
          <p style={indent}>
            <strong>Essenciais (Sessão):</strong> necessários para o funcionamento da Plataforma (autenticação,
            segurança, preferências de sessão). Não podem ser desativados. Expiram ao encerrar o navegador
            ou após tempo de inatividade configurado.
          </p>
          <p style={indent}>
            <strong>Funcionais:</strong> memorizam preferências como idioma e configurações. Expiram em até 1 (um) ano.
          </p>
          <p style={indent}>
            <strong>Analíticos:</strong> coletam informações sobre como os usuários utilizam a Plataforma,
            auxiliando na melhoria dos serviços. Os dados são, sempre que possível, coletados de forma agregada.
            Expiram em até 2 (dois) anos.
          </p>
          <p>
            8.2. Você pode gerenciar as preferências de cookies nas configurações do seu navegador. A desativação
            de cookies essenciais poderá prejudicar o funcionamento da Plataforma.
          </p>

          <h2 style={h2Style}>9. ENCARREGADO DE DADOS (DPO)</h2>
          <p>
            Em conformidade com o art. 41 da LGPD, designamos um Encarregado de Proteção de Dados (Data Protection
            Officer — DPO), responsável por:
          </p>
          <p style={indent}>• aceitar reclamações e comunicações dos titulares de dados;</p>
          <p style={indent}>• prestar esclarecimentos e adotar providências;</p>
          <p style={indent}>• interagir com a Autoridade Nacional de Proteção de Dados (ANPD).</p>
          <p>
            <strong>Encarregado de Dados:</strong> Equipe de Privacidade SN Moda<br />
            <strong>E-mail:</strong> privacidade@snmoda.com.br<br />
            <strong>Endereço:</strong> São Paulo, SP, Brasil
          </p>

          <h2 style={h2Style}>10. ALTERAÇÕES NESTA POLÍTICA</h2>
          <p>
            10.1. Podemos atualizar esta Política periodicamente. Mudanças significativas serão comunicadas
            por e-mail e/ou aviso em destaque na Plataforma com antecedência mínima de 15 (quinze) dias.
          </p>
          <p>
            10.2. A versão vigente sempre estará disponível em <strong>snmoda.com.br/privacidade</strong>.
          </p>

          <h2 style={h2Style}>11. COMO ENTRAR EM CONTATO</h2>
          <p>
            Para dúvidas, solicitações ou exercício de direitos relacionados a esta Política, utilize os canais:
          </p>
          <p style={indent}>• <strong>E-mail do DPO:</strong> privacidade@snmoda.com.br</p>
          <p style={indent}>• <strong>E-mail geral:</strong> contato@snmoda.com.br</p>
          <p style={indent}>• <strong>Endereço:</strong> São Paulo, SP, Brasil</p>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', fontSize: '13px', color: '#64748B' }}>
            <p><strong>Sistema Nacional da Moda — SNM</strong></p>
            <p>CNPJ: [CNPJ A SER INSERIDO] | Endereço: São Paulo, SP, Brasil</p>
            <p>Versão: 1.0 | Vigência: a partir de janeiro de 2026</p>
          </div>

        </article>
      </div>

      <footer style={{ backgroundColor: '#060F1E', padding: '32px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>Sistema Nacional da Moda — SNM</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href="/termos-fornecedor" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Fornecedor</a>
          <a href="/termos-cliente" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Termos Cliente</a>
          <a href="/privacidade" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>Política de Privacidade</a>
        </div>
      </footer>

    </main>
  )
}

const h2Style: React.CSSProperties = {
  fontSize: '15px', fontWeight: 700, color: '#0B1F3B',
  marginTop: '32px', marginBottom: '12px',
  paddingBottom: '8px', borderBottom: '1px solid #E2E8F0',
}

const indent: React.CSSProperties = {
  paddingLeft: '24px', marginBottom: '8px',
}
