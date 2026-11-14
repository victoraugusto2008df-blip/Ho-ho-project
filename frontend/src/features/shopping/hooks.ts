import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { DashboardShopping } from './types'

export const CHAVE_DASHBOARD_SHOPPING = ['shopping', 'dashboard'] as const

/** Visão consolidada do shopping (`GET /api/v1/analytics/shopping/dashboard`). */
export function useDashboardShopping() {
  return useQuery({
    queryKey: CHAVE_DASHBOARD_SHOPPING,
    queryFn: () => apiFetch<DashboardShopping>('/analytics/shopping/dashboard'),
  })
}
