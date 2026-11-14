import { apiFetch } from '@/lib/api'
import type { Fetcher, NotasApi } from './notasApi'
import { fechamentoDeHoje } from './regras'
import {
  CODIGOS_NEGOCIO,
  NegocioError,
  type BeneficioHoje,
  type CodigoNegocio,
  type NotaHoje,
  type StatusVoucher,
} from './types'

/** `NotaResponse` do backend. */
interface NotaBackend {
  chaveAcesso: string
  valorTotal: number
  dataEmissao: string
  status: 'APROVADA'
  estabelecimento: string
  categoria: string
}

/** `EstacionamentoHojeResponse` do backend. */
interface BeneficioBackend {
  valorAcumulado: number
  meta: number
  percentual: number
  valorFaltante: number
  cpfMascarado: string
  voucher: { codigoQr: string; status: StatusVoucher; criadoEm: string } | null
}

function paraNota(nota: NotaBackend): NotaHoje {
  return {
    chave: nota.chaveAcesso,
    estabelecimento: nota.estabelecimento,
    categoria: nota.categoria,
    dataEmissao: nota.dataEmissao,
    valor: nota.valorTotal,
    status: nota.status,
  }
}

function paraBeneficio(beneficio: BeneficioBackend): BeneficioHoje {
  const { voucher } = beneficio
  return {
    valorAcumulado: beneficio.valorAcumulado,
    meta: beneficio.meta,
    percentual: beneficio.percentual,
    faltante: beneficio.valorFaltante,
    cpfMascarado: beneficio.cpfMascarado,
    voucher: voucher && {
      codigo: voucher.codigoQr,
      status: voucher.status,
      emitidoEm: voucher.criadoEm,
      // O backend não guarda validade: o voucher vale até o fechamento do shopping no dia.
      validoAte: fechamentoDeHoje().toISOString(),
      qrPayload: voucher.codigoQr,
    },
  }
}

/** O `code` do corpo de erro do backend (`{ code, message }`), quando é uma regra conhecida. */
function codigoNegocio(erro: unknown): CodigoNegocio | null {
  if (typeof erro !== 'object' || erro === null || !('body' in erro)) return null
  const { body } = erro as { body: unknown }
  const code = typeof body === 'object' && body !== null ? (body as { code?: unknown }).code : undefined
  return CODIGOS_NEGOCIO.includes(code as CodigoNegocio) ? (code as CodigoNegocio) : null
}

/** Implementação de `NotasApi` sobre o backend, com o cliente HTTP dado. */
export function criarRealNotasApi(fetcher: Fetcher): NotasApi {
  return {
    async enviarNota(chave) {
      try {
        return paraNota(
          await fetcher<NotaBackend>('/notas', { method: 'POST', body: JSON.stringify({ chaveAcesso: chave }) }),
        )
      } catch (erro) {
        const codigo = codigoNegocio(erro)
        if (codigo) throw new NegocioError(codigo)
        throw erro
      }
    },
    async listarNotasHoje() {
      return (await fetcher<NotaBackend[]>('/notas/hoje')).map(paraNota)
    },
    async beneficioHoje() {
      return paraBeneficio(await fetcher<BeneficioBackend>('/beneficios/estacionamento/hoje'))
    },
  }
}

/** A `NotasApi` do app: o backend, pelo `apiFetch` (Bearer da sessão). */
export const notasApi: NotasApi = criarRealNotasApi(apiFetch)
