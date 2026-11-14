import { clearToken, readToken } from '@/features/auth/sessionStore'

export const UNAUTHORIZED_EVENT = 'hoho:unauthorized'

const API_PREFIX = '/api/v1'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`Erro ${status} na API`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text === '') return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Cliente HTTP único do frontend. `path` é relativo a `/api/v1`.
 * Injeta o Bearer da sessão; um 401 com sessão a encerra e avisa o app.
 * As rotas `/auth/*` são públicas: sem Bearer e sem encerrar a sessão no 401.
 */
export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const isPublic = path.startsWith('/auth/')
  const token = isPublic ? null : readToken()

  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_PREFIX}${path}`, { ...init, headers })
  const body = await readBody(response)

  if (!response.ok) {
    if (response.status === 401 && token !== null) {
      clearToken()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(response.status, body)
  }
  return body as T
}
