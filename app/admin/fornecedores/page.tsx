import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import FornecedoresTable from './FornecedoresTable'

const ADMIN_EMAIL = 'financeiro@raafco.com.br'

export default async function AdminFornecedores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: fornecedores, error } = await serviceClient
    .from('fornecedores')
    .select('id, nome, email, cidade, estado, categoria_nome, plano, user_id, created_at')
    .order('created_at', { ascending: false })

  return (
    <FornecedoresTable
      fornecedores={fornecedores ?? []}
      errorMsg={error?.message ?? null}
    />
  )
}
