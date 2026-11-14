/** Espelha o `DashboardResponse` do ORD-08 campo a campo. */
export interface DashboardLojista {
  ticketMedio: number
  benchmarkingDisponivel: boolean
  /** `null` quando a trava ReN05 (K-Anonymity, k < 3) bloqueia o benchmarking. */
  mediaCategoria: number | null
  horariosPico: HorarioPico[]
  diasPico: { diaSemana: number; total: number }[]
  crossShopping: CrossShopping[]
}

export interface HorarioPico {
  hora: number
  total: number
}

export interface CrossShopping {
  categoria: string
  total: number
}

/** Corpo proposto de `POST /api/v1/campanhas` (door 1 do plano); nunca leva `lojaId`. */
export interface PedidoCampanha {
  titulo: string
  descontoPercentual: number
  criterioAlvo: string
}

/** Resposta `201` proposta de `POST /api/v1/campanhas` (door 1). */
export interface Campanha extends PedidoCampanha {
  id: string
  publicoAtingido: number
  criadoEm: string
}

/** A campanha fixa do card "Nova campanha em 1 clique" (AD-017). */
export const CAMPANHA_PADRAO: PedidoCampanha = {
  titulo: 'Cupom 15% OFF',
  descontoPercentual: 15,
  criterioAlvo: 'INATIVOS_60_DIAS',
}
