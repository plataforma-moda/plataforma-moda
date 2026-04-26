// ============================================================
// PLANOS DE ASSINATURA - Configuracao centralizada
// Altere aqui para mudar precos ou features dos planos
// ============================================================

export const PLAN_IDS = {
  FREE: 1,
  BASIC: 2,
  PRO: 3,
} as const

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS]

export interface PlanConfig {
  id: PlanId
  slug: 'free' | 'basic' | 'pro'
  name: string
  tagline: string
  priceMonthly: number   // em reais (0 = gratuito)
  priceYearly: number    // em reais
  highlight?: string     // badge (ex: "Mais popular")
  features: { text: string; included: boolean }[]
  entitlements: {
    max_categories: number | 'unlimited'
    monthly_contacts: number | 'unlimited'
    search_highlight: boolean
    verified_badge: boolean
    premium_badge: boolean
    premium_ranking: boolean
    analytics: boolean
    priority_support: boolean
  }
}

export const PLANS: PlanConfig[] = [
  {
    id: PLAN_IDS.FREE,
    slug: 'free',
    name: 'Gratuito',
    tagline: 'Ideal para comecar e testar a plataforma',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { text: 'Perfil basico no diretorio', included: true },
      { text: 'Aparece nas buscas', included: true },
      { text: 'Ate 5 contatos por mes', included: true },
      { text: '1 categoria', included: true },
      { text: 'Destaque na busca', included: false },
      { text: 'Selo verificado', included: false },
    ],
    entitlements: {
      max_categories: 1,
      monthly_contacts: 5,
      search_highlight: false,
      verified_badge: false,
      premium_badge: false,
      premium_ranking: false,
      analytics: false,
      priority_support: false,
    },
  },
  {
    id: PLAN_IDS.BASIC,
    slug: 'basic',
    name: 'Basic',
    tagline: 'Para fornecedores que querem crescer',
    priceMonthly: 79,
    priceYearly: 758.4, // ~20% desconto
    highlight: 'Mais popular',
    features: [
      { text: 'Tudo do Gratuito', included: true },
      { text: 'Ate 3 categorias', included: true },
      { text: 'Contatos ilimitados', included: true },
      { text: 'Destaque na busca', included: true },
      { text: 'Selo verificado', included: true },
      { text: 'Suporte por e-mail', included: true },
    ],
    entitlements: {
      max_categories: 3,
      monthly_contacts: 'unlimited',
      search_highlight: true,
      verified_badge: true,
      premium_badge: false,
      premium_ranking: false,
      analytics: false,
      priority_support: false,
    },
  },
  {
    id: PLAN_IDS.PRO,
    slug: 'pro',
    name: 'Pro',
    tagline: 'Maximo alcance e prioridade total',
    priceMonthly: 149,
    priceYearly: 1430.4, // ~20% desconto
    features: [
      { text: 'Tudo do Basic', included: true },
      { text: 'Todas as categorias', included: true },
      { text: 'Posicao premium no ranking', included: true },
      { text: 'Badge premium', included: true },
      { text: 'Relatorios de visualizacao', included: true },
      { text: 'Suporte prioritario', included: true },
    ],
    entitlements: {
      max_categories: 'unlimited',
      monthly_contacts: 'unlimited',
      search_highlight: true,
      verified_badge: true,
      premium_badge: true,
      premium_ranking: true,
      analytics: true,
      priority_support: true,
    },
  },
]

export function getPlanById(id: PlanId): PlanConfig {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}

export function getPlanBySlug(slug: string): PlanConfig {
  return PLANS.find((p) => p.slug === slug) ?? PLANS[0]
}
