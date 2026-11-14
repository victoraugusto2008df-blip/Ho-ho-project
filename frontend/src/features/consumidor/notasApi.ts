import type { BeneficioHoje, NotaHoje } from './types'

/** O que a Tela 1 precisa do backend (ORD-05 e ORD-06). A implementação é `realNotasApi`. */
export interface NotasApi {
  /** Envia a chave de 44 dígitos. Lança `NegocioError` quando o backend rejeita por regra. */
  enviarNota(chave: string): Promise<NotaHoje>
  /** Notas aprovadas do consumidor emitidas hoje (ReN03). */
  listarNotasHoje(): Promise<NotaHoje[]>
  /** Acumulado, meta e voucher do estacionamento de hoje. */
  beneficioHoje(): Promise<BeneficioHoje>
}

/**
 * Cliente HTTP que a implementação recebe: o `apiFetch`, que põe o Bearer da sessão.
 * `path` é relativo a `/api/v1`; uma resposta não-2xx rejeita com `{ status, body }` (`ApiError`).
 */
export type Fetcher = <T>(path: string, init?: RequestInit) => Promise<T>
