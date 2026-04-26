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
