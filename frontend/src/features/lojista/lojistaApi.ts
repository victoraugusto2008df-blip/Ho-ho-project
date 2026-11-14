import type { Campanha, DashboardLojista, PedidoCampanha } from './types'

/**
 * Contrato entre a Tela 2 e o backend (ORD-08 e ORD-09).
 * A implementação é trocada por configuração: o mock enquanto o backend não existe,
 * e a implementação real quando `VITE_BACKEND_LOJISTA=true`.
 */
export interface LojistaApi {
  /** Painel da loja do token (`GET /api/v1/analytics/lojista/dashboard`). */
  dashboard(): Promise<DashboardLojista>
  /** Dispara a campanha (`POST /api/v1/campanhas`). Rejeita em qualquer falha. */
  dispararCampanha(pedido: PedidoCampanha): Promise<Campanha>
}
