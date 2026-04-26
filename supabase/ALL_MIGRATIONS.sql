-- ============================================================
-- TODAS AS MIGRATIONS - snmoda.com.br
-- Cole este SQL inteiro no SQL Editor do Supabase
-- ============================================================

-- >>>>>>>>>> supabase/migrations/001_add_user_id.sql
-- ============================================================
-- Migration 001: Add user_id column to fornecedores and subscriptions
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Add user_id column to fornecedores (references auth.users)
ALTER TABLE fornecedores
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add user_id column to subscriptions
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add user_id column to clientes
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_fornecedores_user_id ON fornecedores(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);


-- >>>>>>>>>> supabase/migrations/002_enable_rls.sql
-- ============================================================
-- Migration 002: Enable RLS and create policies for all tables
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. FORNECEDORES
-- ============================================================
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can see fornecedores)
CREATE POLICY "fornecedores_select_public"
ON fornecedores FOR SELECT
TO anon, authenticated
USING (true);

-- Only the owner can insert (must be authenticated and set their own user_id)
CREATE POLICY "fornecedores_insert_authenticated"
ON fornecedores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anon inserts for backward compatibility (cadastro without login)
CREATE POLICY "fornecedores_insert_anon"
ON fornecedores FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Only the owner can update their own fornecedor
CREATE POLICY "fornecedores_update_owner"
ON fornecedores FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their own fornecedor
CREATE POLICY "fornecedores_delete_owner"
ON fornecedores FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================
-- 2. FORNECEDOR_CATEGORIAS
-- ============================================================
ALTER TABLE fornecedor_categorias ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "fornecedor_categorias_select_public"
ON fornecedor_categorias FOR SELECT
TO anon, authenticated
USING (true);

-- Insert: must own the parent fornecedor
CREATE POLICY "fornecedor_categorias_insert_owner"
ON fornecedor_categorias FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Allow anon inserts for backward compatibility (cadastro without login)
CREATE POLICY "fornecedor_categorias_insert_anon"
ON fornecedor_categorias FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id IS NULL
  )
);

-- Update/delete: must own the parent fornecedor
CREATE POLICY "fornecedor_categorias_update_owner"
ON fornecedor_categorias FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

CREATE POLICY "fornecedor_categorias_delete_owner"
ON fornecedor_categorias FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Allow anon delete for backward compatibility (used in editar flow)
CREATE POLICY "fornecedor_categorias_delete_anon"
ON fornecedor_categorias FOR DELETE
TO anon
USING (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id IS NULL
  )
);

-- ============================================================
-- 3. CLIENTES
-- ============================================================
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Owner can read their own data
CREATE POLICY "clientes_select_owner"
ON clientes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can insert their own data
CREATE POLICY "clientes_insert_authenticated"
ON clientes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anon inserts (current registration flow)
CREATE POLICY "clientes_insert_anon"
ON clientes FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Owner can update
CREATE POLICY "clientes_update_owner"
ON clientes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================
-- 4. COTACOES
-- ============================================================
ALTER TABLE cotacoes ENABLE ROW LEVEL SECURITY;

-- Fornecedor destinatario can read cotacoes sent to them
CREATE POLICY "cotacoes_select_fornecedor"
ON cotacoes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = cotacoes.fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Anyone can insert cotacoes (public quote request form)
CREATE POLICY "cotacoes_insert_public"
ON cotacoes FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================
-- 5. SUBSCRIPTIONS
-- ============================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Owner can read their subscriptions
CREATE POLICY "subscriptions_select_owner"
ON subscriptions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = subscriptions.fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Authenticated users can insert subscriptions for their own fornecedores
CREATE POLICY "subscriptions_insert_owner"
ON subscriptions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fornecedores
    WHERE fornecedores.id = fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Allow anon inserts for backward compatibility (planos page)
CREATE POLICY "subscriptions_insert_anon"
ON subscriptions FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================
-- 6. CATEGORIES (read-only for public, admin writes)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_public"
ON categories FOR SELECT
TO anon, authenticated
USING (true);

-- Admin-only writes (use service_role key or Supabase Dashboard)
-- No public INSERT/UPDATE/DELETE policies

-- ============================================================
-- 7. SUBCATEGORIES (read-only for public)
-- ============================================================
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subcategories_select_public"
ON subcategories FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- 8. SPECIALIZATIONS (read-only for public)
-- ============================================================
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "specializations_select_public"
ON specializations FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- 9. POLOS_TEXTEIS (read-only for public)
-- ============================================================
ALTER TABLE polos_texteis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "polos_texteis_select_public"
ON polos_texteis FOR SELECT
TO anon, authenticated
USING (true);


-- >>>>>>>>>> supabase/migrations/003_claim_strategy.sql
-- ============================================================
-- Migration 003: Claim strategy for existing 129 fornecedores
-- 
-- The existing fornecedores have user_id = NULL.
-- This migration creates a function that allows a logged-in user
-- to claim a fornecedor by matching their email address.
--
-- STRATEGY:
-- 1. Existing fornecedores remain with user_id = NULL (preserved)
-- 2. When a user logs in and their email matches a fornecedor's email,
--    they can claim it (set user_id = their auth.uid())
-- 3. Admin can also manually assign via Supabase Dashboard
-- ============================================================

-- Function to claim a fornecedor by email match
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

  -- Get the email of the currently authenticated user
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_uuid;

  IF user_email IS NULL THEN
    RAISE EXCEPTION 'User email not found';
  END IF;

  -- Update fornecedores where email matches and user_id is still NULL
  RETURN QUERY
  UPDATE fornecedores
  SET user_id = user_uuid
  WHERE fornecedores.email = user_email
    AND fornecedores.user_id IS NULL
  RETURNING fornecedores.id::text AS fornecedor_id, fornecedores.nome AS fornecedor_nome;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION claim_fornecedor_by_email() TO authenticated;

-- ============================================================
-- Admin function to manually assign a fornecedor to a user
-- (Run from Supabase Dashboard or with service_role key)
-- ============================================================
CREATE OR REPLACE FUNCTION admin_assign_fornecedor(
  p_fornecedor_id text,
  p_user_id uuid
)
RETURNS void AS $$
BEGIN
  UPDATE fornecedores
  SET user_id = p_user_id
  WHERE id = p_fornecedor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- >>>>>>>>>> supabase/migrations/004_terms_acceptances.sql
-- Migration: 004_terms_acceptances
-- Cria tabela para registrar aceites de termos de uso (LGPD / compliance)

CREATE TABLE IF NOT EXISTS public.terms_acceptances (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- identificador de quem aceitou (pode ser null para visitantes)
  entity_type   text NOT NULL CHECK (entity_type IN ('fornecedor', 'cliente', 'plano')),
  -- 'fornecedor' = aceite no cadastro de fornecedor
  -- 'cliente'    = aceite no cadastro de comprador
  -- 'plano'      = aceite antes de contratar plano
  entity_id     text,
  -- ID do fornecedor, cliente ou assinatura associada ao aceite (opcional)
  terms_version text NOT NULL DEFAULT '1.0',
  -- versÃ£o dos termos aceitos (para rastreabilidade de atualizaÃ§Ãµes)
  ip_address    text,
  -- IP do usuÃ¡rio no momento do aceite
  user_agent    text,
  -- user-agent do navegador
  accepted_at   timestamptz NOT NULL DEFAULT now()
  -- data e hora exata do aceite
);

-- Ãndices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_user_id      ON public.terms_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_entity_type  ON public.terms_acceptances(entity_type);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_accepted_at  ON public.terms_acceptances(accepted_at);

-- RLS: habilitar seguranÃ§a em nÃ­vel de linha
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- PolÃ­tica: qualquer usuÃ¡rio autenticado pode inserir seu prÃ³prio aceite
CREATE POLICY "insert_own_acceptance" ON public.terms_acceptances
  FOR INSERT
  WITH CHECK (true);
-- Nota: permitimos INSERT sem restriÃ§Ã£o de user_id para cobrir casos
-- em que o aceite ocorre antes do login (fluxo de cadastro).
-- Em produÃ§Ã£o, considere restringir por IP rate-limiting na camada de aplicaÃ§Ã£o.

-- PolÃ­tica: usuÃ¡rios autenticados podem ver apenas os prÃ³prios aceites
CREATE POLICY "select_own_acceptances" ON public.terms_acceptances
  FOR SELECT
  USING (auth.uid() = user_id);

-- ComentÃ¡rio de tabela para documentaÃ§Ã£o
COMMENT ON TABLE public.terms_acceptances IS
  'Registra os aceites de Termos de Uso e PolÃ­tica de Privacidade pelos usuÃ¡rios da plataforma SNM. '
  'Mantido para fins de compliance LGPD e auditoria.';


-- >>>>>>>>>> supabase/migrations/20260426_billing.sql
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


-- >>>>>>>>>> supabase/migrations/005_launch_thresholds.sql
-- ============================================================
-- LAUNCH THRESHOLDS & WAITLIST
-- snmoda.com.br - Sistema Nacional da Moda
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. LAUNCH_THRESHOLDS - Controle de liberacao de vendas
-- ============================================================
CREATE TABLE IF NOT EXISTS launch_thresholds (
  id               SERIAL PRIMARY KEY,
  threshold_type   TEXT NOT NULL UNIQUE,       -- 'total_fornecedores'
  threshold_value  INT  NOT NULL DEFAULT 200,  -- numero minimo para liberar vendas
  is_met           BOOLEAN NOT NULL DEFAULT FALSE,
  enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default: liberar vendas apos 200 fornecedores
INSERT INTO launch_thresholds (threshold_type, threshold_value, is_met, enabled) VALUES
  ('total_fornecedores', 200, FALSE, TRUE)
ON CONFLICT (threshold_type) DO NOTHING;

-- ============================================================
-- 2. WAITLIST_EMAILS - Captura de interesse pre-lancamento
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist_emails (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email)
);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

-- launch_thresholds: leitura publica, escrita service_role
ALTER TABLE launch_thresholds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "launch_thresholds_public_read" ON launch_thresholds
  FOR SELECT USING (true);
CREATE POLICY "launch_thresholds_service_write" ON launch_thresholds
  FOR ALL USING (auth.role() = 'service_role');

-- waitlist_emails: insercao anonima permitida, leitura service_role
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_anon_insert" ON waitlist_emails
  FOR INSERT WITH CHECK (true);
CREATE POLICY "waitlist_service_read" ON waitlist_emails
  FOR SELECT USING (auth.role() = 'service_role');

-- ============================================================
-- 4. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_launch_thresholds_type ON launch_thresholds(threshold_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email  ON waitlist_emails(email);



