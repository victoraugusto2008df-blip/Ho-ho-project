import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PERFIS, ROLES, type Role } from '@/features/auth/types'
import { decodeSession } from '@/lib/jwt'
import { currentPath, renderApp } from '@/test/renderApp'
import { jsonResponse, loginCalls, makeToken, nowSeconds, stubBackend, stubLoginOnly } from '@/test/helpers'

const USUARIO_DO_SEED: Record<Role, string> = {
  CONSUMIDOR: 'consumidor@shopping.com',
  LOJISTA: 'lojista@shopping.com',
  ADMIN_SHOPPING: 'admin@shopping.com',
}

function storedToken(): string {
  return JSON.parse(sessionStorage.getItem('hoho.session') ?? '{}').token
}

const loginButtons = () =>
  ROLES.map((role) => screen.getByRole('button', { name: PERFIS[role].entrar }) as HTMLButtonElement)

describe('tela de acesso', () => {
  it('C1 mostra os 3 botões de acesso rápido', () => {
    renderApp({ path: '/acesso' })
    const names = screen.getAllByRole('button').map((button) => button.textContent)
    expect(names).toEqual(['Entrar como Consumidor', 'Entrar como Lojista', 'Entrar como Admin Shopping'])
  })

  it('INT-01 login real usa o usuário do seed de cada perfil', async () => {
    for (const role of ROLES) {
      const fetchMock = stubBackend()
      const { router, user, unmount } = renderApp({ path: '/acesso' })

      await user.click(screen.getByRole('button', { name: PERFIS[role].entrar }))

      await waitFor(() => expect(currentPath(router)).toBe(PERFIS[role].rota))
      const logins = loginCalls(fetchMock)
      expect(logins).toHaveLength(1)
      const [url, init] = logins[0]
      expect(url).toBe('/api/v1/auth/login')
      expect(init.method).toBe('POST')
      expect(JSON.parse(init.body as string)).toEqual({ email: USUARIO_DO_SEED[role], senha: 'demo123' })
      expect(new Headers(init.headers).has('Authorization')).toBe(false)

      // O token guardado é o que o login devolveu: o stub o emite com o e-mail enviado em `sub`.
      expect(decodeSession(storedToken()).sub).toBe(USUARIO_DO_SEED[role])
      expect(decodeSession(storedToken()).role).toBe(role)

      unmount()
      sessionStorage.clear()
    }
  })

  it('C3 desabilita os 3 botões enquanto o login está pendente', async () => {
    let release: (response: Response) => void = () => {}
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => (release = resolve)))
    vi.stubGlobal('fetch', fetchMock)
    const { user } = renderApp({ path: '/acesso' })

    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Entrando…' })).toBeTruthy())
    for (const button of screen.getAllByRole('button')) expect((button as HTMLButtonElement).disabled).toBe(true)
    await user.click(screen.getByRole('button', { name: 'Entrar como Consumidor' }))
    await user.click(screen.getByRole('button', { name: 'Entrando…' }))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    release(jsonResponse({ token: makeToken({ role: 'LOJISTA' }) }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  })

  it('C4 login 401 mostra erro e não cria sessão', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, 401)))
    const { user, router } = renderApp({ path: '/acesso' })

    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))

    expect((await screen.findByRole('alert')).textContent).toBe('Credenciais de demonstração inválidas.')
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    expect(currentPath(router)).toBe('/acesso')
    for (const button of loginButtons()) expect(button.disabled).toBe(false)
  })

  it('C5 falha de rede e 500 mostram a mensagem de cada caso', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))))
    const { user } = renderApp({ path: '/acesso' })

    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Não foi possível conectar ao servidor.')
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    for (const button of loginButtons()) expect(button.disabled).toBe(false)

    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, 500)))
    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toBe('Erro no servidor. Tente novamente.'),
    )
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    for (const button of loginButtons()) expect(button.disabled).toBe(false)
  })

  it('C7 token inválido no login mostra resposta de login inválida', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ token: makeToken({ role: 'ADMIN' }) })))
    const { user, router } = renderApp({ path: '/acesso' })

    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))

    expect((await screen.findByRole('alert')).textContent).toBe('Resposta de login inválida.')
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    expect(currentPath(router)).toBe('/acesso')

    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({})))
    await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('Resposta de login inválida.'))
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
  })

  it('C8 acesso com sessão válida redireciona para a rota do perfil', async () => {
    const { router } = renderApp({
      path: '/acesso',
      token: makeToken({ role: 'LOJISTA', exp: nowSeconds() + 600 }),
    })
    await waitFor(() => expect(currentPath(router)).toBe('/lojista'))
  })

  it('C9 mostra o aviso de sessão expirada só com motivo=expirado', () => {
    const aviso = 'Sua sessão expirou. Entre novamente.'
    const { unmount } = renderApp({ path: '/acesso?motivo=expirado' })
    expect(screen.getByText(aviso)).toBeTruthy()
    unmount()

    renderApp({ path: '/acesso' })
    expect(screen.queryByText(aviso)).toBeNull()
  })

  it('C19 401 do login não dispara o fluxo de sessão expirada', async () => {
    const token = makeToken({ role: 'LOJISTA', exp: nowSeconds() + 600 })
    stubLoginOnly(() => jsonResponse({}, 401))
    const unauthorized = vi.fn()
    window.addEventListener('hoho:unauthorized', unauthorized)
    const { user, router } = renderApp({ path: '/lojista', token })

    await user.click(screen.getByRole('button', { name: '1 · Consumidor' }))

    expect((await screen.findByRole('alert')).textContent).toBe('Credenciais de demonstração inválidas.')
    window.removeEventListener('hoho:unauthorized', unauthorized)
    expect(unauthorized).not.toHaveBeenCalled()
    expect(currentPath(router)).toBe('/lojista')
    expect(storedToken()).toBe(token)
  })
})
