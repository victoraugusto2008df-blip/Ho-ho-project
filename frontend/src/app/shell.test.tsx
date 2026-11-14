import { screen, waitFor } from '@testing-library/react'
import type { RouteObject } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireRole } from '@/features/auth/RequireRole'
import { PERFIS, ROLES, type Role } from '@/features/auth/types'
import { decodeSession } from '@/lib/jwt'
import { currentPath, renderApp } from '@/test/renderApp'
import { jsonResponse, makeToken, nowSeconds } from '@/test/helpers'
import { B2BShell } from './B2BShell'
import { AuthLayout, routes } from './routes'

function valid(role: Role, extra: { nome?: string; sub?: string } = {}) {
  return makeToken({ role, exp: nowSeconds() + 600, ...extra })
}

function storedRole(): Role {
  return decodeSession(JSON.parse(sessionStorage.getItem('hoho.session') ?? '{}').token).role
}

const aba = (role: Role) => PERFIS[role].aba
const menu = () => document.getElementById('menu-portal') as HTMLElement

describe('troca de perfil no shell', () => {
  it('C26 aba de perfil troca de perfil em 1 clique', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')
    for (const origem of ROLES) {
      for (const destino of ROLES.filter((r) => r !== origem)) {
        const { router, user, unmount } = renderApp({
          path: PERFIS[origem].rota,
          token: valid(origem),
        })

        await user.click(screen.getByRole('button', { name: aba(destino) }))

        await waitFor(() => expect(currentPath(router)).toBe(PERFIS[destino].rota))
        expect(storedRole()).toBe(destino)
        const ativa = screen.getByRole('button', { name: aba(destino) })
        expect(ativa.getAttribute('aria-current')).toBe('page')
        expect(screen.getByRole('button', { name: aba(origem) }).getAttribute('aria-current')).toBeNull()
        unmount()
        sessionStorage.clear()
      }
    }
  })

  it('C27 clicar no perfil ativo não faz nada', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    for (const role of ['CONSUMIDOR', 'LOJISTA'] as const) {
      const token = valid(role)
      const { router, user, unmount } = renderApp({ path: PERFIS[role].rota, token })

      await user.click(screen.getByRole('button', { name: aba(role) }))

      expect(fetchMock).not.toHaveBeenCalled()
      expect(currentPath(router)).toBe(PERFIS[role].rota)
      expect(sessionStorage.getItem('hoho.session')).toBe(JSON.stringify({ token }))
      unmount()
    }
  })

  it('C28 troca de perfil e sair esvaziam o cache', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')
    const { router, queryClient, user } = renderApp({ path: '/lojista', token: valid('LOJISTA') })
    queryClient.setQueryData(['dashboard'], { ticket: 142.3 })
    expect(queryClient.getQueryCache().getAll()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: aba('CONSUMIDOR') }))
    await waitFor(() => expect(currentPath(router)).toBe('/consumidor'))
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)

    queryClient.setQueryData(['voucher'], { codigo: 'EST-1' })
    await user.click(screen.getByRole('button', { name: 'Sair' }))
    await waitFor(() => expect(currentPath(router)).toBe('/acesso'))
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
  })

  it('C40 itens de perfil do shell ficam desabilitados durante a troca', async () => {
    const casos: Array<[Role, Role, Role]> = [
      ['CONSUMIDOR', 'LOJISTA', 'ADMIN_SHOPPING'],
      ['LOJISTA', 'CONSUMIDOR', 'ADMIN_SHOPPING'],
    ]
    for (const [origem, primeiro, segundo] of casos) {
      let release: (response: Response) => void = () => {}
      const fetchMock = vi.fn(() => new Promise<Response>((resolve) => (release = resolve)))
      vi.stubGlobal('fetch', fetchMock)
      const { user, unmount } = renderApp({ path: PERFIS[origem].rota, token: valid(origem) })

      await user.click(screen.getByRole('button', { name: aba(primeiro) }))

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      for (const role of ROLES) {
        expect((screen.getByRole('button', { name: aba(role) }) as HTMLButtonElement).disabled).toBe(true)
      }
      await user.click(screen.getByRole('button', { name: aba(segundo) }))
      expect(fetchMock).toHaveBeenCalledTimes(1)

      release(jsonResponse({ token: valid(primeiro) }))
      unmount()
      sessionStorage.clear()
    }
  })
})

describe('shell B2B', () => {
  it('C29 rodapé mostra nome ou sub e o perfil', () => {
    const comNome = renderApp({
      path: '/lojista',
      token: valid('LOJISTA', { nome: 'Passo Firme Calçados', sub: 'lojista@hoho.demo' }),
    })
    expect(screen.getByText('Passo Firme Calçados')).toBeTruthy()
    expect(screen.getByText('Perfil: LOJISTA')).toBeTruthy()
    comNome.unmount()

    const semNome = renderApp({ path: '/lojista', token: valid('LOJISTA', { sub: 'lojista@hoho.demo' }) })
    expect(screen.getByText('lojista@hoho.demo')).toBeTruthy()
    semNome.unmount()

    renderApp({ path: '/shopping', token: valid('ADMIN_SHOPPING', { nome: 'Administração Capim Dourado' }) })
    expect(screen.getByText('Perfil: ADMIN_SHOPPING')).toBeTruthy()
  })

  it('C30 gaveta abre no menu e fecha por item fora e Esc', async () => {
    const { user } = renderApp({ path: '/lojista', token: valid('LOJISTA') })
    const abrir = () => screen.getByRole('button', { name: 'Abrir menu' })
    expect(abrir().getAttribute('aria-expanded')).toBe('false')
    expect(menu().getAttribute('data-open')).toBe('false')

    await user.click(abrir())
    expect(abrir().getAttribute('aria-expanded')).toBe('true')
    expect(menu().getAttribute('data-open')).toBe('true')

    await user.click(screen.getByRole('button', { name: aba('LOJISTA') }))
    expect(menu().getAttribute('data-open')).toBe('false')

    await user.click(abrir())
    await user.click(screen.getByTestId('menu-overlay'))
    expect(menu().getAttribute('data-open')).toBe('false')

    await user.click(abrir())
    expect(menu().getAttribute('data-open')).toBe('true')
    await user.keyboard('{Escape}')
    expect(menu().getAttribute('data-open')).toBe('false')
    expect(abrir().getAttribute('aria-expanded')).toBe('false')
  })

  it('C33 sidebar renderiza handle.nav e omite a seção sem ele', () => {
    const comNav: RouteObject[] = [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/lojista',
            element: (
              <RequireRole role="LOJISTA">
                <B2BShell />
              </RequireRole>
            ),
            children: [
              {
                index: true,
                element: <p>conteúdo do portal</p>,
                handle: { nav: [{ label: 'Visão geral', to: '/lojista' }] },
              },
            ],
          },
        ],
      },
    ]
    const com = renderApp({ path: '/lojista', token: valid('LOJISTA'), routes: comNav })
    const portal = screen.getByRole('navigation', { name: 'Portal do Lojista' })
    expect(portal.querySelector('a')?.textContent).toBe('Visão geral')
    com.unmount()

    renderApp({ path: '/lojista', token: valid('LOJISTA'), routes })
    expect(screen.queryByRole('navigation', { name: 'Portal do Lojista' })).toBeNull()
  })
})

describe('sair', () => {
  it('C31 sair encerra a sessão e abre o acesso sem aviso', async () => {
    for (const role of ['CONSUMIDOR', 'LOJISTA'] as const) {
      const { router, queryClient, user, unmount } = renderApp({
        path: PERFIS[role].rota,
        token: valid(role),
      })
      queryClient.setQueryData(['x'], 1)

      await user.click(screen.getByRole('button', { name: 'Sair' }))

      await waitFor(() => expect(currentPath(router)).toBe('/acesso'))
      expect(sessionStorage.getItem('hoho.session')).toBeNull()
      expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
      expect(screen.queryByText('Sua sessão expirou. Entre novamente.')).toBeNull()
      unmount()
    }
  })
})
