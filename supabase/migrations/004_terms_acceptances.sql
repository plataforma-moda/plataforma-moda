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
  -- versão dos termos aceitos (para rastreabilidade de atualizações)
  ip_address    text,
  -- IP do usuário no momento do aceite
  user_agent    text,
  -- user-agent do navegador
  accepted_at   timestamptz NOT NULL DEFAULT now()
  -- data e hora exata do aceite
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_user_id      ON public.terms_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_entity_type  ON public.terms_acceptances(entity_type);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_accepted_at  ON public.terms_acceptances(accepted_at);

-- RLS: habilitar segurança em nível de linha
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Política: qualquer usuário autenticado pode inserir seu próprio aceite
CREATE POLICY "insert_own_acceptance" ON public.terms_acceptances
  FOR INSERT
  WITH CHECK (true);
-- Nota: permitimos INSERT sem restrição de user_id para cobrir casos
-- em que o aceite ocorre antes do login (fluxo de cadastro).
-- Em produção, considere restringir por IP rate-limiting na camada de aplicação.

-- Política: usuários autenticados podem ver apenas os próprios aceites
CREATE POLICY "select_own_acceptances" ON public.terms_acceptances
  FOR SELECT
  USING (auth.uid() = user_id);

-- Comentário de tabela para documentação
COMMENT ON TABLE public.terms_acceptances IS
  'Registra os aceites de Termos de Uso e Política de Privacidade pelos usuários da plataforma SNM. '
  'Mantido para fins de compliance LGPD e auditoria.';
