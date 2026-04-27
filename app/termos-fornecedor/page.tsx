import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso para Fornecedores — SNM Sistema Nacional da Moda',
  description: 'Termos e condições de uso da plataforma SNM para fornecedores da cadeia têxtil brasileira.',
}

export default function TermosFornecedor() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>

      <header className="simple-header" style={{ borderBottom: '1px solid #1a3a5c', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1F3B' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'white', textDecoration: 'none' }}>SNM</a>
        <a href="/cadastro" style={{ color: '#93C5FD', fontSize: '13px', textDecoration: 'none' }}>Cadastrar empresa</a>
      </header>

      <section style={{ backgroundColor: '#0B1F3B', padding: '32px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Termos de Uso — Fornecedores</h1>
        <p style={{ color: '#93C5FD', fontSize: '13px' }}>Sistema Nacional da Moda — SNM | Última atualização: janeiro de 2026</p>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
            <strong>ATENÇÃO:</strong> Ao realizar o cadastro no SNM, o Fornecedor declara ter lido, compreendido e aceito integralmente os presentes Termos de Uso.
            O aceite é condição essencial para a utilização da Plataforma.
          </p>
        </div>

        <article style={{ fontSize: '14px', lineHeight: 1.8, color: '#1E293B' }}>

          <h2 style={h2Style}>PREÂMBULO</h2>
          <p>
            Os presentes Termos de Uso ("<strong>Termos</strong>") regem o relacionamento entre o <strong>Sistema Nacional da Moda</strong>,
            plataforma digital de diretório e conexão B2B da cadeia produtiva têxtil brasileira, doravante denominada
            simplesmente "<strong>SNM</strong>" ou "<strong>Plataforma</strong>", operada por <strong>SN Moda Tecnologia Ltda</strong>, pessoa jurídica
            de direito privado inscrita no CNPJ sob o n.º <strong>[CNPJ A SER INSERIDO]</strong>, com sede em <strong>São Paulo, SP, Brasil</strong>
            ("<strong>Operadora</strong>"), e o fornecedor que realiza o cadastro na Plataforma ("<strong>Fornecedor</strong>").
          </p>
          <p>
            O SNM é acessado pelo endereço eletrônico <strong>snmoda.com.br</strong> e tem por finalidade conectar fornecedores
            e compradores da cadeia têxtil e de moda brasileira, disponibilizando um diretório digital de empresas, produtos,
            serviços e capacidade produtiva.
          </p>

          <h2 style={h2Style}>CLÁUSULA 1ª — DO OBJETO</h2>
          <p>
            1.1. Os presentes Termos têm por objeto regular o acesso e a utilização da Plataforma SNM pelo Fornecedor,
            compreendendo os seguintes serviços:
          </p>
          <p style={indent}>
            (a) disponibilização de perfil empresarial no diretório digital do SNM, funcionando como vitrine eletrônica
            para compradores cadastrados na Plataforma;
          </p>
          <p style={indent}>
            (b) recebimento de cotações e solicitações de contato originadas de compradores;
          </p>
          <p style={indent}>
            (c) inclusão no sistema de busca e filtragem do SNM, com exibição conforme o plano contratado;
          </p>
          <p style={indent}>
            (d) acesso às demais funcionalidades disponibilizadas pela Operadora, conforme o plano de serviço ativo.
          </p>
          <p>
            1.2. A Plataforma não atua como intermediadora de negócios, não celebra contratos em nome do Fornecedor,
            não garante a concretização de negócios e não se responsabiliza pelo resultado das transações comerciais
            realizadas entre Fornecedores e Compradores.
          </p>

          <h2 style={h2Style}>CLÁUSULA 2ª — DO CADASTRO E ELEGIBILIDADE</h2>
          <p>
            2.1. Para utilizar a Plataforma, o Fornecedor deverá ser pessoa jurídica regularmente constituída, com
            CNPJ ativo perante a Receita Federal do Brasil.
          </p>
          <p>
            2.2. O cadastro poderá ser realizado pelo representante legal da empresa ou por preposto devidamente
            autorizado. Ao concluir o cadastro, a pessoa física responsável pelo preenchimento declara ter poderes para
            tanto.
          </p>
          <p>
            2.3. O Fornecedor reconhece que cada CNPJ somente poderá ser cadastrado uma única vez na Plataforma.
          </p>
          <p>
            2.4. Constatado que informações falsas, incompletas ou desatualizadas foram fornecidas no cadastro,
            a Operadora poderá suspender ou encerrar o perfil do Fornecedor sem aviso prévio, sem prejuízo das
            demais medidas legais cabíveis.
          </p>

          <h2 style={h2Style}>CLÁUSULA 3ª — DAS OBRIGAÇÕES DO FORNECEDOR</h2>
          <p>3.1. O Fornecedor se compromete a:</p>
          <p style={indent}>
            (a) fornecer informações verdadeiras, precisas, atualizadas e completas sobre sua empresa, produtos e
            serviços, mantendo-as permanentemente atualizadas;
          </p>
          <p style={indent}>
            (b) não inserir informações enganosas, fraudulentas, que induzam o consumidor a erro ou que violem
            direitos de terceiros;
          </p>
          <p style={indent}>
            (c) manter sigilo das credenciais de acesso à Plataforma, sendo o único responsável por qualquer atividade
            realizada com sua conta;
          </p>
          <p style={indent}>
            (d) comunicar imediatamente a Operadora qualquer uso não autorizado de sua conta ou violação de segurança;
          </p>
          <p style={indent}>
            (e) utilizar a Plataforma exclusivamente para fins lícitos, em conformidade com a legislação brasileira vigente
            e com as boas práticas comerciais;
          </p>
          <p style={indent}>
            (f) não utilizar a Plataforma para enviar comunicações não solicitadas (spam), vírus, malware ou qualquer
            conteúdo ilícito;
          </p>
          <p style={indent}>
            (g) não tentar acessar dados de outros usuários, contornar medidas de segurança ou realizar engenharia reversa
            nos sistemas da Plataforma;
          </p>
          <p style={indent}>
            (h) respeitar os direitos de propriedade intelectual da Operadora e de terceiros;
          </p>
          <p style={indent}>
            (i) cumprir todas as obrigações trabalhistas, previdenciárias, tributárias e ambientais pertinentes à sua
            atividade empresarial.
          </p>
          <p>
            3.2. O Fornecedor é o único e exclusivo responsável pelo conteúdo inserido em seu perfil, incluindo textos,
            imagens, vídeos, dados técnicos e quaisquer outras informações.
          </p>

          <h2 style={h2Style}>CLÁUSULA 4ª — DAS OBRIGAÇÕES DA OPERADORA</h2>
          <p>4.1. A Operadora se compromete a:</p>
          <p style={indent}>
            (a) disponibilizar a Plataforma com razoável estabilidade e continuidade, envidando esforços para minimizar
            interrupções no serviço;
          </p>
          <p style={indent}>
            (b) manter o perfil do Fornecedor visível para compradores cadastrados, conforme o plano contratado;
          </p>
          <p style={indent}>
            (c) encaminhar ao Fornecedor as cotações e solicitações de contato recebidas de compradores;
          </p>
          <p style={indent}>
            (d) adotar medidas técnicas e administrativas razoáveis para proteger os dados do Fornecedor contra acesso
            não autorizado, destruição ou alteração indevida, em conformidade com a Lei Geral de Proteção de Dados
            (Lei n.º 13.709/2018 — LGPD);
          </p>
          <p style={indent}>
            (e) prestar suporte ao Fornecedor nos canais disponíveis, dentro dos prazos e limites de cada plano;
          </p>
          <p style={indent}>
            (f) comunicar ao Fornecedor, com antecedência razoável, alterações relevantes nos Termos ou na Plataforma.
          </p>
          <p>
            4.2. A Operadora não garante resultados comerciais específicos decorrentes do uso da Plataforma, incluindo,
            mas não se limitando a, volume de contatos, número de cotações recebidas ou conclusão de negócios.
          </p>

          <h2 style={h2Style}>CLÁUSULA 5ª — DA PROPRIEDADE INTELECTUAL</h2>
          <p>
            5.1. A Operadora é titular ou licenciada de todos os direitos de propriedade intelectual relativos à
            Plataforma SNM, incluindo sua marca, logotipo, software, design, base de dados, algoritmos e demais elementos.
          </p>
          <p>
            5.2. O cadastro na Plataforma não confere ao Fornecedor qualquer direito sobre a propriedade intelectual
            da Operadora, sendo vedada a reprodução, distribuição, modificação ou uso comercial sem autorização prévia
            e expressa da Operadora.
          </p>
          <p>
            5.3. Ao inserir conteúdo na Plataforma (textos, imagens, logotipos, informações empresariais), o Fornecedor
            concede à Operadora licença não exclusiva, gratuita, irrevogável durante a vigência do cadastro, para
            exibir, indexar, reproduzir e distribuir tal conteúdo na Plataforma e em seus materiais de divulgação,
            com o único propósito de prestar os serviços contratados.
          </p>
          <p>
            5.4. O Fornecedor declara que detém todos os direitos necessários sobre o conteúdo inserido, incluindo
            direitos sobre marcas, imagens de produtos e textos, e que tal conteúdo não viola direitos de terceiros.
          </p>
          <p>
            5.5. A licença mencionada no item 5.3 será automaticamente revogada mediante o cancelamento ou exclusão
            do perfil do Fornecedor.
          </p>

          <h2 style={h2Style}>CLÁUSULA 6ª — DA PROTEÇÃO DE DADOS E LGPD</h2>
          <p>
            6.1. A Operadora trata os dados pessoais e empresariais do Fornecedor em estrita observância à Lei Geral
            de Proteção de Dados (Lei n.º 13.709/2018 — LGPD) e demais normas aplicáveis.
          </p>
          <p>
            6.2. <strong>Dados coletados:</strong> A Operadora coleta os dados fornecidos no formulário de cadastro
            (razão social, CNPJ, nome fantasia, endereço, dados de contato, informações operacionais), dados de acesso
            (logs, IP, dispositivo, navegador) e dados de utilização da Plataforma.
          </p>
          <p>
            6.3. <strong>Finalidades do tratamento:</strong> Os dados são tratados para: (i) viabilizar o cadastro
            e a exibição do perfil na Plataforma; (ii) encaminhar cotações e contatos de compradores; (iii) comunicar
            atualizações, melhorias e novidades da Plataforma; (iv) cumprir obrigações legais; (v) exercer direitos
            em processos judiciais ou administrativos; (vi) melhorar os serviços e personalizar a experiência.
          </p>
          <p>
            6.4. <strong>Bases legais:</strong> O tratamento de dados se funda nas seguintes bases legais previstas
            na LGPD: execução de contrato (art. 7º, V), cumprimento de obrigação legal (art. 7º, II), legítimo interesse
            (art. 7º, IX) e consentimento (art. 7º, I), conforme a finalidade específica de cada tratamento.
          </p>
          <p>
            6.5. <strong>Compartilhamento:</strong> Os dados do Fornecedor poderão ser compartilhados com: (i) compradores
            cadastrados na Plataforma, para fins de negociação; (ii) prestadores de serviço da Operadora (hospedagem,
            e-mail, analytics), sob obrigação de confidencialidade; (iii) autoridades públicas, quando exigido por lei.
          </p>
          <p>
            6.6. <strong>Retenção:</strong> Os dados são mantidos enquanto o cadastro estiver ativo e pelo prazo
            necessário ao cumprimento das obrigações legais, mínimo de 5 (cinco) anos após o encerramento, salvo
            prazo maior previsto em lei.
          </p>
          <p>
            6.7. <strong>Direitos do Titular:</strong> O Fornecedor, na condição de titular de dados pessoais, poderá
            exercer os seguintes direitos perante a Operadora: confirmação de tratamento, acesso, correção, anonimização
            ou exclusão de dados desnecessários, portabilidade, informação sobre compartilhamento, revogação de
            consentimento e oposição ao tratamento.
          </p>
          <p>
            6.8. Para exercer seus direitos, o Fornecedor deverá encaminhar solicitação ao Encarregado de Dados (DPO)
            pelo e-mail <strong>privacidade@snmoda.com.br</strong>. A Operadora responderá no prazo de 15 (quinze) dias úteis.
          </p>
          <p>
            6.9. Informações detalhadas sobre o tratamento de dados constam da <a href="/privacidade" style={{ color: '#3B82F6' }}>Política de Privacidade</a> do SNM,
            que integra os presentes Termos por referência.
          </p>

          <h2 style={h2Style}>CLÁUSULA 7ª — DAS RESPONSABILIDADES E LIMITAÇÕES</h2>
          <p>
            7.1. A Operadora não se responsabiliza por:
          </p>
          <p style={indent}>
            (a) danos diretos ou indiretos decorrentes de falhas, interrupções temporárias ou indisponibilidade
            da Plataforma por motivos alheios ao seu controle, incluindo falhas de internet, força maior ou caso fortuito;
          </p>
          <p style={indent}>
            (b) atos praticados por Compradores ou por terceiros na Plataforma;
          </p>
          <p style={indent}>
            (c) veracidade, qualidade ou adequação das informações inseridas pelo Fornecedor em seu próprio perfil;
          </p>
          <p style={indent}>
            (d) danos decorrentes do uso inadequado das credenciais de acesso pelo Fornecedor ou por terceiros
            a quem o Fornecedor as tenha fornecido;
          </p>
          <p style={indent}>
            (e) resultado de negociações comerciais entre Fornecedor e Compradores.
          </p>
          <p>
            7.2. Em nenhuma hipótese a responsabilidade da Operadora por danos decorrentes do uso da Plataforma
            excederá o valor total pago pelo Fornecedor nos últimos 12 (doze) meses a título de assinatura.
          </p>
          <p>
            7.3. O Fornecedor indenizará a Operadora por quaisquer danos, perdas e despesas (incluindo honorários
            advocatícios) decorrentes do descumprimento dos presentes Termos ou de violação de direitos de terceiros
            por meio da Plataforma.
          </p>

          <h2 style={h2Style}>CLÁUSULA 8ª — DA SUSPENSÃO E EXCLUSÃO</h2>
          <p>
            8.1. A Operadora poderá, a seu exclusivo critério, suspender ou excluir o perfil do Fornecedor nas
            seguintes hipóteses:
          </p>
          <p style={indent}>(a) violação de qualquer cláusula dos presentes Termos;</p>
          <p style={indent}>(b) inserção de informações falsas ou enganosas;</p>
          <p style={indent}>(c) uso da Plataforma para fins ilícitos ou contrários à ordem pública;</p>
          <p style={indent}>(d) inadimplência no pagamento de planos pagos, após notificação;</p>
          <p style={indent}>(e) determinação judicial ou de autoridade competente;</p>
          <p style={indent}>(f) inatividade do CNPJ junto à Receita Federal.</p>
          <p>
            8.2. A exclusão por descumprimento não gera direito a qualquer indenização ou reembolso de valores
            eventualmente pagos.
          </p>

          <h2 style={h2Style}>CLÁUSULA 9ª — DA VIGÊNCIA E RESCISÃO</h2>
          <p>
            9.1. Os presentes Termos vigoram por prazo indeterminado, a partir do momento em que o Fornecedor
            realiza o cadastro e manifesta seu aceite.
          </p>
          <p>
            9.2. O Fornecedor poderá encerrar seu cadastro a qualquer tempo, mediante solicitação pelos canais
            de atendimento da Operadora ou por funcionalidade disponível na própria Plataforma.
          </p>
          <p>
            9.3. O encerramento do cadastro não prejudica obrigações anteriormente contraídas, tampouco afeta
            o tratamento de dados pessoais fundado em bases legais distintas do consentimento.
          </p>

          <h2 style={h2Style}>CLÁUSULA 10ª — DA ALTERAÇÃO DOS TERMOS</h2>
          <p>
            10.1. A Operadora reserva-se o direito de alterar os presentes Termos a qualquer tempo, devendo
            comunicar o Fornecedor com antecedência mínima de 15 (quinze) dias antes da entrada em vigor das
            alterações, salvo em caso de exigência legal que imponha prazo menor.
          </p>
          <p>
            10.2. A comunicação será realizada pelo e-mail cadastrado e/ou por aviso em destaque na Plataforma.
          </p>
          <p>
            10.3. Caso o Fornecedor não concorde com as alterações, poderá encerrar seu cadastro antes da data
            de vigência das novas condições. A continuidade do uso após a entrada em vigor das alterações
            implicará aceite tácito dos novos Termos.
          </p>

          <h2 style={h2Style}>CLÁUSULA 11ª — DAS DISPOSIÇÕES GERAIS</h2>
          <p>
            11.1. Os presentes Termos constituem o acordo integral entre as partes relativamente ao seu objeto,
            substituindo quaisquer entendimentos ou negociações anteriores.
          </p>
          <p>
            11.2. Caso alguma cláusula seja considerada inválida ou inaplicável, as demais permanecerão em pleno
            vigor e efeito.
          </p>
          <p>
            11.3. A tolerância da Operadora quanto ao descumprimento de qualquer cláusula não implica renúncia
            ao direito de exigir seu cumprimento posterior.
          </p>
          <p>
            11.4. O Fornecedor não poderá ceder ou transferir seus direitos e obrigações decorrentes dos presentes
            Termos sem autorização prévia e por escrito da Operadora.
          </p>

          <h2 style={h2Style}>CLÁUSULA 12ª — DO FORO E LEGISLAÇÃO APLICÁVEL</h2>
          <p>
            12.1. Os presentes Termos são regidos pelas leis da República Federativa do Brasil.
          </p>
          <p>
            12.2. Fica eleito o foro da Comarca de <strong>São Paulo</strong>, Estado de <strong>São Paulo</strong>,
            como competente para dirimir quaisquer controvérsias decorrentes dos presentes Termos, com renúncia
            expressa a qualquer outro, por mais privilegiado que seja.
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
