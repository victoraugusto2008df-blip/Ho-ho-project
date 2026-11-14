import type { ComplementoFicticio, DiaSemana, Periodo, ShoppingDashboardDto } from './tipos.ts'

// Regras que mudam um valor exibido na Tela 3 (ORD-12). Módulo puro, sem React e sem dependência:
// o `node --test` o executa direto. Os critérios citados estão em
// `.specs/features/ord-12-portal-shopping/plan.md`.

const NBSP = ' '
const UM_MIL_EM_CENTAVOS = 100_000
const UM_MILHAO_EM_CENTAVOS = 100_000_000

const inteiro = new Intl.NumberFormat('pt-BR')
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const HORAS_DO_MAPA = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
export const NIVEIS_DO_MAPA = 7
const ORDEM_DOS_DIAS: DiaSemana[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
const ROTULO_DO_DIA: Record<DiaSemana, string> = {
  SEG: 'Seg',
  TER: 'Ter',
  QUA: 'Qua',
  QUI: 'Qui',
  SEX: 'Sex',
  SAB: 'Sáb',
  DOM: 'Dom',
}
/** Indexado por `Date.getUTCDay()`, que começa no domingo. */
const DIA_DA_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DIAS_DO_PERIODO: Record<Periodo, number> = { hoje: 1, '7d': 7, '30d': 30 }
/** O que a tela mostra no lugar de um número que não existe. */
const SEM_DADO = '—'

export interface ValorMarcado {
  texto: string
  ficticio: boolean
}

export function formatarInteiro(n: number): string {
  return inteiro.format(n)
}

export function formatarMoeda(centavos: number): string {
  return moeda.format(centavos / 100)
}

function formatarPercentual(valor: number): string {
  return `${umaCasa.format(valor)}%`
}

/** Critério 4: duas casas decimais, com sufixo `mi` a partir de um milhão de reais. */
export function formatarFaturamento(centavos: number): string {
  if (centavos < UM_MILHAO_EM_CENTAVOS) return formatarMoeda(centavos)
  return `R$${NBSP}${duasCasas.format(centavos / UM_MILHAO_EM_CENTAVOS)}${NBSP}mi`
}

/**
 * Formato curto que a captura desenha no valor de cada setor: `R$ 421,4 mil`. Arredonda antes de escolher
 * a unidade (C27): R$ 999.950,00 vira `R$ 1,00 mi`, e não `R$ 1.000,0 mil`.
 */
function formatarMoedaCurta(centavos: number): string {
  const decimosDeMil = Math.round(centavos / (UM_MIL_EM_CENTAVOS / 10))
  if (centavos >= UM_MILHAO_EM_CENTAVOS || decimosDeMil >= 10_000) {
    return `R$${NBSP}${duasCasas.format(centavos / UM_MILHAO_EM_CENTAVOS)}${NBSP}mi`
  }
  if (centavos >= UM_MIL_EM_CENTAVOS) return `R$${NBSP}${umaCasa.format(centavos / UM_MIL_EM_CENTAVOS)}${NBSP}mil`
  return formatarMoeda(centavos)
}

/**
 * Critérios 5 e 10: participação de cada valor no total, com uma casa decimal, somando exatamente o
 * que as partes somam (método do maior resto). Arredondar cada parte sozinha pode fechar em 100,1%.
 */
export function percentuaisPorSetor(valores: number[], total: number): string[] {
  if (total <= 0) return valores.map(() => formatarPercentual(0))
  // Em décimos de ponto percentual e com aritmética inteira, para o resto não sofrer erro de ponto flutuante.
  const partes = valores.map((valor) => ({
    decimos: Math.floor((valor * 1000) / total),
    resto: (valor * 1000) % total,
  }))
  const soma = valores.reduce((acumulado, valor) => acumulado + valor, 0)
  let sobra = Math.round((soma * 1000) / total) - partes.reduce((acumulado, p) => acumulado + p.decimos, 0)
  for (const parte of [...partes].sort((a, b) => b.resto - a.resto)) {
    if (sobra <= 0) break
    parte.decimos += 1
    sobra -= 1
  }
  return partes.map((parte) => formatarPercentual(parte.decimos / 10))
}

/** Critério 6: sempre 84 células, Seg a Dom por 10h a 21h; o que o payload não traz vale 0. */
export function montarMapaHorario(celulas: ShoppingDashboardDto['mapaHorario']) {
  const notas = new Map(celulas.map((c) => [`${c.diaSemana}-${c.hora}`, c.notas]))
  const grade = ORDEM_DOS_DIAS.map((dia) => ({
    dia: ROTULO_DO_DIA[dia],
    valores: HORAS_DO_MAPA.map((hora) => notas.get(`${dia}-${hora}`) ?? 0),
  }))
  const todos = grade.flatMap((linha) => linha.valores)
  const minimo = Math.min(...todos)
  const amplitude = Math.max(...todos) - minimo || 1
  return grade.map((linha) => ({
    dia: linha.dia,
    celulas: linha.valores.map((valor, i) => ({
      hora: HORAS_DO_MAPA[i],
      notas: valor,
      nivel: Math.min(NIVEIS_DO_MAPA - 1, Math.floor(((valor - minimo) / amplitude) * NIVEIS_DO_MAPA)),
    })),
  }))
}

/** Critérios 7 e 11. */
export function adesaoAoEstacionamento(emitidos: number, saidasVeiculos: number): string {
  return formatarPercentual(saidasVeiculos > 0 ? (emitidos / saidasVeiculos) * 100 : 0)
}

/**
 * Critério 8: valor absoluto e participação sobre os emitidos. A `proporcao` é a largura na barra
 * empilhada: sobre `emitidos`, ou sobre a soma dos status quando ela passa de `emitidos` (C29).
 */
export function statusDosVouchers(vouchers: {
  emitidos: number
  utilizados: number
  expirados: number
  pendentes: number
}) {
  const baseDaBarra = Math.max(vouchers.emitidos, vouchers.utilizados + vouchers.expirados + vouchers.pendentes)
  const itens = [
    ['Utilizados', vouchers.utilizados],
    ['Expirados', vouchers.expirados],
    ['Pendentes', vouchers.pendentes],
  ] as const
  return itens.map(([nome, valor]) => ({
    nome,
    valor: formatarInteiro(valor),
    percentual: formatarPercentual(vouchers.emitidos > 0 ? (valor / vouchers.emitidos) * 100 : 0),
    proporcao: baseDaBarra > 0 ? valor / baseDaBarra : 0,
  }))
}

interface MetricasDaCampanha {
  ativa: boolean
  enviados: number
  convertidos: number
  receitaCentavos: number
  taxaShoppingCentavos: number
}

/** Critério 9: só as campanhas ativas entram no total. */
export function totalDasCampanhas(campanhas: MetricasDaCampanha[]) {
  const ativas = campanhas.filter((campanha) => campanha.ativa)
  const somar = (campo: Exclude<keyof MetricasDaCampanha, 'ativa'>) =>
    ativas.reduce((soma, campanha) => soma + campanha[campo], 0)
  return {
    enviados: formatarInteiro(somar('enviados')),
    convertidos: formatarInteiro(somar('convertidos')),
    receita: formatarMoeda(somar('receitaCentavos')),
    taxaShopping: formatarMoeda(somar('taxaShoppingCentavos')),
  }
}

/**
 * Critérios 21 e 22: derivado de faturamento por notas, arredondado ao centavo. Nunca lê
 * `ticketMedioCentavos`: a origem desse valor ainda depende de alinhamento com o ORD-10 (issue #10).
 */
export function ticketMedio(faturamentoCentavos: number, notasCadastradas: number): string {
  return formatarMoeda(notasCadastradas > 0 ? Math.round(faturamentoCentavos / notasCadastradas) : 0)
}

/** Critério 23. */
export function rodapeNotas(periodo: Periodo, notasCadastradas: number): string {
  if (periodo === 'hoje') return 'até o momento'
  return `média de ${formatarInteiro(Math.round(notasCadastradas / DIAS_DO_PERIODO[periodo]))}/dia`
}

/** ROI = (receita - custo) / custo, com custo = desconto concedido + taxa do shopping. */
function retornoDaCampanha(receitaCentavos: number, taxaCentavos: number, descontoPercentual: number): string {
  const fracao = descontoPercentual / 100
  const desconto = (receitaCentavos * fracao) / (1 - fracao)
  const custo = desconto + taxaCentavos
  return `${formatarInteiro(Math.round(((receitaCentavos - custo) / custo) * 100))}%`
}

function diaMes(iso: string): string {
  const [, mes, dia] = iso.split('-')
  return `${dia}/${mes}`
}

function diaDaSemana(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return DIA_DA_SEMANA[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()]
}

/** Usa o valor do payload quando ele existe; senão, o da fixture, marcado como fictício (critério 12). */
function doPayloadOuFicticio<T>(doPayload: T | undefined, daFixture: T) {
  return doPayload === undefined ? { valor: daFixture, ficticio: true } : { valor: doPayload, ficticio: false }
}

function montarVolume(dto: ShoppingDashboardDto) {
  const pontos = dto.serieVolume.map((ponto) =>
    ponto.hora === null
      ? {
          rotulo: dto.periodo === '7d' ? diaDaSemana(ponto.data) : diaMes(ponto.data),
          dica: `${diaDaSemana(ponto.data)}, ${diaMes(ponto.data)}`,
          notas: ponto.notas,
        }
      : { rotulo: `${ponto.hora}h`, dica: `Hoje, ${ponto.hora}h–${ponto.hora + 1}h`, notas: ponto.notas },
  )
  // Quatro faixas no eixo, com o passo arredondado à ordem de grandeza: 2.879 notas dá 0 a 3.200, de 800 em 800.
  // A escala tem no mínimo 4; o pico é o maior ponto real, mesmo com menos de 4 notas (C28).
  const maiorNota = Math.max(0, ...pontos.map((ponto) => ponto.notas))
  const maior = Math.max(4, maiorNota)
  const ordem = 10 ** Math.floor(Math.log10(maior / 4))
  const passo = Math.ceil(maior / 4 / ordem) * ordem
  const pico = maiorNota > 0 ? pontos.findIndex((ponto) => ponto.notas === maiorNota) : -1
  return {
    subtitulo: dto.periodo === 'hoje' ? 'Notas por faixa horária · hoje' : `Notas por dia · últimos ${DIAS_DO_PERIODO[dto.periodo]} dias`,
    colunaDaTabela: dto.periodo === 'hoje' ? 'Horário' : 'Dia',
    pontos,
    passo,
    topo: passo * 4,
    pico: pico === -1 ? null : pico,
  }
}

export function mapearDashboard(dto: ShoppingDashboardDto, complemento: ComplementoFicticio) {
  const { vouchers } = dto

  const ordenados = [...dto.setores].sort((a, b) => b.valorCentavos - a.valorCentavos)
  const percentuais = percentuaisPorSetor(
    ordenados.map((setor) => setor.valorCentavos),
    dto.faturamentoCentavos,
  )
  const maiorSetor = ordenados[0]?.valorCentavos ?? 0
  const setores = ordenados.map((setor, i) => ({
    nome: setor.nome,
    valor: formatarMoedaCurta(setor.valorCentavos),
    percentual: percentuais[i],
    proporcao: maiorSetor > 0 ? setor.valorCentavos / maiorSetor : 0,
  }))

  const saidas = doPayloadOuFicticio(vouchers.saidasVeiculos, complemento.vouchers.saidasVeiculos)
  const cpfs = doPayloadOuFicticio(vouchers.cpfsDistintos, complemento.vouchers.cpfsDistintos)
  const status =
    vouchers.utilizados !== undefined && vouchers.expirados !== undefined && vouchers.pendentes !== undefined
      ? { valor: { utilizados: vouchers.utilizados, expirados: vouchers.expirados, pendentes: vouchers.pendentes }, ficticio: false }
      : { valor: complemento.vouchers, ficticio: true }
  const adesao: ValorMarcado = {
    texto: adesaoAoEstacionamento(vouchers.emitidos, saidas.valor),
    ficticio: saidas.ficticio,
  }

  // Sem os campos no payload, as métricas vêm da fixture e são fictícias (critério 12). Sem entrada na
  // fixture, a campanha não tem métrica: mostra `—` e fica fora do total (C26).
  const metricas = dto.campanhas.map((campanha) => {
    const { enviados, convertidos, receitaCentavos, taxaShoppingCentavos } = campanha
    const doPayload =
      enviados !== undefined && convertidos !== undefined && receitaCentavos !== undefined && taxaShoppingCentavos !== undefined
    const daFixture: ComplementoFicticio['campanhas'][string] | undefined = complemento.campanhas[campanha.id]
    const valores = doPayload ? { enviados, convertidos, receitaCentavos, taxaShoppingCentavos } : (daFixture ?? null)
    return { ...campanha, valores, ficticio: !doPayload && valores !== null }
  })
  const linhasDeCampanha = metricas
    .filter((campanha) => campanha.ativa)
    .map((campanha) => {
      const identificacao = {
        id: campanha.id,
        nome: campanha.nome,
        lojaSegmento: `${campanha.loja} · ${campanha.segmento}`,
      }
      const v = campanha.valores
      if (v === null) {
        return {
          ...identificacao,
          enviados: SEM_DADO,
          convertidos: SEM_DADO,
          conversao: null,
          receita: SEM_DADO,
          roi: SEM_DADO,
          taxaShopping: SEM_DADO,
        }
      }
      return {
        ...identificacao,
        enviados: formatarInteiro(v.enviados),
        convertidos: formatarInteiro(v.convertidos),
        conversao: formatarPercentual(v.enviados > 0 ? (v.convertidos / v.enviados) * 100 : 0),
        receita: formatarMoeda(v.receitaCentavos),
        roi:
          v.convertidos > 0
            ? retornoDaCampanha(v.receitaCentavos, v.taxaShoppingCentavos, campanha.descontoPercentual)
            : SEM_DADO,
        taxaShopping: formatarMoeda(v.taxaShoppingCentavos),
      }
    })

  const rotuloDoPeriodo =
    dto.periodo === 'hoje'
      ? `Hoje, ${diaMes(dto.fim)}`
      : `Últimos ${DIAS_DO_PERIODO[dto.periodo]} dias (${diaMes(dto.inicio)} a ${diaMes(dto.fim)})`

  return {
    periodo: dto.periodo,
    exibindo: rotuloDoPeriodo,
    vazio: dto.faturamentoCentavos === 0 && dto.notasCadastradas === 0,
    kpis: {
      faturamento: formatarFaturamento(dto.faturamentoCentavos),
      notas: formatarInteiro(dto.notasCadastradas),
      notasRodape: rodapeNotas(dto.periodo, dto.notasCadastradas),
      ticketMedio: ticketMedio(dto.faturamentoCentavos, dto.notasCadastradas),
      vouchers: formatarInteiro(vouchers.emitidos),
      vouchersRodape: { texto: `${adesao.texto} das saídas de veículos`, ficticio: adesao.ficticio },
    },
    setores,
    destaque: setores.length >= 2 ? { lider: setores[0], menor: setores[setores.length - 1] } : null,
    volume: montarVolume(dto),
    mapa: {
      subtitulo:
        dto.periodo === 'hoje' ? 'Hoje, por faixa horária' : `Média por dia da semana · últimos ${DIAS_DO_PERIODO[dto.periodo]} dias`,
      linhas: montarMapaHorario(dto.mapaHorario),
    },
    estacionamento: {
      emitidos: formatarInteiro(vouchers.emitidos),
      adesao,
      saidas: { texto: formatarInteiro(saidas.valor), ficticio: saidas.ficticio },
      cpfs: { texto: formatarInteiro(cpfs.valor), ficticio: cpfs.ficticio },
      status: {
        itens: statusDosVouchers({ emitidos: vouchers.emitidos, ...status.valor }),
        ficticio: status.ficticio,
      },
    },
    campanhas: {
      linhas: linhasDeCampanha,
      total: totalDasCampanhas(
        metricas.flatMap((campanha) => (campanha.valores === null ? [] : [{ ativa: campanha.ativa, ...campanha.valores }])),
      ),
      ficticio: metricas.some((campanha) => campanha.ativa && campanha.ficticio),
    },
  }
}

export type ModeloDoDashboard = ReturnType<typeof mapearDashboard>
