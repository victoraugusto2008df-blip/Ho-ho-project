// Testes dos checks `run analytics` da ORD-12 (`.specs/features/ord-12-portal-shopping/checks.md`).
// Cada teste nasce do texto do check, não da implementação. Os nomes e a ordem formam as linhas TAP
// que as provas leem: não renomeie nem reordene sem atualizar o checks.md no mesmo commit.
// Rodar: node --test --test-reporter=tap frontend/src/lib/analytics/

import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { ComplementoFicticio, DiaSemana, ShoppingDashboardDto } from './tipos.ts'
import {
  adesaoAoEstacionamento,
  formatarFaturamento,
  mapearDashboard,
  montarMapaHorario,
  percentuaisPorSetor,
  rodapeNotas,
  statusDosVouchers,
  ticketMedio,
  totalDasCampanhas,
} from './shoppingDashboardMapper.ts'

// O Intl separa o símbolo do valor com espaço não separável; a tela exibe exatamente isso.
const NBSP = ' '
const reais = (valor: string) => `R$${NBSP}${valor}`
const somaDosPercentuais = (percentuais: string[]) =>
  percentuais.reduce((soma, p) => soma + Number(p.replace('%', '').replace(',', '.')), 0).toFixed(1)

// Payload mínimo sem os campos que o DER não sustenta; valores escolhidos para não coincidir com a captura.
function dtoBase(): ShoppingDashboardDto {
  return {
    periodo: '7d',
    inicio: '2026-01-05',
    fim: '2026-01-11',
    faturamentoCentavos: 100000,
    notasCadastradas: 8,
    setores: [
      { nome: 'A', valorCentavos: 60000 },
      { nome: 'B', valorCentavos: 40000 },
    ],
    serieVolume: [{ data: '2026-01-05', hora: null, notas: 8 }],
    mapaHorario: [],
    vouchers: { emitidos: 10 },
    campanhas: [{ id: 1, nome: 'C', loja: 'L', segmento: 'S', ativa: true, descontoPercentual: 10 }],
  }
}

function complementoBase(): ComplementoFicticio {
  return {
    vouchers: { utilizados: 5, expirados: 3, pendentes: 2, saidasVeiculos: 1000, cpfsDistintos: 7 },
    campanhas: { 1: { enviados: 50, convertidos: 5, receitaCentavos: 20000, taxaShoppingCentavos: 1250 } },
  }
}

// C4 - AC 4
test('formata faturamento em pt-BR com sufixo mi acima de um milhao', () => {
  assert.equal(formatarFaturamento(250000000), `${reais('2,50')}${NBSP}mi`)
  assert.equal(formatarFaturamento(9990), reais('99,90'))
  assert.equal(formatarFaturamento(100000000), `${reais('1,00')}${NBSP}mi`)
})

// C5 - AC 5
test('percentuais por setor somam 100,0', () => {
  const tres = percentuaisPorSetor([50000, 30000, 20000], 100000)
  assert.deepEqual(tres, ['50,0%', '30,0%', '20,0%'])
  assert.equal(somaDosPercentuais(tres), '100.0')
  assert.deepEqual(percentuaisPorSetor([100000], 100000), ['100,0%'])
})

// C6 - AC 6
test('mapa horario cobre as 84 celulas de Seg a Dom', () => {
  const dias: DiaSemana[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
  const horas = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  // Um valor distinto por célula, entregue fora de ordem: prova posição e ordenação das 84.
  const celulas = dias
    .flatMap((diaSemana, d) => horas.map((hora) => ({ diaSemana, hora, notas: d * 100 + hora })))
    .reverse()
  const linhas = montarMapaHorario(celulas)
  assert.deepEqual(
    linhas.map((linha) => linha.dia),
    ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  )
  assert.equal(linhas.flatMap((linha) => linha.celulas).length, 84)
  linhas.forEach((linha, d) => {
    assert.deepEqual(
      linha.celulas.map((c) => c.hora),
      horas,
    )
    assert.deepEqual(
      linha.celulas.map((c) => c.notas),
      horas.map((hora) => d * 100 + hora),
    )
  })
  // Período com um só dia de dados ainda desenha as 84 células; as ausentes valem 0.
  const umDia = montarMapaHorario([{ diaSemana: 'SEX', hora: 10, notas: 5 }])
  assert.equal(umDia.flatMap((linha) => linha.celulas).length, 84)
  assert.equal(umDia[4].celulas[0].notas, 5)
  assert.equal(umDia.flatMap((linha) => linha.celulas).filter((c) => c.notas === 0).length, 83)
})

// C7 - AC 7
test('adesao de vouchers com uma casa decimal', () => {
  assert.equal(adesaoAoEstacionamento(300, 1200), '25,0%')
})

// C8 - AC 8
test('status dos vouchers com absoluto e percentual', () => {
  const status = statusDosVouchers({ emitidos: 2000, utilizados: 1500, expirados: 300, pendentes: 200 })
  assert.deepEqual(
    status.map((item) => [item.nome, item.valor, item.percentual]),
    [
      ['Utilizados', '1.500', '75,0%'],
      ['Expirados', '300', '15,0%'],
      ['Pendentes', '200', '10,0%'],
    ],
  )
})

// C9 - AC 9
test('total de campanhas ignora as inativas', () => {
  const total = totalDasCampanhas([
    { ativa: true, enviados: 100, convertidos: 10, receitaCentavos: 50000, taxaShoppingCentavos: 2500 },
    { ativa: true, enviados: 200, convertidos: 30, receitaCentavos: 70000, taxaShoppingCentavos: 7500 },
    { ativa: false, enviados: 999, convertidos: 99, receitaCentavos: 999999, taxaShoppingCentavos: 99999 },
  ])
  assert.deepEqual(total, {
    enviados: '300',
    convertidos: '40',
    receita: reais('1.200,00'),
    taxaShopping: reais('100,00'),
  })
})

// C10 - AC 10
test('faturamento zero nao divide por zero', () => {
  assert.deepEqual(percentuaisPorSetor([0, 0, 0], 0), ['0,0%', '0,0%', '0,0%'])
  const zerado = mapearDashboard(
    {
      ...dtoBase(),
      faturamentoCentavos: 0,
      setores: [
        { nome: 'A', valorCentavos: 0 },
        { nome: 'B', valorCentavos: 0 },
        { nome: 'C', valorCentavos: 0 },
      ],
    },
    complementoBase(),
  )
  assert.deepEqual(
    zerado.setores.map((s) => s.percentual),
    ['0,0%', '0,0%', '0,0%'],
  )
  assert.ok(zerado.setores.every((s) => Number.isFinite(s.proporcao)))
  // Lista vazia: o painel recebe nenhuma barra, e não uma barra de largura inválida.
  assert.deepEqual(mapearDashboard({ ...dtoBase(), setores: [] }, complementoBase()).setores, [])
})

// C11 - AC 11
test('saidas de veiculos zero devolve adesao zero', () => {
  assert.equal(adesaoAoEstacionamento(10, 0), '0,0%')
})

// C12 - AC 5
test('arredondamento preserva a soma em 100,0', () => {
  assert.deepEqual(percentuaisPorSetor([50000, 50000], 100000), ['50,0%', '50,0%'])
  // Arredondar cada parte isoladamente daria 16,7 + 16,7 + 66,7 = 100,1.
  const partes = percentuaisPorSetor([16650, 16650, 66700], 100000)
  assert.equal(somaDosPercentuais(partes), '100.0')
  assert.deepEqual(partes, ['16,7%', '16,6%', '66,7%'])
})

// C13 - AC 12
test('valor sem campo no DTO vem marcado como ficticio', () => {
  const semCampo = mapearDashboard(dtoBase(), complementoBase())
  assert.deepEqual(semCampo.estacionamento.saidas, { texto: '1.000', ficticio: true })
  assert.deepEqual(semCampo.estacionamento.cpfs, { texto: '7', ficticio: true })
  assert.equal(semCampo.estacionamento.status.ficticio, true)
  assert.equal(semCampo.estacionamento.status.itens[0].valor, '5')
  assert.equal(semCampo.campanhas.ficticio, true)
  assert.equal(semCampo.campanhas.linhas[0].enviados, '50')
  // A adesão é derivada das saídas: herda a marca.
  assert.deepEqual(semCampo.estacionamento.adesao, { texto: '1,0%', ficticio: true })

  const comCampo = mapearDashboard(
    {
      ...dtoBase(),
      vouchers: { emitidos: 10, utilizados: 6, expirados: 3, pendentes: 1, saidasVeiculos: 40, cpfsDistintos: 8 },
      campanhas: [
        {
          id: 1,
          nome: 'C',
          loja: 'L',
          segmento: 'S',
          ativa: true,
          descontoPercentual: 10,
          enviados: 20,
          convertidos: 2,
          receitaCentavos: 9000,
          taxaShoppingCentavos: 500,
        },
      ],
    },
    complementoBase(),
  )
  assert.deepEqual(comCampo.estacionamento.saidas, { texto: '40', ficticio: false })
  assert.deepEqual(comCampo.estacionamento.cpfs, { texto: '8', ficticio: false })
  assert.equal(comCampo.estacionamento.status.ficticio, false)
  assert.equal(comCampo.campanhas.ficticio, false)
  assert.equal(comCampo.campanhas.linhas[0].enviados, '20')
})

// C23 - AC 21
test('ticket medio e derivado de faturamento por notas', () => {
  assert.equal(ticketMedio(100000, 8), reais('125,00'))
  assert.equal(ticketMedio(100000, 3), reais('333,33'))
  // Um ticketMedioCentavos divergente no payload não chega à tela.
  const divergente = mapearDashboard({ ...dtoBase(), ticketMedioCentavos: 1 }, complementoBase())
  assert.equal(divergente.kpis.ticketMedio, reais('125,00'))
})

// C24 - AC 22
test('notas zero devolve ticket medio zero', () => {
  assert.equal(ticketMedio(100000, 0), reais('0,00'))
})

// C25 - AC 23
test('rodape do KPI de notas por periodo', () => {
  assert.equal(rodapeNotas('hoje', 7000), 'até o momento')
  assert.equal(rodapeNotas('7d', 7000), 'média de 1.000/dia')
  assert.equal(rodapeNotas('30d', 7500), 'média de 250/dia')
})
