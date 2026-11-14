/**
 * Contrato PROVISÓRIO do dashboard do shopping, consumido pela Tela 3 (ORD-12).
 *
 * O endpoint `GET /api/v1/analytics/shopping/dashboard` é do ORD-10 (issue #10). Este formato é a
 * proposta registrada em `.specs/features/ord-12-portal-shopping/plan.md` (`## Landing`) e ainda não
 * foi acordado com o dono do endpoint. Os campos opcionais são os que o ORD-10 ainda não confirmou
 * entregar: sem eles, a tela usa a fixture local e marca o valor como fictício (critério 12). O DER
 * sustenta a quebra de vouchers por status e os CPFs distintos, mas não as saídas de veículos nem as
 * métricas por campanha; a decisão do que o ORD-10 entrega está com o Lucas.
 */

export type Periodo = 'hoje' | '7d' | '30d'

export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM'

export interface ShoppingDashboardDto {
  periodo: Periodo
  /** Primeiro dia do período, `YYYY-MM-DD`. */
  inicio: string
  /** Último dia do período, `YYYY-MM-DD`. */
  fim: string
  faturamentoCentavos: number
  notasCadastradas: number
  /** Informativo: a tela deriva o ticket médio (critério 21). A origem é decisão pendente com o ORD-10. */
  ticketMedioCentavos?: number
  setores: { nome: string; valorCentavos: number }[]
  /** Notas por dia; no período `hoje`, por faixa horária, com `hora` de 10 a 21. */
  serieVolume: { data: string; hora: number | null; notas: number }[]
  mapaHorario: { diaSemana: DiaSemana; hora: number; notas: number }[]
  vouchers: {
    emitidos: number
    utilizados?: number
    expirados?: number
    pendentes?: number
    saidasVeiculos?: number
    cpfsDistintos?: number
  }
  campanhas: {
    /** `uuid`, como `CAMPANHAS.id` no DER (decisão D10 do usuário; pendente de confirmação com o ORD-10). */
    id: string
    nome: string
    loja: string
    segmento: string
    ativa: boolean
    descontoPercentual: number
    enviados?: number
    convertidos?: number
    receitaCentavos?: number
    taxaShoppingCentavos?: number
  }[]
}

/** Valores que o payload ainda não traz: vêm da fixture local e a tela os marca como fictícios (critério 12). */
export interface ComplementoFicticio {
  vouchers: {
    utilizados: number
    expirados: number
    pendentes: number
    saidasVeiculos: number
    cpfsDistintos: number
  }
  /** Indexado pelo `uuid` da campanha. */
  campanhas: Record<
    string,
    { enviados: number; convertidos: number; receitaCentavos: number; taxaShoppingCentavos: number }
  >
}
