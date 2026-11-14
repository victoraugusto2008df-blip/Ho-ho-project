import { act, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PERFIS, ROLES, type Role } from '@/features/auth/types'
import { ApiError, apiFetch } from '@/lib/api'
import { decodeSession } from '@/lib/jwt'
import { currentPath, renderApp } from '@/test/renderApp'
import { jsonResponse, loginCalls, makeToken, nowSeconds, stubBackend } from '@/test/helpers'

const AVISO = 'Sua sessão expirou. Entre novamente.'

function valid(role: Role) {
  return makeToken({ role, exp: nowSeconds() + 600 })
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
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Portal do Lojista' })).toBeTruthy())
    expect(currentPath(router)).toBe('/lojista')
  })

  it('C14 sessão sobrevive à remontagem do app', async () => {
    stubBackend()
    const primeira = renderApp({ path: '/acesso' })
    await primeira.user.click(screen.getByRole('button', { name: 'Entrar como Lojista' }))
    await waitFor(() => expect(currentPath(primeira.router)).toBe('/lojista'))
    primeira.unmount()

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const segunda = renderApp({ path: '/lojista' })

    expect(currentPath(segunda.router)).toBe('/lojista')
    expect(screen.getByText('Perfil: LOJISTA')).toBeTruthy()
    expect(loginCalls(fetchMock)).toHaveLength(0)
  })

  it('C15 grava só o token em sessionStorage', async () => {
    stubBackend()
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
    expect(unauthorized).toHaveBeenCalled()
    expect(sessionStorage.getItem('hoho.session')).toBeNull()
    await waitFor(() => expect(currentPath(router)).toBe('/acesso?motivo=expirado'))
    expect(await screen.findByText(AVISO)).toBeTruthy()
  })

  it('C32 cada portal mostra só a sua tela', async () => {
    const esperado: Record<Role, string> = {
      CONSUMIDOR: 'Cadastrar nota fiscal (NFC-e)',
      LOJISTA: 'Nova campanha em 1 clique',
      ADMIN_SHOPPING: 'Faturamento consolidado por segmento',
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
