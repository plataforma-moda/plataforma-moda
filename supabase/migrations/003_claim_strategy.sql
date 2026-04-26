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
