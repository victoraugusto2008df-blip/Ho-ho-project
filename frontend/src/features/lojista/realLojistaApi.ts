import type { Fetcher } from '@/features/consumidor/notasApi'
import type { LojistaApi } from './lojistaApi'
import type { Campanha, DashboardLojista } from './types'

/** Implementação de `LojistaApi` sobre o ORD-08 e o contrato da door 1 do plano (ORD-09). */
export function criarRealLojistaApi(fetcher: Fetcher): LojistaApi {
  return {
    async dashboard() {
      return fetcher<DashboardLojista>('/analytics/lojista/dashboard')
    },
    async dispararCampanha(pedido) {
      // Campos escolhidos um a um: nada além deles sai do front, nunca a loja (vem do JWT).
      const { titulo, descontoPercentual, criterioAlvo } = pedido
      return fetcher<Campanha>('/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descontoPercentual, criterioAlvo }),
      })
    },
  }
}
