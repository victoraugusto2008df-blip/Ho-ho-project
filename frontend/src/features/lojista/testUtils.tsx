import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { LojistaApiProvider } from './hooks'
import type { LojistaApi } from './lojistaApi'
import { PortalLojista } from './PortalLojista'
import type { Campanha, DashboardLojista } from './types'

export function dashboard(parcial: Partial<DashboardLojista> = {}): DashboardLojista {
  return {
    ticketMedio: 142.3,
    benchmarkingDisponivel: true,
    mediaCategoria: 210,
    horariosPico: [
      { hora: 10, total: 5 },
      { hora: 13, total: 2 },
    ],
    diasPico: [],
    crossShopping: [{ categoria: 'Alimentação', total: 4 }],
    ...parcial,
  }
}

export function campanha(parcial: Partial<Campanha> = {}): Campanha {
  return {
    id: '7d1c2f3a-0000-4000-8000-000000000001',
    titulo: 'Cupom 15% OFF',
    descontoPercentual: 15,
    criterioAlvo: 'INATIVOS_60_DIAS',
    publicoAtingido: 312,
    criadoEm: '2026-11-14T12:00:00Z',
    ...parcial,
  }
}

/** `LojistaApi` simulado: cada método é um `vi.fn` que o teste pode trocar. */
export function apiFalsa(sobrescrever: Partial<LojistaApi> = {}) {
  return {
    dashboard: vi.fn<LojistaApi['dashboard']>(async () => dashboard()),
    dispararCampanha: vi.fn<LojistaApi['dispararCampanha']>(async () => campanha()),
    ...sobrescrever,
  }
}

export function renderPortal(api: LojistaApi) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  const user = userEvent.setup()
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <LojistaApiProvider api={api}>
        <PortalLojista />
      </LojistaApiProvider>
    </QueryClientProvider>,
  )
  return { ...utils, user, queryClient }
}

/** Promessa controlada pelo teste, para observar estados pendentes. */
export function adiada<T>() {
  let resolver!: (valor: T) => void
  let rejeitar!: (erro: unknown) => void
  const promessa = new Promise<T>((res, rej) => {
    resolver = res
    rejeitar = rej
  })
  return { promessa, resolver, rejeitar }
}

/**
 * O jsdom não mede nada, e o `ResponsiveContainer` do Recharts só desenha com tamanho:
 * fixa o retângulo de todo elemento e entrega um `ResizeObserver` inerte.
 */
export function fixarTamanhoDosGraficos() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 640,
    bottom: 260,
    width: 640,
    height: 260,
    toJSON: () => ({}),
  })
}
