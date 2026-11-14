/** Meta do estacionamento grátis por CPF por dia (R$ 150,00). */
export const META_ESTACIONAMENTO = 150

/** Valor público da diária do estacionamento, exibido como economia no voucher. */
export const VALOR_DIARIA_ESTACIONAMENTO = 15

/** Nota aprovada do consumidor, como a tela a usa; `realNotasApi` a monta da resposta do backend. */
export interface NotaHoje {
  chave: string
  estabelecimento: string
  categoria: string
  /** Data e hora de emissão, ISO 8601. */
  dataEmissao: string
  valor: number
  status: 'APROVADA'
}

export type StatusVoucher = 'LIBERADO' | 'UTILIZADO' | 'EXPIRADO'

export interface VoucherEstacionamento {
  codigo: string
  status: StatusVoucher
  /** ISO 8601. */
  emitidoEm: string
  /** ISO 8601: até quando o voucher vale na cancela de saída. */
  validoAte: string
  /** Conteúdo do QR Code, que a cancela lê na saída. */
  qrPayload: string
}

/** Progresso e voucher do dia, como a tela os usa; vêm de `GET /beneficios/estacionamento/hoje`. */
export interface BeneficioHoje {
  valorAcumulado: number
  meta: number
  /** 0 a 100. A tela ainda limita o valor ao exibir. */
  percentual: number
  faltante: number
  cpfMascarado: string
  voucher: VoucherEstacionamento | null
}

/** Os `code` que o backend devolve ao rejeitar uma nota (`FiscalError`). */
export type CodigoNegocio =
  | 'NOTA_DUPLICADA'
  | 'NOTA_EXPIRADA_72H'
  | 'LOJA_NAO_CREDENCIADA'
  | 'CHAVE_INVALIDA'
  | 'CHAVE_NAO_ENCONTRADA'

export const CODIGOS_NEGOCIO: readonly CodigoNegocio[] = [
  'NOTA_DUPLICADA',
  'NOTA_EXPIRADA_72H',
  'LOJA_NAO_CREDENCIADA',
  'CHAVE_INVALIDA',
  'CHAVE_NAO_ENCONTRADA',
]

/** Erro de regra de negócio, com código estável para a UI escolher a mensagem. */
export class NegocioError extends Error {
  readonly codigo: CodigoNegocio

  constructor(codigo: CodigoNegocio, message: string = codigo) {
    super(message)
    this.name = 'NegocioError'
    this.codigo = codigo
  }
}
