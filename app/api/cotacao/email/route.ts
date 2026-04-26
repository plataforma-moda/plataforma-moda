import { NextRequest } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

// Lazy initialization: evita erro de build quando RESEND_API_KEY nao esta definida
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM_EMAIL = () => process.env.EMAIL_FROM ?? 'SNM - Sistema Nacional da Moda <noreply@snmoda.com.br>'
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? 'https://snmoda.com.br'

interface CotacaoPayload {
  fornecedor_email: string
  fornecedor_nome: string
  nome_comprador: string
  empresa_comprador: string
  email_comprador: string
  telefone_comprador: string
  produto: string
  quantidade: string
  prazo_desejado: string
  descricao: string
}

function emailFornecedor(p: CotacaoPayload): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nova Solicitação de Cotação</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1E3A5F;border-radius:12px 12px 0 0;padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:40px;background-color:#3B82F6;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-weight:700;font-size:18px;line-height:40px;">S</span>
                  </td>
                  <td style="padding-left:12px;">
                    <div style="color:white;font-weight:700;font-size:16px;line-height:1.2;">SNM</div>
                    <div style="color:#93C5FD;font-size:11px;">Sistema Nacional da Moda</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert banner -->
          <tr>
            <td style="background-color:#3B82F6;padding:14px 32px;">
              <p style="margin:0;color:white;font-size:15px;font-weight:600;">
                🛍️ Nova solicitação de cotação recebida!
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:white;padding:32px;">
              <p style="margin:0 0 8px;font-size:14px;color:#64748B;">Olá, <strong style="color:#1E3A5F;">${p.fornecedor_nome}</strong></p>
              <p style="margin:0 0 28px;font-size:14px;color:#475569;">
                Um comprador acabou de solicitar uma cotação para a sua empresa através da plataforma SNM.
                Confira os detalhes abaixo e entre em contato o mais breve possível.
              </p>

              <!-- Comprador section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.5px;">Dados do Comprador</p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;width:120px;">Nome:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.nome_comprador}</td>
                      </tr>
                      ${p.empresa_comprador ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Empresa:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.empresa_comprador}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">E-mail:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">
                          <a href="mailto:${p.email_comprador}" style="color:#3B82F6;text-decoration:none;">${p.email_comprador}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Telefone:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.telefone_comprador}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pedido section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#F8FAFC;border-left:4px solid #1E3A5F;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#1E3A5F;text-transform:uppercase;letter-spacing:0.5px;">Detalhes do Pedido</p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;width:120px;">Produto:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.produto}</td>
                      </tr>
                      ${p.quantidade ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Quantidade:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.quantidade}</td>
                      </tr>` : ''}
                      ${p.prazo_desejado ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Prazo desejado:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.prazo_desejado}</td>
                      </tr>` : ''}
                      ${p.descricao ? `
                      <tr>
                        <td style="padding:4px 0 0;font-size:13px;color:#64748B;vertical-align:top;">Detalhes:</td>
                        <td style="padding:4px 0 0;font-size:13px;color:#1E3A5F;">${p.descricao.replace(/\n/g, '<br/>')}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${APP_URL()}/dashboard"
                       style="display:inline-block;padding:14px 32px;background-color:#1E3A5F;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                      Acessar Plataforma SNM
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0F2238;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748B;">SNM - Sistema Nacional da Moda &copy; 2026</p>
              <p style="margin:6px 0 0;font-size:11px;color:#475569;">
                Você recebeu este e-mail porque é fornecedor cadastrado na plataforma SNM.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function emailComprador(p: CotacaoPayload): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotação Enviada com Sucesso</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1E3A5F;border-radius:12px 12px 0 0;padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:40px;background-color:#3B82F6;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-weight:700;font-size:18px;line-height:40px;">S</span>
                  </td>
                  <td style="padding-left:12px;">
                    <div style="color:white;font-weight:700;font-size:16px;line-height:1.2;">SNM</div>
                    <div style="color:#93C5FD;font-size:11px;">Sistema Nacional da Moda</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="background-color:#16A34A;padding:14px 32px;">
              <p style="margin:0;color:white;font-size:15px;font-weight:600;">
                ✅ Sua cotação foi enviada com sucesso!
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:white;padding:32px;">
              <p style="margin:0 0 8px;font-size:14px;color:#64748B;">
                Olá, <strong style="color:#1E3A5F;">${p.nome_comprador}</strong>
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#475569;">
                Sua solicitação de cotação foi enviada para <strong style="color:#1E3A5F;">${p.fornecedor_nome}</strong>.
                Aguarde o contato da empresa em breve.
              </p>

              <!-- Resumo do pedido -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#F0FDF4;border-left:4px solid #16A34A;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#16A34A;text-transform:uppercase;letter-spacing:0.5px;">Resumo da Solicitação</p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;width:140px;">Fornecedor:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.fornecedor_nome}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Produto:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.produto}</td>
                      </tr>
                      ${p.quantidade ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Quantidade:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.quantidade}</td>
                      </tr>` : ''}
                      ${p.prazo_desejado ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748B;">Prazo desejado:</td>
                        <td style="padding:4px 0;font-size:13px;color:#1E3A5F;font-weight:600;">${p.prazo_desejado}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:13px;color:#64748B;line-height:1.6;">
                O fornecedor recebeu seus dados de contato e deverá responder diretamente por e-mail ou telefone.
                Caso não receba resposta em 3 dias úteis, tente entrar em contato diretamente.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${APP_URL()}"
                       style="display:inline-block;padding:14px 32px;background-color:#1E3A5F;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                      Explorar mais fornecedores
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0F2238;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748B;">SNM - Sistema Nacional da Moda &copy; 2026</p>
              <p style="margin:6px 0 0;font-size:11px;color:#475569;">
                Você recebeu este e-mail porque solicitou uma cotação na plataforma SNM.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CotacaoPayload

    const {
      fornecedor_email,
      fornecedor_nome,
      nome_comprador,
      email_comprador,
    } = body

    if (!fornecedor_email || !email_comprador || !nome_comprador || !fornecedor_nome) {
      return Response.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      // Em desenvolvimento sem chave configurada, apenas logamos e retornamos sucesso
      console.warn('[email] RESEND_API_KEY não configurada — email não enviado')
      return Response.json({ ok: true, warning: 'RESEND_API_KEY não configurada' })
    }

    const resend = getResend()

    const [toFornecedor, toComprador] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL(),
        to: [fornecedor_email],
        subject: 'Nova solicitação de cotação - SN Moda',
        html: emailFornecedor(body),
      }),
      resend.emails.send({
        from: FROM_EMAIL(),
        to: [email_comprador],
        subject: `Sua cotação foi enviada para ${fornecedor_nome} - SN Moda`,
        html: emailComprador(body),
      }),
    ])

    if (toFornecedor.error || toComprador.error) {
      const err = toFornecedor.error ?? toComprador.error
      console.error('[email] Resend error:', err)
      return Response.json({ error: err?.message ?? 'Erro ao enviar email' }, { status: 500 })
    }

    return Response.json({
      ok: true,
      fornecedor_email_id: toFornecedor.data?.id,
      comprador_email_id: toComprador.data?.id,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    console.error('[email] unexpected error:', err)
    return Response.json({ error: message }, { status: 500 })
  }
}
