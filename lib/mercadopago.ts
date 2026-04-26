import { MercadoPagoConfig, Preference, Payment, PreApproval } from 'mercadopago'

// Instancia singleton do cliente MP (server-side only)
let _client: MercadoPagoConfig | null = null

export function getMPClient(): MercadoPagoConfig {
  if (!_client) {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN
    if (!token) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN nao configurado')
    }
    _client = new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 5000 },
    })
  }
  return _client
}

export function getPreferenceClient() {
  return new Preference(getMPClient())
}

export function getPaymentClient() {
  return new Payment(getMPClient())
}

export function getPreApprovalClient() {
  return new PreApproval(getMPClient())
}

// Formata preco em centavos para reais
export function centsToBrl(cents: number): number {
  return cents / 100
}

// Formata para exibicao
export function formatBrl(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
