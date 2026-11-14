import { complementoFicticio, payloadSimulado } from '@/lib/analytics/shoppingDashboardFixture'
import { mapearDashboard, type ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'
import type { Periodo, ShoppingDashboardDto } from '@/lib/analytics/tipos'

/**
 * Origem dos dados da Tela 3 (ORD-12). A página recebe um `DashboardClient`, o que permite trocar a
 * fixture local pelo endpoint do ORD-10 (issue #10) sem tocar em componente algum.
 */
export type DashboardClient = (periodo: Periodo, signal?: AbortSignal) => Promise<ModeloDoDashboard>

/** `sem-permissao` cobre `401` e `403` (critério 16); `falha` cobre `500`, rede e tempo esgotado (critério 15). */
export class ErroDoDashboard extends Error {
  readonly tipo: 'sem-permissao' | 'falha'
  readonly status?: number

  constructor(tipo: 'sem-permissao' | 'falha', status?: number) {
    super(tipo === 'sem-permissao' ? `Acesso negado ao dashboard (${status})` : 'Falha ao consultar o dashboard')
    this.name = 'ErroDoDashboard'
    this.tipo = tipo
    this.status = status
  }
}

const ROTA = '/api/v1/analytics/shopping/dashboard'
const LIMITE_EM_MS = 10_000

/**
 * Cliente do endpoint do ORD-10, pelo proxy `/api` do Vite (ADR-07). O `fetch` é injetável: o shell do
 * ORD-03 (issue #3) entrega aqui a versão que anexa o JWT, que esta feature não implementa.
 */
export function criarClienteHttp(buscar: typeof fetch = fetch): DashboardClient {
  return async (periodo, signal) => {
    const controle = new AbortController()
    const limite = setTimeout(() => controle.abort(), LIMITE_EM_MS)
    const repassarCancelamento = () => controle.abort()
    signal?.addEventListener('abort', repassarCancelamento)
    try {
      const resposta = await buscar(`${ROTA}?periodo=${periodo}`, {
        headers: { Accept: 'application/json' },
        signal: controle.signal,
      })
      if (resposta.status === 401 || resposta.status === 403) throw new ErroDoDashboard('sem-permissao', resposta.status)
      if (!resposta.ok) throw new ErroDoDashboard('falha', resposta.status)
      const dto = (await resposta.json()) as ShoppingDashboardDto
      // O que o DTO não traz vem da fixture e sai marcado como fictício (critério 12).
      return mapearDashboard(dto, complementoFicticio[periodo])
    } catch (erro) {
      if (erro instanceof ErroDoDashboard || signal?.aborted) throw erro
      throw new ErroDoDashboard('falha')
    } finally {
      clearTimeout(limite)
      signal?.removeEventListener('abort', repassarCancelamento)
    }
  }
}

/** Fixture local, no lugar do endpoint enquanto o ORD-10 não existe. Sai no commit que liga o endpoint. */
export const clienteFixture: DashboardClient = async (periodo) =>
  mapearDashboard(payloadSimulado[periodo], complementoFicticio[periodo])
