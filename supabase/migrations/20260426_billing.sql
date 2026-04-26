-- ============================================================
-- BILLING SYSTEM MIGRATION
-- snmoda.com.br - Sistema Nacional da Moda
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. PLANS - Catalogo de planos
-- ============================================================
CREATE TABLE IF NOT EXISTS plans (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,          -- 'free' | 'basic' | 'pro'
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO plans (id, slug, name, description, sort_order) VALUES
  (1, 'free',  'Gratuito', 'Cadastro basico no diretorio', 1),
  (2, 'basic', 'Basic',    'Para fornecedores que querem crescer', 2),
  (3, 'pro',   'Pro',      'Maximo alcance e prioridade total', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. PLAN_PRICES - Precos por periodicidade
-- ============================================================
CREATE TABLE IF NOT EXISTS plan_prices (
  id           SERIAL PRIMARY KEY,
  plan_id      INT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  interval     TEXT NOT NULL DEFAULT 'monthly',  -- 'monthly' | 'yearly'
  price_cents  INT NOT NULL DEFAULT 0,           -- em centavos BRL
  currency     TEXT NOT NULL DEFAULT 'BRL',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_id, interval)
);

-- Precos: Free=R$0, Basic=R$79/mes, Pro=R$149/mes
INSERT INTO plan_prices (plan_id, interval, price_cents) VALUES
  (1, 'monthly', 0),
  (1, 'yearly',  0),
  (2, 'monthly', 7900),
  (2, 'yearly',  75840),   -- R$758.40/ano = ~20% desconto
  (3, 'monthly', 14900),
  (3, 'yearly',  143040)   -- R$1430.40/ano = ~20% desconto
ON CONFLICT (plan_id, interval) DO NOTHING;

-- ============================================================
-- 3. ENTITLEMENTS - Limites e features por plano
-- ============================================================
CREATE TABLE IF NOT EXISTS entitlements (
  id           SERIAL PRIMARY KEY,
  plan_id      INT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feature_key  TEXT NOT NULL,
  feature_value TEXT NOT NULL,  -- pode ser 'true', 'false', '3', 'unlimited'
  UNIQUE(plan_id, feature_key)
);

-- Free entitlements
INSERT INTO entitlements (plan_id, feature_key, feature_value) VALUES
  (1, 'max_categories',      '1'),
  (1, 'search_highlight',    'false'),
  (1, 'verified_badge',      'false'),
  (1, 'premium_badge',       'false'),
  (1, 'premium_ranking',     'false'),
  (1, 'analytics',           'false'),
  (1, 'priority_support',    'false'),
  (1, 'monthly_contacts',    '5')
ON CONFLICT (plan_id, feature_key) DO NOTHING;

-- Basic entitlements
INSERT INTO entitlements (plan_id, feature_key, feature_value) VALUES
  (2, 'max_categories',      '3'),
  (2, 'search_highlight',    'true'),
  (2, 'verified_badge',      'true'),
  (2, 'premium_badge',       'false'),
  (2, 'premium_ranking',     'false'),
  (2, 'analytics',           'false'),
  (2, 'priority_support',    'false'),
  (2, 'monthly_contacts',    'unlimited')
ON CONFLICT (plan_id, feature_key) DO NOTHING;

-- Pro entitlements
INSERT INTO entitlements (plan_id, feature_key, feature_value) VALUES
  (3, 'max_categories',      'unlimited'),
  (3, 'search_highlight',    'true'),
  (3, 'verified_badge',      'true'),
  (3, 'premium_badge',       'true'),
  (3, 'premium_ranking',     'true'),
  (3, 'analytics',           'true'),
  (3, 'priority_support',    'true'),
  (3, 'monthly_contacts',    'unlimited')
ON CONFLICT (plan_id, feature_key) DO NOTHING;

-- ============================================================
-- 4. BILLING_CUSTOMERS - Mapeamento fornecedor <-> MP customer
-- ============================================================
CREATE TABLE IF NOT EXISTS billing_customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fornecedor_id    UUID NOT NULL UNIQUE REFERENCES fornecedores(id) ON DELETE CASCADE,
  mp_customer_id   TEXT,   -- ID do customer no Mercado Pago (se houver)
  mp_payer_email   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. SUBSCRIPTIONS - Refatorar tabela existente
-- ============================================================

-- Adicionar colunas novas (sem quebrar o existente)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS price_id        INT REFERENCES plan_prices(id),
  ADD COLUMN IF NOT EXISTS gateway         TEXT DEFAULT 'mercadopago',
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT,      -- ID da preferencia criada
  ADD COLUMN IF NOT EXISTS mp_payment_id   TEXT,       -- ID do pagamento MP
  ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT,     -- ID preapproval (recorrencia)
  ADD COLUMN IF NOT EXISTS period_start    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS period_end      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at       TIMESTAMPTZ, -- agendado para cancelar
  ADD COLUMN IF NOT EXISTS canceled_at     TIMESTAMPTZ, -- efetivamente cancelado
  ADD COLUMN IF NOT EXISTS trial_end       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS metadata        JSONB DEFAULT '{}';

-- Atualizar constraint de status para incluir novos valores
-- (sem remover para nao quebrar dados existentes)

-- Comentarios informativos sobre status:
-- 'active'        - assinatura ativa
-- 'pending'       - aguardando pagamento
-- 'past_due'      - pagamento atrasado
-- 'canceled'      - cancelada
-- 'trialing'      - em trial
-- 'free'          - plano gratuito (sem cobranca)

-- ============================================================
-- 6. SUBSCRIPTION_EVENTS - Audit log de webhooks
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id  UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  fornecedor_id    UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  event_type       TEXT NOT NULL,  -- 'payment.created', 'payment.approved', etc.
  gateway          TEXT DEFAULT 'mercadopago',
  gateway_event_id TEXT,           -- ID do evento no MP (para idempotencia)
  payload          JSONB DEFAULT '{}',
  processed_at     TIMESTAMPTZ,
  error            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gateway, gateway_event_id)  -- idempotencia
);

-- ============================================================
-- 7. INDEXES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_fornecedor ON subscriptions(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_payment ON subscriptions(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_gateway_id ON subscription_events(gateway, gateway_event_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_fornecedor ON subscription_events(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_billing_customers_fornecedor ON billing_customers(fornecedor_id);

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================

-- plans (public read)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_public_read" ON plans FOR SELECT USING (true);

-- plan_prices (public read)
ALTER TABLE plan_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plan_prices_public_read" ON plan_prices FOR SELECT USING (true);

-- entitlements (public read)
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entitlements_public_read" ON entitlements FOR SELECT USING (true);

-- billing_customers (service role only for writes, user reads own)
ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "billing_customers_read_own" ON billing_customers
  FOR SELECT USING (
    fornecedor_id IN (
      SELECT id FROM fornecedores WHERE user_id = auth.uid()
    )
  );

-- subscriptions (service role writes; users read own)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "subscriptions_read_own" ON subscriptions;
CREATE POLICY "subscriptions_read_own" ON subscriptions
  FOR SELECT USING (
    fornecedor_id::text IN (
      SELECT id::text FROM fornecedores WHERE user_id = auth.uid()
    )
  );

-- subscription_events (service role only)
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscription_events_service_only" ON subscription_events
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 9. FUNCAO HELPER - Obter plano ativo de um fornecedor
-- ============================================================
CREATE OR REPLACE FUNCTION get_active_plan(p_fornecedor_id UUID)
RETURNS TABLE(plan_id INT, plan_slug TEXT, plan_name TEXT, status TEXT, period_end TIMESTAMPTZ)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT
    p.id AS plan_id,
    p.slug AS plan_slug,
    p.name AS plan_name,
    s.status,
    s.period_end
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.fornecedor_id = p_fornecedor_id
    AND s.status IN ('active', 'trialing', 'free')
  ORDER BY s.created_at DESC
  LIMIT 1;
$$;
