import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiFetch } from '@/lib/api'
import { decodeSession } from '@/lib/jwt'
import { jsonResponse, makeToken, nowSeconds } from '@/test/helpers'

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function sentHeaders(fetchMock: ReturnType<typeof vi.fn>): Headers {
  return new Headers((fetchMock.mock.calls[0][1] as RequestInit).headers)
}

describe('apiFetch', () => {
  it('C16 apiFetch injeta Bearer só com sessão', async () => {
    const token = makeToken()
    sessionStorage.setItem('hoho.session', JSON.stringify({ token }))
    const comSessao = stubFetch(jsonResponse({ ok: true }))
    await apiFetch('/notas')
    expect(sentHeaders(comSessao).get('Authorization')).toBe(`Bearer ${token}`)

    sessionStorage.clear()
    const semSessao = stubFetch(jsonResponse({ ok: true }))
    await apiFetch('/notas')
    expect(sentHeaders(semSessao).has('Authorization')).toBe(false)
  })

  it('C17 apiFetch prefixa /api/v1', async () => {
    const fetchMock = stubFetch(jsonResponse({}))
    await apiFetch('/notas')
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/notas')
  })

  it('C20 403 mantém a sessão e a rota', async () => {
    const token = makeToken()
    sessionStorage.setItem('hoho.session', JSON.stringify({ token }))
    const listener = vi.fn()
    window.addEventListener('hoho:unauthorized', listener)
    stubFetch(jsonResponse({ erro: 'proibido' }, 403))

    const error = await apiFetch('/analytics/shopping/dashboard').catch((e: unknown) => e)

    window.removeEventListener('hoho:unauthorized', listener)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(403)
    expect(sessionStorage.getItem('hoho.session')).toBe(JSON.stringify({ token }))
    expect(listener).not.toHaveBeenCalled()
  })

  it('C21 apiFetch expõe status e body no ApiError', async () => {
    stubFetch(jsonResponse({ campo: 'valor' }, 422))
    const error = await apiFetch('/notas', { method: 'POST', body: '{}' }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(422)
    expect((error as ApiError).body).toEqual({ campo: 'valor' })

    stubFetch(jsonResponse({ total: 3 }))
    await expect(apiFetch('/notas')).resolves.toEqual({ total: 3 })
  })
})

describe('decodeSession', () => {
  it('C6 decodeSession valida role e exp', () => {
    expect(() => decodeSession(makeToken({ role: 'ADMIN' }))).toThrow()
    expect(() => decodeSession(makeToken({ exp: null }))).toThrow()
    const session = decodeSession(makeToken({ role: 'LOJISTA', exp: nowSeconds() + 60 }))
    expect(session.role).toBe('LOJISTA')
  })
})
