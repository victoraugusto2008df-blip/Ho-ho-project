import type { BeneficioHoje, NotaHoje } from './types'

/**
 * Contrato entre a Tela 1 e o backend (ORD-05 e ORD-06).
 * A implementação é trocada por configuração: o mock enquanto o backend não existe,
 * e a implementação real quando `VITE_BACKEND_CONSUMIDOR=true`.
 */
export interface NotasApi {
  /** Envia a chave de 44 dígitos. Lança `NegocioError` nas regras ReN01, ReN02, RF03 e RF01. */
  enviarNota(chave: string): Promise<NotaHoje>
  /** Notas aprovadas do consumidor emitidas hoje (ReN03). */
  listarNotasHoje(): Promise<NotaHoje[]>
  /** Acumulado, meta e voucher do estacionamento de hoje. */
  beneficioHoje(): Promise<BeneficioHoje>
  /** Só o mock: volta ao estado inicial da demonstração. */
  reiniciar?(): void
}

/**
 * Cliente HTTP que a implementação real recebe (door 2 do plano).
 * `path` é relativo a `/api/v1`; uma resposta não-2xx rejeita com `{ status, body }`,
 * a mesma forma do `ApiError` do `apiFetch` do ORD-03, que entra aqui no merge.
 */
export type Fetcher = <T>(path: string, init?: RequestInit) => Promise<T>

export interface FalhaHttp {
  status: number
  body: unknown
}
