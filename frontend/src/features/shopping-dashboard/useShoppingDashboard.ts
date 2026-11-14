import { useQuery } from '@tanstack/react-query'
import type { Periodo } from '@/lib/analytics/tipos'
import { ErroDoDashboard, type DashboardClient } from './analyticsClient'

/**
 * Uma entrada de cache por período: a tela lê sempre a chave do período escolhido por último, então
 * uma resposta atrasada de outro período nunca chega à tela (critério 20).
 */
export function useShoppingDashboard(periodo: Periodo, client: DashboardClient) {
  return useQuery({
    queryKey: ['shopping-dashboard', periodo],
    queryFn: ({ signal }) => client(periodo, signal),
    // Cada troca de período refaz a consulta (critério 17).
    staleTime: 0,
    // Negativa de acesso não melhora com nova tentativa; falha de servidor tenta uma vez mais.
    retry: (falhas, erro) => !(erro instanceof ErroDoDashboard && erro.tipo === 'sem-permissao') && falhas < 1,
  })
}
