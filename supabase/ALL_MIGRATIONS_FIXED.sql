-- ============================================================
-- MIGRATIONS CORRIGIDAS - snmoda.com.br
-- Adaptado para o schema existente no Supabase
-- Cole TUDO no SQL Editor e clique Run
-- ============================================================

-- >>>>>>>>>> 001: ADD USER_ID
ALTER TABLE fornecedores
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_fornecedores_user_id ON fornecedores(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);

-- >>>>>>>>>> 002: ENABLE RLS + POLICIES
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fornecedores_select_public" ON fornecedores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "fornecedores_insert_authenticated" ON fornecedores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "fornecedores_insert_anon" ON fornecedores FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "fornecedores_update_owner" ON fornecedores FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fornecedores_delete_owner" ON fornecedores FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE fornecedor_categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fornecedor_categorias_select_public" ON fornecedor_categorias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "fornecedor_categorias_insert_owner" ON fornecedor_categorias FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "fornecedor_categorias_insert_anon" ON fornecedor_categorias FOR INSERT TO anon WITH CHECK (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id IS NULL));
CREATE POLICY "fornecedor_categorias_update_owner" ON fornecedor_categorias FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "fornecedor_categorias_delete_owner" ON fornecedor_categorias FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "fornecedor_categorias_delete_anon" ON fornecedor_categorias FOR DELETE TO anon USING (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id IS NULL));

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_select_owner" ON clientes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "clientes_insert_authenticated" ON clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "clientes_insert_anon" ON clientes FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "clientes_update_owner" ON clientes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE cotacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cotacoes_select_fornecedor" ON cotacoes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = cotacoes.fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "cotacoes_insert_public" ON cotacoes FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_select_owner" ON subscriptions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = subscriptions.fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "subscriptions_insert_owner" ON subscriptions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM fornecedores WHERE fornecedores.id = fornecedor_id AND fornecedores.user_id = auth.uid()));
CREATE POLICY "subscriptions_insert_anon" ON subscriptions FOR INSERT TO anon WITH CHECK (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_public" ON categories FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subcategories_select_public" ON subcategories FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "specializations_select_public" ON specializations FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE polos_texteis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "polos_texteis_select_public" ON polos_texteis FOR SELECT TO anon, authenticated USING (true);

-- >>>>>>>>>> 003: CLAIM STRATEGY
CREATE OR REPLACE FUNCTION claim_fornecedor_by_email()
RETURNS TABLE(fornecedor_id text, fornecedor_nome text) AS $$
DECLARE
  user_email text;
  user_uuid uuid;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  SELECT email INTO user_email FROM auth.users WHERE id = user_uuid;
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'User email not found';
  END IF;
  RETURN QUERY
  UPDATE fornecedores
  SET user_id = user_uuid
  WHERE fornecedores.email = user_email
    AND fornecedores.user_id IS NULL
  RETURNING fornecedores.id::text AS fornecedor_id, fornecedores.nome AS fornecedor_nome;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION claim_fornecedor_by_email() TO authenticated;

CREATE OR REPLACE FUNCTION admin_assign_fornecedor(p_fornecedor_id text, p_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE fornecedores SET user_id = p_user_id WHERE id = p_fornecedor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- >>>>>>>>>> 004: TERMS ACCEPTANCES
CREATE TABLE IF NOT EXISTS public.terms_acceptances (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type   text NOT NULL CHECK (entity_type IN ('fornecedor', 'cliente', 'plano')),
  entity_id     text,
  terms_version text NOT NULL DEFAULT '1.0',
  ip_address    text,
  user_agent    text,
  accepted_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_terms_acceptances_user_id ON public.terms_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_entity_type ON public.terms_acceptances(entity_type);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_accepted_at ON public.terms_acceptances(accepted_at);

ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_own_acceptance" ON public.terms_acceptances FOR INSERT WITH CHECK (true);
CREATE POLICY "select_own_acceptances" ON public.terms_acceptances FOR SELECT USING (auth.uid() = user_id);

-- >>>>>>>>>> BILLING: ADAPTAR TABELA PLANS EXISTENTE
-- A tabela plans ja existe com: id, name, price, description, max_leads_per_month, priority_ranking, created_at
-- Adicionando colunas que faltam:
ALTER TABLE plans ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Preencher slug baseado nos nomes existentes
UPDATE plans SET slug = 'free', sort_order = 1 WHERE id = 1;
UPDATE plans SET slug = 'basic', sort_order = 2 WHERE id = 2;
UPDATE plans SET slug = 'pro', sort_order = 3 WHERE id = 3;
UPDATE plans SET is_active = TRUE WHERE is_active IS NULL;

-- Adicionar constraint unique no slug (se nao existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'plans_slug_key') THEN
    ALTER TABLE plans ADD CONSTRAINT plans_slug_key UNIQUE (slug);
  END IF;
END $$;

-- PLAN_PRICES
CREATE TABLE IF NOT EXISTS plan_prices (
  id           SERIAL PRIMARY KEY,
  plan_id      INT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  interval     TEXT NOT NULL DEFAULT 'monthly',
  price_cents  INT NOT NULL DEFAULT 0,
  currency     TEXT NOT NULL DEFAULT 'BRL',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_id, interval)
);

INSERT INTO plan_prices (plan_id, interval, price_cents) VALUES
  (1, 'monthly', 0),
  (1, 'yearly',  0),
  (2, 'monthly', 7900),
  (2, 'yearly',  75840),
  (3, 'monthly', 14900),
  (3, 'yearly',  143040)
ON CONFLICT (plan_id, interval) DO NOTHING;

-- ENTITLEMENTS
CREATE TABLE IF NOT EXISTS entitlements (
  id           SERIAL PRIMARY KEY,
  plan_id      INT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feature_key  TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  UNIQUE(plan_id, feature_key)
);

INSERT INTO entitlements (plan_id, feature_key, feature_value) VALUES
  (1, 'max_categories', '1'), (1, 'search_highlight', 'false'), (1, 'verified_badge', 'false'),
  (1, 'premium_badge', 'false'), (1, 'premium_ranking', 'false'), (1, 'analytics', 'false'),
  (1, 'priority_support', 'false'), (1, 'monthly_contacts', '5'),
  (2, 'max_categories', '3'), (2, 'search_highlight', 'true'), (2, 'verified_badge', 'true'),
  (2, 'premium_badge', 'false'), (2, 'premium_ranking', 'false'), (2, 'analytics', 'false'),
  (2, 'priority_support', 'false'), (2, 'monthly_contacts', 'unlimited'),
  (3, 'max_categories', 'unlimited'), (3, 'search_highlight', 'true'), (3, 'verified_badge', 'true'),
  (3, 'premium_badge', 'true'), (3, 'premium_ranking', 'true'), (3, 'analytics', 'true'),
  (3, 'priority_support', 'true'), (3, 'monthly_contacts', 'unlimited')
ON CONFLICT (plan_id, feature_key) DO NOTHING;

-- BILLING_CUSTOMERS
CREATE TABLE IF NOT EXISTS billing_customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fornecedor_id    UUID NOT NULL UNIQUE REFERENCES fornecedores(id) ON DELETE CASCADE,
  mp_customer_id   TEXT,
  mp_payer_email   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBSCRIPTIONS - adicionar colunas novas
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS price_id        INT REFERENCES plan_prices(id),
  ADD COLUMN IF NOT EXISTS gateway         TEXT DEFAULT 'mercadopago',
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT,
  ADD COLUMN IF NOT EXISTS mp_payment_id   TEXT,
  ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT,
  ADD COLUMN IF NOT EXISTS period_start    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS period_end      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS canceled_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_end       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS metadata        JSONB DEFAULT '{}';

-- SUBSCRIPTION_EVENTS
CREATE TABLE IF NOT EXISTS subscription_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id  INT REFERENCES subscriptions(id) ON DELETE SET NULL,
  fornecedor_id    UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  event_type       TEXT NOT NULL,
  gateway          TEXT DEFAULT 'mercadopago',
  gateway_event_id TEXT,
  payload          JSONB DEFAULT '{}',
  processed_at     TIMESTAMPTZ,
  error            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gateway, gateway_event_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_subscriptions_fornecedor ON subscriptions(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_payment ON subscriptions(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_gateway_id ON subscription_events(gateway, gateway_event_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_fornecedor ON subscription_events(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_billing_customers_fornecedor ON billing_customers(fornecedor_id);

-- RLS para novas tabelas
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_public_read" ON plans;
CREATE POLICY "plans_public_read" ON plans FOR SELECT USING (true);

ALTER TABLE plan_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plan_prices_public_read" ON plan_prices FOR SELECT USING (true);

ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entitlements_public_read" ON entitlements FOR SELECT USING (true);

ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "billing_customers_read_own" ON billing_customers FOR SELECT USING (fornecedor_id IN (SELECT id FROM fornecedores WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "subscriptions_select_owner" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_owner" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_anon" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_read_own" ON subscriptions;
CREATE POLICY "subscriptions_read_own" ON subscriptions FOR SELECT USING (fornecedor_id::text IN (SELECT id::text FROM fornecedores WHERE user_id = auth.uid()));

ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscription_events_service_only" ON subscription_events FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION get_active_plan(p_fornecedor_id UUID)
RETURNS TABLE(plan_id INT, plan_slug TEXT, plan_name TEXT, status TEXT, period_end TIMESTAMPTZ)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT p.id AS plan_id, p.slug AS plan_slug, p.name AS plan_name, s.status, s.period_end
  FROM subscriptions s JOIN plans p ON p.id = s.plan_id
  WHERE s.fornecedor_id = p_fornecedor_id AND s.status IN ('active', 'trialing', 'free')
  ORDER BY s.created_at DESC LIMIT 1;
$$;

-- >>>>>>>>>> 005: LAUNCH THRESHOLDS
CREATE TABLE IF NOT EXISTS launch_thresholds (
  id               SERIAL PRIMARY KEY,
  threshold_type   TEXT NOT NULL UNIQUE,
  threshold_value  INT  NOT NULL DEFAULT 200,
  is_met           BOOLEAN NOT NULL DEFAULT FALSE,
  enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO launch_thresholds (threshold_type, threshold_value, is_met, enabled) VALUES
  ('total_fornecedores', 200, FALSE, TRUE)
ON CONFLICT (threshold_type) DO NOTHING;

CREATE TABLE IF NOT EXISTS waitlist_emails (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email)
);

ALTER TABLE launch_thresholds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "launch_thresholds_public_read" ON launch_thresholds FOR SELECT USING (true);
CREATE POLICY "launch_thresholds_service_write" ON launch_thresholds FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_anon_insert" ON waitlist_emails FOR INSERT WITH CHECK (true);
CREATE POLICY "waitlist_service_read" ON waitlist_emails FOR SELECT USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_launch_thresholds_type ON launch_thresholds(threshold_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON waitlist_emails(email);

-- ============================================================
-- FIM - Todas as migrations executadas com sucesso!
-- ============================================================
