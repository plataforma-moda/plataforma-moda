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
