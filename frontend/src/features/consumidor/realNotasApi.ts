import { CODIGOS_NEGOCIO, NegocioError, type BeneficioHoje, type CodigoNegocio, type NotaHoje } from './types'
import type { Fetcher, NotasApi } from './notasApi'

function codigoNegocio(erro: unknown): CodigoNegocio | null {
  if (typeof erro !== 'object' || erro === null || !('status' in erro)) return null
  const { status, body } = erro as { status: unknown; body: unknown }
  if (status !== 409 && status !== 422) return null
  const codigo = typeof body === 'object' && body !== null ? (body as { codigo?: unknown }).codigo : undefined
  return CODIGOS_NEGOCIO.includes(codigo as CodigoNegocio) ? (codigo as CodigoNegocio) : null
}

/** Troca a rejeição do `fetcher` por `NegocioError` quando é uma regra conhecida. */
function converterErro(erro: unknown): never {
  const codigo = codigoNegocio(erro)
  if (codigo) throw new NegocioError(codigo)
  if (erro instanceof Error) throw erro
  throw new Error('Falha ao comunicar com o servidor.')
}

/** Implementação de `NotasApi` sobre o contrato da door 1 do plano (ORD-05/06). */
export function criarRealNotasApi(fetcher: Fetcher): NotasApi {
  return {
    async enviarNota(chave) {
      try {
        return await fetcher<NotaHoje>('/notas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chaveAcesso: chave }),
        })
      } catch (erro) {
        converterErro(erro)
      }
    },
    async listarNotasHoje() {
      return fetcher<NotaHoje[]>('/notas/hoje')
    },
    async beneficioHoje() {
      return fetcher<BeneficioHoje>('/beneficios/estacionamento/hoje')
    },
  }
}

/**
 * `fetcher` mínimo para esta branch, sem o Bearer: até o merge do ORD-03, que traz o
 * `apiFetch`, o backend real responderia 401. No merge, `criarNotasApi(apiFetch)`.
 */
export const fetchSemSessao: Fetcher = async <T,>(path: string, init?: RequestInit) => {
  const resposta = await fetch(`/api/v1${path}`, init)
  const texto = await resposta.text()
  const body: unknown = texto ? JSON.parse(texto) : null
  if (!resposta.ok) throw { status: resposta.status, body }
  return body as T
}
