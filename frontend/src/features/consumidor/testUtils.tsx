import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import type { NotasApi } from './notasApi'
import { NotasApiProvider } from './hooks'
import { PortalConsumidor } from './PortalConsumidor'
import type { BeneficioHoje, NotaHoje } from './types'

export function beneficio(parcial: Partial<BeneficioHoje> = {}): BeneficioHoje {
  return {
    valorAcumulado: 0,
    meta: 150,
    percentual: 0,
    faltante: 150,
    cpfMascarado: '***.982.247-**',
    voucher: null,
    ...parcial,
  }
}

export function nota(parcial: Partial<NotaHoje> = {}): NotaHoje {
  return {
    chave: '1'.repeat(44),
    estabelecimento: 'Renner Shopping Hub',
    categoria: 'Vestuário',
    dataEmissao: new Date().toISOString(),
    valor: 60,
    status: 'APROVADA',
    ...parcial,
  }
}

/** `NotasApi` simulado: cada método é um `vi.fn` que o teste pode trocar. */
export function apiFalsa(sobrescrever: Partial<NotasApi> = {}) {
  return {
    enviarNota: vi.fn<NotasApi['enviarNota']>(async (chave) => nota({ chave })),
    listarNotasHoje: vi.fn<NotasApi['listarNotasHoje']>(async () => []),
    beneficioHoje: vi.fn<NotasApi['beneficioHoje']>(async () => beneficio()),
    ...sobrescrever,
  }
}

export function renderPortal(api: NotasApi) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  const user = userEvent.setup()
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <NotasApiProvider api={api}>
        <PortalConsumidor />
      </NotasApiProvider>
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
