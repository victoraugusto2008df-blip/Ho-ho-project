import type { LojistaApi } from './lojistaApi'
import type { Campanha, DashboardLojista } from './types'

const ATRASO_MS = 400
const PUBLICO_ATINGIDO = 312

const pausa = () => new Promise<void>((resolver) => setTimeout(resolver, ATRASO_MS))

// Horas 10h-21h na escala do mockup: 1.284 vendas, pico de 175 às 19h.
const VENDAS_POR_HORA = [28, 51, 103, 123, 98, 97, 110, 128, 165, 175, 139, 67]

/** `?benchmarking=bloqueado` na URL mostra a trava ReN05 na demonstração (só no mock). */
function benchmarkingBloqueado(): boolean {
  return new URLSearchParams(window.location.search).get('benchmarking') === 'bloqueado'
}

function dashboardMock(): DashboardLojista {
  const bloqueado = benchmarkingBloqueado()
  return {
    ticketMedio: 142.3,
    benchmarkingDisponivel: !bloqueado,
    mediaCategoria: bloqueado ? null : 210,
    horariosPico: VENDAS_POR_HORA.map((total, i) => ({ hora: 10 + i, total })),
    diasPico: [
      { diaSemana: 5, total: 310 },
      { diaSemana: 6, total: 402 },
    ],
    crossShopping: [
      { categoria: 'Alimentação', total: 796 },
      { categoria: 'Vestuário', total: 616 },
      { categoria: 'Esportes', total: 449 },
      { categoria: 'Eletrônicos', total: 270 },
      { categoria: 'Lazer', total: 180 },
      { categoria: 'Serviços', total: 116 },
    ],
  }
}

/** Campanhas disparadas na demonstração: só na memória, somem no F5. */
const campanhasDisparadas: Campanha[] = []

export const mockLojistaApi: LojistaApi = {
  async dashboard() {
    await pausa()
    return dashboardMock()
  },
  async dispararCampanha(pedido) {
    await pausa()
    const campanha: Campanha = {
      id: crypto.randomUUID(),
      titulo: pedido.titulo,
      descontoPercentual: pedido.descontoPercentual,
      criterioAlvo: pedido.criterioAlvo,
      publicoAtingido: PUBLICO_ATINGIDO,
      criadoEm: new Date().toISOString(),
    }
    campanhasDisparadas.push(campanha)
    return campanha
  },
}
