import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export interface ThresholdStatus {
  is_met: boolean
  enabled: boolean
  current_value: number
  threshold_value: number
  percentage: number
  categories_count: number
}

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient()

    // Fetch threshold config
    const { data: threshold, error: tErr } = await supabase
      .from('launch_thresholds')
      .select('threshold_type, threshold_value, is_met, enabled')
      .eq('threshold_type', 'total_fornecedores')
      .single()

    // If table doesn't exist or no row: assume sales are open
    if (tErr || !threshold) {
      return Response.json({
        is_met: true,
        enabled: false,
        current_value: 0,
        threshold_value: 200,
        percentage: 100,
        categories_count: 0,
      } satisfies ThresholdStatus)
    }

    // If threshold is disabled: sales open
    if (!threshold.enabled) {
      return Response.json({
        is_met: true,
        enabled: false,
        current_value: 0,
        threshold_value: threshold.threshold_value,
        percentage: 100,
        categories_count: 0,
      } satisfies ThresholdStatus)
    }

    // Count fornecedores and categories in parallel
    const [{ count: fornCount }, { count: catCount }] = await Promise.all([
      supabase.from('fornecedores').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ])

    const current_value = fornCount ?? 0
    const is_met = current_value >= threshold.threshold_value
    const percentage = Math.min(
      100,
      Math.round((current_value / threshold.threshold_value) * 100)
    )

    // Update is_met in DB when status changes (best-effort, ignore error)
    if (is_met !== threshold.is_met) {
      await supabase
        .from('launch_thresholds')
        .update({ is_met, updated_at: new Date().toISOString() })
        .eq('threshold_type', 'total_fornecedores')
    }

    return Response.json({
      is_met,
      enabled: true,
      current_value,
      threshold_value: threshold.threshold_value,
      percentage,
      categories_count: catCount ?? 0,
    } satisfies ThresholdStatus)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
