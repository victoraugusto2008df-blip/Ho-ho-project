import { formatarReais } from '@/features/consumidor/regras'
import type { CrossShopping, DashboardLojista, HorarioPico } from './types'

export { formatarReais }

export const LIMITE_CROSS_SHOPPING = 6

export const MENSAGEM_ERRO_DASHBOARD = 'Não foi possível carregar os dados da sua loja.'
export const MENSAGEM_FALHA_CAMPANHA = 'Não foi possível disparar a campanha. Tente novamente.'

/**
 * Trava ReN05: a média só vale com `benchmarkingDisponivel` verdadeiro e número. Qualquer
 * outra combinação bloqueia, e a tela nunca lê `mediaCategoria` fora deste caso.
 */
export function benchmarkingLiberado(
  dashboard: Pick<DashboardLojista, 'benchmarkingDisponivel' | 'mediaCategoria'>,
): dashboard is { benchmarkingDisponivel: true; mediaCategoria: number } {
  return dashboard.benchmarkingDisponivel === true && typeof dashboard.mediaCategoria === 'number'
}

/** `(ticket - média) / média × 100` com uma casa decimal; `null` sem média positiva. */
export function gapDoTicket(ticketMedio: number, mediaCategoria: number): number | null {
  if (!(mediaCategoria > 0)) return null
  const bruto = ((ticketMedio - mediaCategoria) / mediaCategoria) * 100
  // Arredonda a magnitude e reaplica o sinal: meio ponto não depende de ser ganho ou perda.
  const magnitude = Math.round(Math.abs(bruto) * 10 + 1e-9) / 10
  return magnitude === 0 ? 0 : bruto < 0 ? -magnitude : magnitude
}

/** "-32,2%", "+8,3%", "0,0%". */
export function formatarGap(gap: number): string {
  const numero = Math.abs(gap).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${gap > 0 ? '+' : gap < 0 ? '-' : ''}${numero}%`
}

export interface BarraHora {
  hora: number
  rotulo: string
  total: number
}

/** Uma barra por hora, da menor à maior devolvida, com 0 nas horas do meio que faltam. */
export function preencherHoras(horarios: readonly HorarioPico[]): BarraHora[] {
  if (horarios.length === 0) return []
  const porHora = new Map(horarios.map((h) => [h.hora, h.total]))
  const horas = horarios.map((h) => h.hora)
  const menor = Math.min(...horas)
  const maior = Math.max(...horas)
  const barras: BarraHora[] = []
  for (let hora = menor; hora <= maior; hora++) {
    barras.push({ hora, rotulo: `${hora}h`, total: porHora.get(hora) ?? 0 })
  }
  return barras
}

export interface ResumoPico {
  hora: number
  total: number
  totalGeral: number
  percentual: number
  texto: string
}

/** Hora de maior `total` (empate: a mais cedo) e a legenda do gráfico. */
export function resumoDoPico(horarios: readonly HorarioPico[]): ResumoPico | null {
  const barras = preencherHoras(horarios)
  if (barras.length === 0) return null
  const pico = barras.reduce((melhor, barra) => (barra.total > melhor.total ? barra : melhor))
  const totalGeral = barras.reduce((soma, barra) => soma + barra.total, 0)
  const percentual = totalGeral > 0 ? Math.round((pico.total / totalGeral) * 1000) / 10 : 0
  const percentualTexto = percentual.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const vendas = `${pico.total.toLocaleString('pt-BR')} ${pico.total === 1 ? 'venda' : 'vendas'}`
  return {
    hora: pico.hora,
    total: pico.total,
    totalGeral,
    percentual,
    texto: `Pico às ${pico.hora}h–${(pico.hora + 1) % 24}h com ${vendas} (${percentualTexto}% do total de ${totalGeral.toLocaleString('pt-BR')}).`,
  }
}

/** As maiores categorias por `total` decrescente (empate por nome), no máximo `limite`. */
export function topCrossShopping(
  lista: readonly CrossShopping[],
  limite: number = LIMITE_CROSS_SHOPPING,
): CrossShopping[] {
  return [...lista]
    .sort((a, b) => b.total - a.total || a.categoria.localeCompare(b.categoria, 'pt-BR'))
    .slice(0, limite)
}

/** Largura da barra, em % da maior. */
export function larguraProporcional(total: number, maior: number): number {
  return maior > 0 ? Math.round((total / maior) * 100) : 0
}

export function rotuloCompras(total: number): string {
  return `${total.toLocaleString('pt-BR')} ${total === 1 ? 'compra' : 'compras'}`
}

export function mensagemCampanha(publicoAtingido: number): string {
  if (publicoAtingido <= 0) return 'Campanha registrada, mas nenhum cliente está no segmento agora.'
  const clientes = `${publicoAtingido.toLocaleString('pt-BR')} ${publicoAtingido === 1 ? 'cliente' : 'clientes'}`
  return `Campanha disparada! Cupom de 15% OFF enviado a ${clientes}.`
}
