import type { Campanha, DashboardLojista, PedidoCampanha } from './types'

/** O que a Tela 2 precisa do backend (ORD-08 e campanhas). A implementação é `realLojistaApi`. */
export interface LojistaApi {
  /** Painel da loja do token (`GET /api/v1/analytics/lojista/dashboard`). */
  dashboard(): Promise<DashboardLojista>
  /** Dispara a campanha (`POST /api/v1/campanhas`). Rejeita em qualquer falha. */
  dispararCampanha(pedido: PedidoCampanha): Promise<Campanha>
}
