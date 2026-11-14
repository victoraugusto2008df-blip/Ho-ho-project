import { apiFetch } from '@/lib/api'
import type { Fetcher } from '@/features/consumidor/notasApi'
import type { LojistaApi } from './lojistaApi'
import type { Campanha, DashboardLojista } from './types'

/** Implementação de `LojistaApi` sobre o backend, com o cliente HTTP dado. */
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
        body: JSON.stringify({ titulo, descontoPercentual, criterioAlvo }),
      })
    },
  }
}

/** A `LojistaApi` do app: o backend, pelo `apiFetch` (Bearer da sessão). */
export const lojistaApi: LojistaApi = criarRealLojistaApi(apiFetch)
