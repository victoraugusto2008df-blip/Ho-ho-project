import {
  META_ESTACIONAMENTO,
  NegocioError,
  type BeneficioHoje,
  type NotaHoje,
  type VoucherEstacionamento,
} from './types'
import { chaveValida, faltanteDaMeta, percentualDaMeta } from './regras'
import type { NotasApi } from './notasApi'

/**
 * Chaves determinísticas para a demonstração da banca. Todas têm 44 dígitos e o CNPJ
 * emissor nas posições 7 a 20, como na NFC-e. Os CNPJs válidos são lojas do seed do ORD-01.
 */
export const CHAVES_DEMO = {
  /** R$ 60,00 na Renner Shopping Hub. */
  VALIDA_60: '35261122222222000102650010000000011234567890',
  /** R$ 90,00 na Fast Shop; junto com a anterior atinge a meta. */
  VALIDA_90: '35261155555555000105650010000000021234567891',
  /** R$ 40,00 no Burger King; depois da meta, prova que não sai um 2º voucher. */
  VALIDA_40: '35261144444444000104650010000000051234567894',
  /** Já cadastrada: é a primeira nota histórica do seed do ORD-01 (ReN01). */
  DUPLICADA: '35261111111111000101650010000000010000000001',
  /** Emitida há mais de 72 horas (ReN02), em loja credenciada. */
  ANTIGA: '35261111111111000101650010000000031234567892',
  /** CNPJ emissor que não é loja ativa do shopping (RF03). */
  LOJA_NAO_CREDENCIADA: '35261199999999000199650010000000041234567893',
} as const

/** Ordem em que "Simular leitura de QR Code" preenche o campo. */
export const CICLO_SIMULACAO = [CHAVES_DEMO.VALIDA_60, CHAVES_DEMO.VALIDA_90, CHAVES_DEMO.VALIDA_40] as const

/** Lojas ativas do seed do ORD-01 (`V2__seed_demo_data.sql`), por CNPJ. */
const LOJAS_CREDENCIADAS: Record<string, { nome: string; categoria: string }> = {
  '11111111000101': { nome: 'Zara Shopping Hub', categoria: 'Vestuário' },
  '22222222000102': { nome: 'Renner Shopping Hub', categoria: 'Vestuário' },
  '33333333000103': { nome: 'Riachuelo Shopping Hub', categoria: 'Vestuário' },
  '44444444000104': { nome: 'Burger King', categoria: 'Alimentação' },
  '55555555000105': { nome: 'Fast Shop', categoria: 'Eletrônicos' },
}

const VALOR_POR_CHAVE: Record<string, number> = {
  [CHAVES_DEMO.VALIDA_60]: 60,
  [CHAVES_DEMO.VALIDA_90]: 90,
  [CHAVES_DEMO.VALIDA_40]: 40,
}
const VALOR_PADRAO = 40
const NOTAS_JA_CADASTRADAS = new Set<string>([CHAVES_DEMO.DUPLICADA])
const NOTAS_ANTIGAS = new Set<string>([CHAVES_DEMO.ANTIGA])
const CPF_MASCARADO_DEMO = '***.982.247-**'

const cnpjDaChave = (chave: string) => chave.slice(6, 20)

function codigoVoucher(): string {
  const bloco = () => Math.floor(1000 + Math.random() * 9000)
  return `EST-${bloco()}-${bloco()}`
}

/** Fechamento do shopping: 22h de segunda a sábado, 20h no domingo. */
function fechamentoDeHoje(agora: Date): Date {
  const fechamento = new Date(agora)
  fechamento.setHours(agora.getDay() === 0 ? 20 : 22, 0, 0, 0)
  return fechamento
}

function criarMockNotasApi(): NotasApi & { reiniciar(): void } {
  let notas: NotaHoje[] = []
  let voucher: VoucherEstacionamento | null = null

  const acumulado = () => Number(notas.reduce((total, nota) => total + nota.valor, 0).toFixed(2))

  return {
    async enviarNota(chave) {
      if (!chaveValida(chave)) throw new NegocioError('CHAVE_INVALIDA')
      if (NOTAS_JA_CADASTRADAS.has(chave) || notas.some((n) => n.chave === chave)) {
        throw new NegocioError('NOTA_DUPLICADA')
      }
      const loja = LOJAS_CREDENCIADAS[cnpjDaChave(chave)]
      if (!loja) throw new NegocioError('LOJA_NAO_CREDENCIADA')
      if (NOTAS_ANTIGAS.has(chave)) throw new NegocioError('NOTA_ANTIGA')

      const agora = new Date()
      const nota: NotaHoje = {
        chave,
        estabelecimento: loja.nome,
        categoria: loja.categoria,
        dataEmissao: agora.toISOString(),
        valor: VALOR_POR_CHAVE[chave] ?? VALOR_PADRAO,
        status: 'APROVADA',
      }
      notas = [nota, ...notas]

      // ReN04: no máximo um voucher por dia, emitido na primeira vez que a meta é atingida.
      if (!voucher && acumulado() >= META_ESTACIONAMENTO) {
        const codigo = codigoVoucher()
        voucher = {
          codigo,
          status: 'LIBERADO',
          emitidoEm: agora.toISOString(),
          validoAte: fechamentoDeHoje(agora).toISOString(),
          qrPayload: codigo,
        }
      }
      return nota
    },

    async listarNotasHoje() {
      return [...notas]
    },

    async beneficioHoje(): Promise<BeneficioHoje> {
      const valorAcumulado = acumulado()
      return {
        valorAcumulado,
        meta: META_ESTACIONAMENTO,
        percentual: percentualDaMeta(valorAcumulado),
        faltante: faltanteDaMeta(valorAcumulado),
        cpfMascarado: CPF_MASCARADO_DEMO,
        voucher,
      }
    },

    reiniciar() {
      notas = []
      voucher = null
    },
  }
}

export const mockNotasApi = criarMockNotasApi()
