import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso e Contrato de Assinatura para Clientes — SNM Sistema Nacional da Moda',
  description: 'Termos de uso, condições de assinatura e política de cancelamento da plataforma SNM para compradores.',
}

export default function TermosCliente() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/clientes" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Criar conta</a>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Termos de Uso — Clientes/Compradores</h1>
        <p style={{ color: '#93C5FD', fontSize: '13px' }}>Sistema Nacional da Moda — SNM | Última atualização: janeiro de 2026</p>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
            <strong>ATENÇÃO:</strong> Ao se cadastrar ou adquirir qualquer plano no SNM, o Cliente declara ter lido,
            compreendido e aceito integralmente os presentes Termos de Uso e Contrato de Assinatura.
          </p>
        </div>

        <article style={{ fontSize: '14px', lineHeight: 1.8, color: '#1E293B' }}>

          <h2 style={h2Style}>PREÂMBULO</h2>
          <p>
            Os presentes Termos de Uso e Contrato de Assinatura ("<strong>Termos</strong>") regem o relacionamento
            entre o <strong>Sistema Nacional da Moda</strong>, plataforma digital de diretório e conexão B2B da cadeia
            produtiva têxtil brasileira, doravante denominada "<strong>SNM</strong>" ou "<strong>Plataforma</strong>",
            operada por <strong>SN Moda Tecnologia Ltda</strong>, pessoa jurídica de direito privado inscrita no CNPJ sob o n.º
            <strong>[CNPJ A SER INSERIDO]</strong>, com sede em <strong>São Paulo, SP, Brasil</strong> ("<strong>Operadora</strong>"),
            e o comprador ou tomador de serviços que realiza o cadastro na Plataforma ("<strong>Cliente</strong>").
          </p>

          <h2 style={h2Style}>CLÁUSULA 1ª — DO OBJETO</h2>
          <p>
            1.1. Os presentes Termos regulam o acesso e uso da Plataforma SNM pelo Cliente, incluindo:
          </p>
          <p style={indent}>(a) acesso ao diretório de fornecedores da cadeia têxtil e de moda brasileira;</p>
          <p style={indent}>(b) utilização do sistema de busca, filtragem e matching de fornecedores;</p>
          <p style={indent}>(c) envio de cotações e solicitações de contato a fornecedores cadastrados;</p>
          <p style={indent}>(d) acesso às funcionalidades premium conforme o plano contratado;</p>
          <p style={indent}>(e) demais serviços disponibilizados pela Operadora conforme evolução da Plataforma.</p>
          <p>
            1.2. A Plataforma atua exclusivamente como canal de conexão. A Operadora não é parte nas negociações
            comerciais entre Clientes e Fornecedores, não garantindo a conclusão de negócios, qualidade de produtos
            ou regularidade dos fornecedores.
          </p>

          <h2 style={h2Style}>CLÁUSULA 2ª — DO CADASTRO</h2>
          <p>
            2.1. O cadastro pode ser realizado por pessoa física ou jurídica com interesse legítimo na aquisição de
            produtos ou serviços da cadeia produtiva têxtil.
          </p>
          <p>
            2.2. O Cliente é responsável pela veracidade das informações fornecidas e por mantê-las atualizadas.
          </p>
          <p>
            2.3. Cada e-mail somente poderá ser utilizado em um único cadastro. O compartilhamento de credenciais
            de acesso é vedado.
          </p>

          <h2 style={h2Style}>CLÁUSULA 3ª — DOS PLANOS E BENEFÍCIOS</h2>
          <p>
            3.1. O SNM disponibiliza os seguintes planos de acesso:
          </p>

          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', margin: '16px 0' }}>
            <p style={{ fontWeight: 700, color: '#0B1F3B', marginBottom: '8px' }}>PLANO GRATUITO</p>
            <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '4px' }}>Valor: R$ 0,00/mês</p>
            <p>Inclui: acesso ao diretório de fornecedores, sistema de busca básica, envio de até 5 (cinco) cotações
            por mês, sem destaque no ranking de resultados, sem acesso a funcionalidades premium.</p>
          </div>

          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '20px', margin: '16px 0' }}>
            <p style={{ fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>PLANO BASIC <span style={{ fontWeight: 400, fontSize: '13px', color: '#64748B' }}>(em breve)</span></p>
            <p>Inclui todos os benefícios do Plano Gratuito, acrescidos de: até 25 (vinte e cinco) cotações por mês,
            acesso a filtros avançados, suporte por e-mail, destaque na exibição de resultados de busca.</p>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Preço e condições a definir no lançamento.</p>
          </div>

          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '20px', margin: '16px 0' }}>
            <p style={{ fontWeight: 700, color: '#166534', marginBottom: '8px' }}>PLANO PRO <span style={{ fontWeight: 400, fontSize: '13px', color: '#64748B' }}>(em breve)</span></p>
            <p>Inclui todos os benefícios do Plano Basic, acrescidos de: cotações ilimitadas, posição prioritária no
            matching, badge de comprador verificado, relatórios e analytics de fornecedores, suporte prioritário,
            acesso antecipado a novos fornecedores.</p>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Preço e condições a definir no lançamento.</p>
          </div>

          <p>
            3.2. A Operadora reserva-se o direito de criar novos planos, alterar os benefícios dos planos existentes
            ou descontinuar planos, mediante comunicação prévia ao Cliente com antecedência mínima de 30 (trinta) dias.
          </p>

          <h2 style={h2Style}>CLÁUSULA 4ª — DAS CONDIÇÕES DE PAGAMENTO</h2>
          <p>
            4.1. O Plano Gratuito não requer qualquer forma de pagamento.
          </p>
          <p>
            4.2. Os planos pagos (Basic e Pro), quando disponibilizados, serão cobrados de forma recorrente, na
            periodicidade contratada (mensal ou anual), pelas seguintes formas de pagamento aceitas pela Operadora:
          </p>
          <p style={indent}>(a) Cartão de crédito — com cobrança automática na data de renovação;</p>
          <p style={indent}>(b) Boleto bancário — com vencimento até 3 (três) dias úteis antes do início do período;</p>
          <p style={indent}>(c) Pix — disponível para pagamentos à vista.</p>
          <p>
            4.3. O processamento dos pagamentos é realizado por gateway de pagamento terceirizado, cujos termos
            específicos complementam as presentes disposições.
          </p>
          <p>
            4.4. Na hipótese de inadimplência, o acesso às funcionalidades do plano pago poderá ser suspenso
            automaticamente, sem prejuízo da cobrança dos valores em aberto e demais medidas legais cabíveis.
          </p>
          <p>
            4.5. Todos os preços são expressos em Reais (R$) e sujeitos a reajuste anual com base no IGPM/FGV
            ou índice substituto, com aviso prévio de 30 (trinta) dias.
          </p>

          <h2 style={h2Style}>CLÁUSULA 5ª — DA RENOVAÇÃO AUTOMÁTICA</h2>
          <p>
            5.1. Os planos pagos são renovados automaticamente ao término de cada período de vigência, pelo mesmo
            prazo contratado, salvo cancelamento expresso pelo Cliente.
          </p>
          <p>
            5.2. O Cliente será notificado por e-mail com antecedência mínima de 7 (sete) dias antes de cada renovação.
          </p>
          <p>
            5.3. Para evitar a renovação, o Cliente deverá solicitar o cancelamento até 48 (quarenta e oito) horas
            antes da data de renovação.
          </p>

          <h2 style={h2Style}>CLÁUSULA 6ª — DO UPGRADE E DOWNGRADE DE PLANOS</h2>
          <p>
            6.1. O Cliente poderá solicitar upgrade (migração para plano de maior valor) a qualquer tempo.
            O valor será proporcionalizado pro rata temporis ao período restante do plano atual.
          </p>
          <p>
            6.2. O downgrade (migração para plano de menor valor) será efetivado no início do próximo período
            de cobrança, sem reembolso do período já pago.
          </p>
          <p>
            6.3. Ao realizar upgrade ou downgrade, o Cliente aceita as condições e benefícios do novo plano.
          </p>

          <h2 style={h2Style}>CLÁUSULA 7ª — DO CANCELAMENTO E POLÍTICA DE REEMBOLSO</h2>
          <p>
            7.1. O Cliente poderá cancelar sua assinatura a qualquer tempo por meio dos canais de atendimento
            da Operadora.
          </p>
          <p>
            7.2. <strong>Direito de Arrependimento:</strong> Nos termos do art. 49 do Código de Defesa do Consumidor
            (Lei n.º 8.078/1990), o Cliente consumidor final poderá cancelar a contratação dentro de 7 (sete) dias
            corridos a partir da assinatura, com direito a reembolso integral.
          </p>
          <p>
            7.3. Para cancelamentos realizados após o prazo de 7 dias, não haverá reembolso proporcional ao período
            não utilizado, salvo nos seguintes casos: (i) indisponibilidade contínua da Plataforma por mais de 72 horas
            consecutivas por falha da Operadora; (ii) alteração substancial nos benefícios do plano sem comunicação
            prévia adequada.
          </p>
          <p>
            7.4. O reembolso, quando devido, será realizado no mesmo meio de pagamento utilizado na contratação,
            no prazo de até 10 (dez) dias úteis após a confirmação do cancelamento.
          </p>
          <p>
            7.5. O cancelamento não exime o Cliente de obrigações anteriormente contraídas.
          </p>

          <h2 style={h2Style}>CLÁUSULA 8ª — DO PERÍODO DE TESTE</h2>
          <p>
            8.1. A Operadora poderá, a seu exclusivo critério, oferecer período de teste gratuito de planos pagos.
            As condições específicas de cada período de teste serão informadas no momento da oferta.
          </p>
          <p>
            8.2. Ao término do período de teste, caso o Cliente não cancele, a assinatura será automaticamente
            convertida no plano correspondente, com início da cobrança conforme as condições apresentadas na
            contratação.
          </p>

          <h2 style={h2Style}>CLÁUSULA 9ª — DO NÍVEL DE SERVIÇO (SLA)</h2>
          <p>
            9.1. A Operadora envidará esforços para manter a Plataforma disponível 24 (vinte e quatro) horas por dia,
            7 (sete) dias por semana, com meta de disponibilidade de 99% ao mês, excluídas janelas de manutenção
            programada.
          </p>
          <p>
            9.2. Manutenções programadas serão comunicadas com antecedência mínima de 24 horas por e-mail e/ou
            aviso na Plataforma.
          </p>
          <p>
            9.3. Em caso de indisponibilidade não programada superior a 4 horas consecutivas, o Cliente poderá
            solicitar crédito proporcional ao período afetado, mediante abertura de chamado no prazo de 5 dias úteis
            após a ocorrência.
          </p>
          <p>
            9.4. O prazo de resposta do suporte varia conforme o plano contratado: Gratuito — 5 dias úteis;
            Basic — 48 horas úteis; Pro — 8 horas úteis.
          </p>

          <h2 style={h2Style}>CLÁUSULA 10ª — DAS OBRIGAÇÕES DO CLIENTE</h2>
          <p>10.1. O Cliente se compromete a:</p>
          <p style={indent}>(a) utilizar a Plataforma exclusivamente para fins lícitos e em conformidade com a legislação vigente;</p>
          <p style={indent}>(b) não utilizar a Plataforma para assediar, intimidar ou prejudicar fornecedores;</p>
          <p style={indent}>(c) não realizar scraping, extração automatizada ou reprodução não autorizada do conteúdo do diretório;</p>
          <p style={indent}>(d) manter sigilo das credenciais de acesso e notificar imediatamente o SNM em caso de comprometimento;</p>
          <p style={indent}>(e) não repassar informações de fornecedores a terceiros com fins comerciais sem autorização.</p>

          <h2 style={h2Style}>CLÁUSULA 11ª — DA PROTEÇÃO DE DADOS E LGPD</h2>
          <p>
            11.1. O tratamento dos dados pessoais do Cliente observa estritamente a Lei Geral de Proteção de Dados
            (Lei n.º 13.709/2018 — LGPD) e demais normas aplicáveis.
          </p>
          <p>
            11.2. <strong>Dados coletados:</strong> nome, e-mail, telefone, dados empresariais (CNPJ, razão social),
            localização, segmento de interesse, dados de pagamento (processados pelo gateway, não armazenados
            diretamente pela Operadora), logs de acesso e comportamento de navegação.
          </p>
          <p>
            11.3. <strong>Finalidades:</strong> prestação dos serviços contratados, comunicações transacionais,
            processamento de pagamentos, personalização da experiência, melhorias na Plataforma e cumprimento
            de obrigações legais.
          </p>
          <p>
            11.4. <strong>Bases legais:</strong> execução de contrato (art. 7º, V), cumprimento de obrigação legal
            (art. 7º, II), legítimo interesse (art. 7º, IX) e consentimento (art. 7º, I), conforme a finalidade.
          </p>
          <p>
            11.5. <strong>Compartilhamento:</strong> dados poderão ser compartilhados com fornecedores para fins
            de negociação, com gateway de pagamento e provedores de serviços (sob sigilo), e com autoridades
            públicas quando legalmente exigido.
          </p>
          <p>
            11.6. O Cliente poderá exercer seus direitos de titular de dados (acesso, correção, exclusão, portabilidade,
            revogação de consentimento) pelo e-mail <strong>privacidade@snmoda.com.br</strong>.
          </p>
          <p>
            11.7. Maiores informações constam da <a href="/privacidade" style={{ color: '#3B82F6' }}>Política de Privacidade</a>,
            que integra os presentes Termos por referência.
          </p>

          <h2 style={h2Style}>CLÁUSULA 12ª — DAS RESPONSABILIDADES E LIMITAÇÕES</h2>
          <p>
            12.1. A Operadora não se responsabiliza por danos decorrentes de: falhas ou interrupções da Plataforma
            por motivo de força maior; atos de Fornecedores ou terceiros; decisões comerciais do Cliente baseadas
            em informações do diretório.
          </p>
          <p>
            12.2. A responsabilidade máxima da Operadora perante o Cliente limita-se ao valor pago nos últimos
            12 meses de assinatura.
          </p>

          <h2 style={h2Style}>CLÁUSULA 13ª — DA VIGÊNCIA E RESCISÃO</h2>
          <p>
            13.1. Os Termos vigoram por prazo indeterminado, a partir do cadastro.
          </p>
          <p>
            13.2. Qualquer das partes poderá rescindir o contrato: o Cliente, a qualquer tempo, mediante solicitação
            de cancelamento; a Operadora, em caso de descumprimento grave, com aviso prévio de 7 dias (exceto
            nos casos de violação legal ou fraude, em que a rescisão pode ser imediata).
          </p>

          <h2 style={h2Style}>CLÁUSULA 14ª — DA ALTERAÇÃO DOS TERMOS</h2>
          <p>
            14.1. A Operadora poderá alterar os Termos, comunicando o Cliente com antecedência mínima de 15 dias
            por e-mail e/ou aviso na Plataforma.
          </p>
          <p>
            14.2. O uso continuado após a vigência das alterações constitui aceite. O Cliente que não concordar
            poderá cancelar sua conta antes da data de vigência.
          </p>

          <h2 style={h2Style}>CLÁUSULA 15ª — DO FORO E LEGISLAÇÃO APLICÁVEL</h2>
          <p>
            15.1. Os presentes Termos são regidos pelas leis da República Federativa do Brasil, em especial o
            Código de Defesa do Consumidor (Lei n.º 8.078/1990), o Marco Civil da Internet (Lei n.º 12.965/2014)
            e a LGPD (Lei n.º 13.709/2018).
          </p>
          <p>
            15.2. Fica eleito o foro da Comarca de <strong>São Paulo</strong>, Estado de <strong>São Paulo</strong>,
            para dirimir quaisquer controvérsias decorrentes dos presentes Termos, ressalvados os casos em que
            a legislação consumerista estabeleça foro privilegiado ao consumidor.
          </p>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', fontSize: '13px', color: '#64748B' }}>
            <p><strong>Sistema Nacional da Moda — SNM</strong></p>
            <p>CNPJ: [CNPJ A SER INSERIDO] | Endereço: São Paulo, SP, Brasil</p>
            <p>E-mail para contato e DPO: privacidade@snmoda.com.br</p>
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
