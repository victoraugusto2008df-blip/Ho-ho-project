import { META_ESTACIONAMENTO, type CodigoNegocio, type NotaHoje } from './types'

/**
 * Percentual da meta, de 0 a 100. Só chega a 100 com a meta atingida: abaixo dela o valor é
 * truncado (R$ 149,99 → 99), para a tela nunca dizer "Meta atingida!" com valor faltando.
 */
export function percentualDaMeta(valorAcumulado: number, meta: number = META_ESTACIONAMENTO): number {
  if (meta <= 0 || valorAcumulado <= 0) return 0
  if (valorAcumulado >= meta) return 100
  return Math.floor((valorAcumulado / meta) * 100)
}

/** Limita um percentual vindo da API ao intervalo 0-100. */
export function limitarPercentual(percentual: number): number {
  if (!Number.isFinite(percentual)) return 0
  return Math.min(100, Math.max(0, percentual))
}

/** Quanto falta para liberar o voucher; zero quando a meta já foi atingida. */
export function faltanteDaMeta(valorAcumulado: number, meta: number = META_ESTACIONAMENTO): number {
  return Math.max(0, Number((meta - valorAcumulado).toFixed(2)))
}

export const TAMANHO_CHAVE = 44

/** Chave de acesso da NFC-e: exatamente 44 dígitos numéricos. */
export function chaveValida(chave: string): boolean {
  return /^\d{44}$/.test(chave)
}

/** Mantém só os dígitos digitados ou colados, no máximo 44. */
export function normalizarChave(entrada: string): string {
  return entrada.replace(/\D/g, '').slice(0, TAMANHO_CHAVE)
}

/** Exibe a chave em grupos de 4 dígitos, como impressa no cupom. */
export function agruparChave(chave: string): string {
  return chave.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** CPF com 11 dígitos e dígitos verificadores válidos; aceita com ou sem pontuação. */
export function cpfValido(entrada: string): boolean {
  const cpf = entrada.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const digito = (base: string) => {
    const soma = base.split('').reduce((total, d, i) => total + Number(d) * (base.length + 1 - i), 0)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return digito(cpf.slice(0, 9)) === Number(cpf[9]) && digito(cpf.slice(0, 10)) === Number(cpf[10])
}

/** Aplica a máscara 000.000.000-00 enquanto o consumidor digita. */
export function mascararCpf(entrada: string): string {
  const d = entrada.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
}

/** Mensagem exibida ao consumidor para cada erro de negócio (ReN01, ReN02, RF03, RF01). */
export const MENSAGEM_NEGOCIO: Record<CodigoNegocio, string> = {
  NOTA_DUPLICADA: 'Esta nota já foi cadastrada. Cada nota vale apenas uma vez.',
  NOTA_ANTIGA: 'Esta nota foi emitida há mais de 72 horas e não pode ser usada.',
  LOJA_NAO_CREDENCIADA: 'A loja emissora não participa do programa do shopping.',
  CHAVE_INVALIDA: 'A chave precisa ter 44 dígitos numéricos.',
}

/** Regra do documento de requisitos que cada código prova, exibida como pílula. */
export const REGRA_NEGOCIO: Record<CodigoNegocio, string> = {
  NOTA_DUPLICADA: 'ReN01',
  NOTA_ANTIGA: 'ReN02',
  LOJA_NAO_CREDENCIADA: 'RF03',
  CHAVE_INVALIDA: 'RF01',
}

export const MENSAGEM_CPF_INVALIDO = 'Informe um CPF válido.'
export const MENSAGEM_SEM_CONSENTIMENTO = 'Marque a autorização de uso dos dados (LGPD) para enviar a nota.'
export const MENSAGEM_FALHA_ENVIO = 'Não foi possível enviar a nota. Tente novamente.'

export function formatarReais(valor: number): string {
  // O Intl usa espaço não separável entre "R$" e o número; a tela usa o espaço comum.
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(valor)
    .replace(/ /g, ' ')
}

function doisDigitos(n: number): string {
  return String(n).padStart(2, '0')
}

/** Hora local `HH:mm` de uma data ISO. */
export function formatarHora(iso: string): string {
  const d = new Date(iso)
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`
}

/** "Hoje, 22:00 (fechamento)" no mesmo dia; "15/11, 20:00 (fechamento)" em outro dia. */
export function formatarValidoAte(iso: string, agora: Date = new Date()): string {
  const d = new Date(iso)
  const mesmoDia =
    d.getFullYear() === agora.getFullYear() && d.getMonth() === agora.getMonth() && d.getDate() === agora.getDate()
  const dia = mesmoDia ? 'Hoje' : `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}`
  return `${dia}, ${formatarHora(iso)} (fechamento)`
}

/** Notas da emissão mais recente para a mais antiga. */
export function ordenarNotas(notas: readonly NotaHoje[]): NotaHoje[] {
  return [...notas].sort((a, b) => new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime())
}

/** Cabeçalho da lista: "1 nota · R$ 60,00", "2 notas · R$ 150,00". */
export function resumoNotas(notas: readonly NotaHoje[]): string {
  const total = Number(notas.reduce((soma, nota) => soma + nota.valor, 0).toFixed(2))
  return `${notas.length} ${notas.length === 1 ? 'nota' : 'notas'} · ${formatarReais(total)}`
}
