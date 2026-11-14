import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { jsonResponse, makeToken, nowSeconds, stubBackend } from '@/test/helpers'
import { renderApp } from '@/test/renderApp'
import { PortalShopping } from './PortalShopping'
import type { DashboardShopping } from './types'

const ROTA = '/api/v1/analytics/shopping/dashboard'
const normalizar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
const cardDe = (titulo: string) => screen.getByText(titulo).closest('[aria-labelledby]') as HTMLElement

function dashboard(parcial: Partial<DashboardShopping> = {}): DashboardShopping {
  return {
    faturamentoTotal: 3150.4,
    vouchersLiberados: 1,
    campanhasAtivas: 2,
    faturamentoPorCategoria: [
      { categoria: 'Vestuário', valor: 2000 },
      { categoria: 'Alimentação', valor: 650.4 },
      { categoria: 'Eletrônicos', valor: 500 },
    ],
    ...parcial,
  }
}

/** Monta só a Tela 3, com o `fetch` respondendo o que `responder` devolver. */
function renderTela(responder: () => Response | Promise<Response>) {
  const fetchMock = vi.fn(responder)
  vi.stubGlobal('fetch', fetchMock)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const user = userEvent.setup()
  const view = render(
    <QueryClientProvider client={queryClient}>
      <PortalShopping />
    </QueryClientProvider>,
  )
  return { ...view, user, fetchMock }
}

describe('Tela 3 - Portal do Shopping', () => {
  it('SHOP-07 a rota do shopping monta a Tela 3 e chama o backend com o Bearer', async () => {
    const token = makeToken({ role: 'ADMIN_SHOPPING', exp: nowSeconds() + 600 })
    const fetchMock = stubBackend(() => jsonResponse(dashboard()))
    renderApp({ path: '/shopping', token })

    expect(await screen.findByRole('heading', { level: 1, name: 'Portal do Shopping' })).toBeTruthy()
    expect(await screen.findByText('R$ 3.150,40')).toBeTruthy()
    expect(screen.getByText('Perfil: ADMIN_SHOPPING')).toBeTruthy()
    expect(screen.queryByText('ORD-12')).toBeNull()
    expect(screen.queryByText('Conteúdo em construção.')).toBeNull()
    const chamadas = fetchMock.mock.calls.filter(([url]) => url === ROTA)
    expect(chamadas.length).toBeGreaterThan(0)
    for (const [, init] of chamadas) {
      expect(new Headers(init?.headers).get('Authorization')).toBe(`Bearer ${token}`)
    }
  })

  it('SHOP-08 indicadores mostram faturamento vouchers e campanhas', async () => {
    const primeira = renderTela(() => jsonResponse(dashboard({ vouchersLiberados: 7, campanhasAtivas: 3 })))
    const faturamento = cardDe('Faturamento identificado')
    expect(await within(faturamento).findByText('R$ 3.150,40')).toBeTruthy()
    expect(within(faturamento).getByText('soma das NFC-e validadas')).toBeTruthy()
    expect(normalizar(cardDe('Vouchers de estacionamento').textContent)).toBe('Vouchers de estacionamento7')
    expect(normalizar(cardDe('Campanhas ativas').textContent)).toBe('Campanhas ativas3')
    primeira.unmount()

    renderTela(() =>
      jsonResponse(dashboard({ faturamentoTotal: 0, vouchersLiberados: 0, campanhasAtivas: 0, faturamentoPorCategoria: [] })),
    )
    expect(await within(cardDe('Faturamento identificado')).findByText('R$ 0,00')).toBeTruthy()
    expect(normalizar(cardDe('Vouchers de estacionamento').textContent)).toBe('Vouchers de estacionamento0')
    expect(normalizar(cardDe('Campanhas ativas').textContent)).toBe('Campanhas ativas0')
  })

  it('SHOP-09 faturamento por segmento lista as categorias com barra proporcional', async () => {
    renderTela(() => jsonResponse(dashboard()))
    const card = cardDe('Faturamento consolidado por segmento')
    expect(within(card).getByText('Valor das NFC-e cadastradas no programa')).toBeTruthy()

    const linhas = await within(card).findAllByRole('listitem')
    expect(linhas.map((li) => normalizar(li.textContent))).toEqual([
      'VestuárioR$ 2.000,00',
      'AlimentaçãoR$ 650,40',
      'EletrônicosR$ 500,00',
    ])
    const larguras = within(card)
      .getAllByTestId('barra-segmento')
      .map((barra) => parseFloat(barra.style.width))
    expect(larguras[0]).toBe(100)
    // 650,40 / 2.000,00 = 32,52%, que a tela arredonda para porcentagem inteira.
    expect(larguras[1]).toBe(33)
    expect(larguras[2]).toBe(25)
  })

  it('SHOP-10 sem categorias mostra o estado vazio', async () => {
    renderTela(() => jsonResponse(dashboard({ faturamentoTotal: 0, faturamentoPorCategoria: [] })))
    const card = cardDe('Faturamento consolidado por segmento')
    expect(await within(card).findByText('Nenhuma nota cadastrada ainda.')).toBeTruthy()
    expect(within(card).queryAllByTestId('barra-segmento')).toHaveLength(0)
    expect(within(card).queryByRole('list')).toBeNull()
  })

  it('SHOP-11 indicadores e card mostram carregando', () => {
    renderTela(() => new Promise<Response>(() => {}))
    for (const titulo of [
      'Faturamento identificado',
      'Vouchers de estacionamento',
      'Campanhas ativas',
      'Faturamento consolidado por segmento',
    ]) {
      const card = cardDe(titulo)
      expect(card.getAttribute('aria-busy'), titulo).toBe('true')
      expect(within(card).getByRole('status', { name: 'Carregando…' }), titulo).toBeTruthy()
    }
    expect(screen.queryByText('R$ 0,00')).toBeNull()
  })

  it('SHOP-12 erro do dashboard mostra tentar novamente e recupera', async () => {
    let falhar = true
    const { user, fetchMock } = renderTela(() => (falhar ? jsonResponse({}, 500) : jsonResponse(dashboard())))

    const alertas = await screen.findAllByRole('alert')
    expect(alertas).toHaveLength(4)
    for (const alerta of alertas) {
      expect(alerta.textContent).toBe('Não foi possível carregar os dados do shopping.')
    }
    expect(screen.queryByText('R$ 3.150,40')).toBeNull()
    const chamadasAntes = fetchMock.mock.calls.length

    falhar = false
    await user.click(screen.getAllByRole('button', { name: 'Tentar novamente' })[0])

    expect(await screen.findByText('R$ 3.150,40')).toBeTruthy()
    expect(fetchMock.mock.calls.length).toBe(chamadasAntes + 1)
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull()
  })
})
