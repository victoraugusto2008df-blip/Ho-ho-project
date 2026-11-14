import { act, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PERFIS, ROLES, type Role } from '@/features/auth/types'
import { ApiError, apiFetch } from '@/lib/api'
import { decodeSession } from '@/lib/jwt'
import { currentPath, renderApp } from '@/test/renderApp'
import { jsonResponse, makeToken, nowSeconds } from '@/test/helpers'

const AVISO = 'Sua sessão expirou. Entre novamente.'

function valid(role: Role) {
  return makeToken({ role, exp: nowSeconds() + 600 })
}

function storedToken(): string {
  return JSON.parse(sessionStorage.getItem('hoho.session') ?? '{}').token
}

describe('rotas por perfil', () => {
  it('C10 rotas de portal sem sessão redirecionam para acesso', async () => {
    for (const rota of ['/consumidor', '/lojista', '/shopping']) {
      const { router, unmount } = renderApp({ path: rota })
      await waitFor(() => expect(currentPath(router)).toBe('/acesso'))
      unmount()
    }
  })

  it('C11 perfil errado redireciona para a rota do próprio perfil', async () => {
    for (const role of ROLES) {
      for (const alvo of ROLES.filter((r) => r !== role)) {
        const { router, unmount } = renderApp({ path: PERFIS[alvo].rota, token: valid(role) })
        await waitFor(() => expect(currentPath(router)).toBe(PERFIS[role].rota))
        unmount()
        sessionStorage.clear()
      }
    }
  })

  it('C12 raiz e rota inexistente redirecionam conforme a sessão', async () => {
    for (const rota of ['/', '/nao-existe']) {
      const semSessao = renderApp({ path: rota })
      await waitFor(() => expect(currentPath(semSessao.router)).toBe('/acesso'))
      semSessao.unmount()

      const comSessao = renderApp({ path: rota, token: valid('LOJISTA') })
      await waitFor(() => expect(currentPath(comSessao.router)).toBe('/lojista'))
      comSessao.unmount()
      sessionStorage.clear()
    }
  })

  it('C13 token vencido ou ilegível apaga a sessão e volta ao acesso', async () => {
    for (const token of [makeToken({ exp: nowSeconds() - 1 }), 'lixo']) {
      const { router, unmount } = renderApp({ path: '/lojista', token })
      await waitFor(() => expect(currentPath(router)).toBe('/acesso?motivo=expirado'))
      expect(sessionStorage.getItem('hoho.session')).toBeNull()
      expect(await screen.findByText(AVISO)).toBeTruthy()
      unmount()
    }

    const { router } = renderApp({ path: '/lojista', token: makeToken({ exp: nowSeconds() + 60 }) })
    await waitFor(() => expect(screen.getByText('ORD-11')).toBeTruthy())
    expect(currentPath(router)).toBe('/lojista')
  })

  it('C14 sessão sobrevive à remontagem do app', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')
    const primeira = renderApp({ path: '/acesso' })
    await primeira.user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))
    await waitFor(() => expect(currentPath(primeira.router)).toBe('/lojista'))
    primeira.unmount()

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const segunda = renderApp({ path: '/lojista' })

    expect(currentPath(segunda.router)).toBe('/lojista')
    expect(screen.getByText('Perfil: LOJISTA')).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('C15 grava só o token em sessionStorage', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')
    const { user, router } = renderApp({ path: '/acesso' })
    await user.click(screen.getByRole('button', { name: 'Entrar como Consumidor' }))
    await waitFor(() => expect(currentPath(router)).toBe('/consumidor'))

    const raw = sessionStorage.getItem('hoho.session') as string
    const token = JSON.parse(raw).token as string
    expect(raw).toBe(JSON.stringify({ token }))
    expect(decodeSession(token).role).toBe('CONSUMIDOR')
    expect(localStorage.length).toBe(0)
  })

  it('C18 401 da API encerra a sessão e volta ao acesso expirado', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, 401)))
    const unauthorized = vi.fn()
    window.addEventListener('hoho:unauthorized', unauthorized)
    const { router } = renderApp({ path: '/lojista', token: valid('LOJISTA') })

    let error: unknown
    await act(async () => {
      error = await apiFetch('/beneficios/estacionamento/hoje').catch((e: unknown) => e)
    })

    window.removeEventListener('hoho:unauthorized', unauthorized)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(401)
    expect(unauthorized).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    await waitFor(() => expect(currentPath(router)).toBe('/acesso?motivo=expirado'))
    expect(await screen.findByText(AVISO)).toBeTruthy()
  })

  it('C32 cada portal mostra o placeholder do seu card', async () => {
    const esperado: Record<Role, string> = {
      CONSUMIDOR: 'ORD-07',
      LOJISTA: 'ORD-11',
      ADMIN_SHOPPING: 'ORD-12',
    }
    for (const role of ROLES) {
      const { unmount } = renderApp({ path: PERFIS[role].rota, token: valid(role) })
      expect(screen.getAllByText(esperado[role])).toHaveLength(1)
      for (const outro of ROLES.filter((r) => r !== role)) {
        expect(screen.queryByText(esperado[outro])).toBeNull()
      }
      unmount()
      sessionStorage.clear()
    }
  })
})

describe('modo mock', () => {
  it('C37 modo mock cria sessão sem rede com exp de 8h', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-14T12:00:00Z'))
    const agora = Math.floor(Date.now() / 1000)
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    for (const role of ROLES) {
      const { router, user, unmount } = renderApp({ path: '/acesso' })
      await user.click(screen.getByRole('button', { name: PERFIS[role].entrar }))
      await waitFor(() => expect(currentPath(router)).toBe(PERFIS[role].rota))

      const session = decodeSession(storedToken())
      expect(session.role).toBe(role)
      expect(session.exp).toBe(agora + 8 * 60 * 60)
      unmount()
      sessionStorage.clear()
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('C38 sem a flag exata true o login usa a rede', async () => {
    for (const flag of [undefined, 'false', 'TRUE']) {
      if (flag !== undefined) vi.stubEnv('VITE_AUTH_MOCK', flag)
      const fetchMock = vi.fn(async () => jsonResponse({ token: makeToken({ role: 'LOJISTA' }) }))
      vi.stubGlobal('fetch', fetchMock)
      const { router, user, unmount } = renderApp({ path: '/acesso' })

      await user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))

      await waitFor(() => expect(currentPath(router)).toBe('/lojista'))
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect((fetchMock.mock.calls[0] as unknown as [string])[0]).toBe('/api/v1/auth/login')
      unmount()
      sessionStorage.clear()
      vi.unstubAllEnvs()
    }
  })
})
