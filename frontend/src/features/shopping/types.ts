/** Espelha o `ShoppingDashboardResponse` do backend campo a campo. */
export interface DashboardShopping {
  faturamentoTotal: number
  vouchersLiberados: number
  campanhasAtivas: number
  /** Da maior para a menor; só categorias com nota aprovada. */
  faturamentoPorCategoria: FaturamentoCategoria[]
}

export interface FaturamentoCategoria {
  categoria: string
  valor: number
}
