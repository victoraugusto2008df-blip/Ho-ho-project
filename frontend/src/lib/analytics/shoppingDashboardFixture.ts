import type { ComplementoFicticio, DiaSemana, Periodo, ShoppingDashboardDto } from './tipos.ts'

/**
 * Fixture local da Tela 3 (ORD-12) - TODOS OS VALORES SÃO FICTÍCIOS.
 *
 * `payloadSimulado` faz o papel do endpoint do ORD-10 (issue #10) enquanto ele não existe, e traz só
 * o que o DER atual sustenta. `complementoFicticio` traz o que o DER não sustenta; a tela o exibe
 * marcado como fictício (critério 12). Os dois saem quando o endpoint real estiver ligado.
 *
 * No período `7d`, os números reproduzem os visíveis na captura vinculante
 * `.specs/features/ord-12-portal-shopping/captures/portal-shopping.png`, para que a comparação de
 * imagem do C1 feche. Eles foram gerados pelo algoritmo do protótipo de onde a captura foi tirada,
 * com a data fixada em 13/11/2026 - nenhum critério de aceite usa esses valores.
 */

const HORAS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

function expandirMapa(linhas: Partial<Record<DiaSemana, number[]>>): ShoppingDashboardDto['mapaHorario'] {
  return Object.entries(linhas).flatMap(([diaSemana, notas]) =>
    (notas ?? []).map((n, i) => ({ diaSemana: diaSemana as DiaSemana, hora: HORAS[i], notas: n })),
  )
}

export const payloadSimulado: Record<Periodo, ShoppingDashboardDto> = {
  'hoje': {
    periodo: 'hoje',
    inicio: '2026-11-13',
    fim: '2026-11-13',
    faturamentoCentavos: 22167800,
    notasCadastradas: 2045,
    ticketMedioCentavos: 10840,
    setores: [
      { nome: 'Vestuário', valorCentavos: 6843620 },
      { nome: 'Alimentação', valorCentavos: 4409444 },
      { nome: 'Eletrônicos', valorCentavos: 3666882 },
      { nome: 'Calçados', valorCentavos: 2700888 },
      { nome: 'Esportes', valorCentavos: 2085748 },
      { nome: 'Serviços', valorCentavos: 1372056 },
      { nome: 'Lazer', valorCentavos: 1089162 },
    ],
    serieVolume: [
      { data: '2026-11-13', hora: 10, notas: 46 },
      { data: '2026-11-13', hora: 11, notas: 80 },
      { data: '2026-11-13', hora: 12, notas: 208 },
      { data: '2026-11-13', hora: 13, notas: 225 },
      { data: '2026-11-13', hora: 14, notas: 130 },
      { data: '2026-11-13', hora: 15, notas: 121 },
      { data: '2026-11-13', hora: 16, notas: 149 },
      { data: '2026-11-13', hora: 17, notas: 168 },
      { data: '2026-11-13', hora: 18, notas: 275 },
      { data: '2026-11-13', hora: 19, notas: 304 },
      { data: '2026-11-13', hora: 20, notas: 237 },
      { data: '2026-11-13', hora: 21, notas: 119 },
    ],
    mapaHorario: expandirMapa({
      SEX: [46, 80, 208, 225, 130, 121, 149, 168, 275, 304, 237, 119],
    }),
    vouchers: { emitidos: 214 },
    campanhas: [
      { id: 1, nome: 'Volta às compras 15%', loja: 'Passo Firme Calçados', segmento: 'Calçados', ativa: true, descontoPercentual: 15 },
      { id: 2, nome: 'Café + bolo 10%', loja: 'Sabor da Serra Café', segmento: 'Alimentação', ativa: true, descontoPercentual: 10 },
      { id: 3, nome: 'Coleção verão 20%', loja: 'Moda Cerrado', segmento: 'Vestuário', ativa: true, descontoPercentual: 20 },
      { id: 4, nome: 'Acessórios 12%', loja: 'TecnoPonto Eletrônicos', segmento: 'Eletrônicos', ativa: true, descontoPercentual: 12 },
    ],
  },
  '7d': {
    periodo: '7d',
    inicio: '2026-11-07',
    fim: '2026-11-13',
    faturamentoCentavos: 139149850,
    notasCadastradas: 13265,
    ticketMedioCentavos: 10490,
    setores: [
      { nome: 'Vestuário', valorCentavos: 42137460 },
      { nome: 'Alimentação', valorCentavos: 28202137 },
      { nome: 'Eletrônicos', valorCentavos: 23963891 },
      { nome: 'Calçados', valorCentavos: 16493875 },
      { nome: 'Esportes', valorCentavos: 12865031 },
      { nome: 'Serviços', valorCentavos: 8608314 },
      { nome: 'Lazer', valorCentavos: 6879142 },
    ],
    serieVolume: [
      { data: '2026-11-07', hora: null, notas: 2879 },
      { data: '2026-11-08', hora: null, notas: 2498 },
      { data: '2026-11-09', hora: null, notas: 1446 },
      { data: '2026-11-10', hora: null, notas: 1434 },
      { data: '2026-11-11', hora: null, notas: 1485 },
      { data: '2026-11-12', hora: null, notas: 1478 },
      { data: '2026-11-13', hora: null, notas: 2045 },
    ],
    mapaHorario: expandirMapa({
      SEG: [32, 63, 134, 149, 87, 94, 110, 141, 204, 191, 175, 86],
      TER: [34, 55, 148, 140, 88, 86, 102, 128, 192, 193, 174, 85],
      QUA: [32, 64, 152, 160, 87, 88, 115, 141, 180, 213, 193, 88],
      QUI: [33, 60, 129, 167, 90, 85, 110, 137, 195, 206, 190, 88],
      SEX: [48, 77, 214, 215, 128, 123, 147, 185, 243, 311, 234, 106],
      SAB: [72, 112, 252, 303, 179, 176, 220, 268, 388, 388, 337, 160],
      DOM: [53, 107, 242, 259, 152, 157, 191, 227, 331, 365, 267, 139],
    }),
    vouchers: { emitidos: 1612 },
    campanhas: [
      { id: 1, nome: 'Volta às compras 15%', loja: 'Passo Firme Calçados', segmento: 'Calçados', ativa: true, descontoPercentual: 15 },
      { id: 2, nome: 'Café + bolo 10%', loja: 'Sabor da Serra Café', segmento: 'Alimentação', ativa: true, descontoPercentual: 10 },
      { id: 3, nome: 'Coleção verão 20%', loja: 'Moda Cerrado', segmento: 'Vestuário', ativa: true, descontoPercentual: 20 },
      { id: 4, nome: 'Acessórios 12%', loja: 'TecnoPonto Eletrônicos', segmento: 'Eletrônicos', ativa: true, descontoPercentual: 12 },
    ],
  },
  '30d': {
    periodo: '30d',
    inicio: '2026-10-15',
    fim: '2026-11-13',
    faturamentoCentavos: 577245890,
    notasCadastradas: 56207,
    ticketMedioCentavos: 10270,
    setores: [
      { nome: 'Vestuário', valorCentavos: 170450320 },
      { nome: 'Alimentação', valorCentavos: 118794216 },
      { nome: 'Eletrônicos', valorCentavos: 97068040 },
      { nome: 'Calçados', valorCentavos: 74786154 },
      { nome: 'Esportes', valorCentavos: 53525723 },
      { nome: 'Serviços', valorCentavos: 32477457 },
      { nome: 'Lazer', valorCentavos: 30143980 },
    ],
    serieVolume: [
      { data: '2026-10-15', hora: null, notas: 1460 },
      { data: '2026-10-16', hora: null, notas: 2033 },
      { data: '2026-10-17', hora: null, notas: 3025 },
      { data: '2026-10-18', hora: null, notas: 2461 },
      { data: '2026-10-19', hora: null, notas: 1342 },
      { data: '2026-10-20', hora: null, notas: 1355 },
      { data: '2026-10-21', hora: null, notas: 1643 },
      { data: '2026-10-22', hora: null, notas: 1756 },
      { data: '2026-10-23', hora: null, notas: 1972 },
      { data: '2026-10-24', hora: null, notas: 2558 },
      { data: '2026-10-25', hora: null, notas: 2374 },
      { data: '2026-10-26', hora: null, notas: 1296 },
      { data: '2026-10-27', hora: null, notas: 1468 },
      { data: '2026-10-28', hora: null, notas: 1446 },
      { data: '2026-10-29', hora: null, notas: 1524 },
      { data: '2026-10-30', hora: null, notas: 2054 },
      { data: '2026-10-31', hora: null, notas: 2845 },
      { data: '2026-11-01', hora: null, notas: 2681 },
      { data: '2026-11-02', hora: null, notas: 1242 },
      { data: '2026-11-03', hora: null, notas: 1278 },
      { data: '2026-11-04', hora: null, notas: 1579 },
      { data: '2026-11-05', hora: null, notas: 1523 },
      { data: '2026-11-06', hora: null, notas: 2027 },
      { data: '2026-11-07', hora: null, notas: 2879 },
      { data: '2026-11-08', hora: null, notas: 2498 },
      { data: '2026-11-09', hora: null, notas: 1446 },
      { data: '2026-11-10', hora: null, notas: 1434 },
      { data: '2026-11-11', hora: null, notas: 1485 },
      { data: '2026-11-12', hora: null, notas: 1478 },
      { data: '2026-11-13', hora: null, notas: 2045 },
    ],
    mapaHorario: expandirMapa({
      SEG: [30, 58, 123, 137, 80, 86, 101, 130, 188, 176, 161, 79],
      TER: [33, 53, 143, 135, 85, 83, 98, 123, 185, 186, 168, 82],
      QUA: [33, 66, 157, 165, 90, 91, 119, 147, 186, 221, 199, 91],
      QUI: [34, 63, 135, 175, 94, 89, 115, 143, 205, 215, 199, 92],
      SEX: [48, 76, 212, 213, 126, 122, 146, 183, 241, 308, 231, 105],
      SAB: [70, 110, 248, 297, 176, 173, 216, 263, 381, 381, 331, 157],
      DOM: [53, 107, 242, 259, 152, 158, 191, 228, 332, 366, 267, 139],
    }),
    vouchers: { emitidos: 6540 },
    campanhas: [
      { id: 1, nome: 'Volta às compras 15%', loja: 'Passo Firme Calçados', segmento: 'Calçados', ativa: true, descontoPercentual: 15 },
      { id: 2, nome: 'Café + bolo 10%', loja: 'Sabor da Serra Café', segmento: 'Alimentação', ativa: true, descontoPercentual: 10 },
      { id: 3, nome: 'Coleção verão 20%', loja: 'Moda Cerrado', segmento: 'Vestuário', ativa: true, descontoPercentual: 20 },
      { id: 4, nome: 'Acessórios 12%', loja: 'TecnoPonto Eletrônicos', segmento: 'Eletrônicos', ativa: true, descontoPercentual: 12 },
    ],
  },
}

export const complementoFicticio: Record<Periodo, ComplementoFicticio> = {
  'hoje': {
    vouchers: { utilizados: 162, expirados: 0, pendentes: 52, saidasVeiculos: 2140, cpfsDistintos: 1690 },
    campanhas: {
      1: { enviados: 47, convertidos: 4, receitaCentavos: 48382, taxaShoppingCentavos: 1000 },
      2: { enviados: 144, convertidos: 25, receitaCentavos: 73125, taxaShoppingCentavos: 6250 },
      3: { enviados: 85, convertidos: 8, receitaCentavos: 121536, taxaShoppingCentavos: 2000 },
      4: { enviados: 39, convertidos: 2, receitaCentavos: 16896, taxaShoppingCentavos: 500 },
    },
  },
  '7d': {
    vouchers: { utilizados: 1336, expirados: 224, pendentes: 52, saidasVeiculos: 14980, cpfsDistintos: 9870 },
    campanhas: {
      1: { enviados: 253, convertidos: 24, receitaCentavos: 290292, taxaShoppingCentavos: 6000 },
      2: { enviados: 768, convertidos: 131, receitaCentavos: 383175, taxaShoppingCentavos: 32750 },
      3: { enviados: 454, convertidos: 41, receitaCentavos: 622872, taxaShoppingCentavos: 10250 },
      4: { enviados: 208, convertidos: 13, receitaCentavos: 109824, taxaShoppingCentavos: 3250 },
    },
  },
  '30d': {
    vouchers: { utilizados: 5701, expirados: 787, pendentes: 52, saidasVeiculos: 61200, cpfsDistintos: 31450 },
    campanhas: {
      1: { enviados: 790, convertidos: 74, receitaCentavos: 895067, taxaShoppingCentavos: 18500 },
      2: { enviados: 2400, convertidos: 410, receitaCentavos: 1199250, taxaShoppingCentavos: 102500 },
      3: { enviados: 1420, convertidos: 128, receitaCentavos: 1944576, taxaShoppingCentavos: 32000 },
      4: { enviados: 650, convertidos: 41, receitaCentavos: 346368, taxaShoppingCentavos: 10250 },
    },
  },
}
