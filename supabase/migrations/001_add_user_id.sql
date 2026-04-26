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
