import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use empty placeholders to prevent throws during build; real values needed at runtime
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return createBrowserClient(url, key)
}
