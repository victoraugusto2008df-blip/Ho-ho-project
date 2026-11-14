import { vi } from 'vitest'

/** Codifica como o backend: JSON em UTF-8, depois base64url. */
function encode(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export interface TokenOptions {
  role?: string
  /** Segundos desde a época; `null` omite o claim. */
  exp?: number | null
  sub?: string
  nome?: string
}

/** Monta um JWT de teste, sem assinatura. */
export function makeToken({ role = 'LOJISTA', exp, sub = 'user@hoho.demo', nome }: TokenOptions = {}): string {
  const payload: Record<string, unknown> = { sub, role }
  const expiresAt = exp === undefined ? nowSeconds() + 3600 : exp
  if (expiresAt !== null) payload.exp = expiresAt
  if (nome !== undefined) payload.nome = nome
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.sig`
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

const PERFIL_DO_USUARIO: Record<string, string> = {
  'consumidor@shopping.com': 'CONSUMIDOR',
  'lojista@shopping.com': 'LOJISTA',
  'admin@shopping.com': 'ADMIN_SHOPPING',
}

export const LOGIN_URL = '/api/v1/auth/login'

/**
 * `fetch` de teste no lugar do backend: o login devolve um token do perfil do e-mail enviado
 * e as demais rotas respondem o que `outras` devolver (por padrão, 500).
 */
export function stubBackend(
  outras: (url: string, init?: RequestInit) => Response = () => jsonResponse({}, 500),
) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url !== LOGIN_URL) return outras(url, init)
    const { email } = JSON.parse(String(init?.body)) as { email: string }
    return jsonResponse({ token: makeToken({ role: PERFIL_DO_USUARIO[email], sub: email }) })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** As chamadas de login feitas a um `fetch` de teste, sem as chamadas das telas. */
export function loginCalls(fetchMock: { mock: { calls: unknown[][] } }): [string, RequestInit][] {
  return fetchMock.mock.calls.filter(([url]) => url === LOGIN_URL) as [string, RequestInit][]
}

/** `fetch` de teste em que só o login responde (`login()`); as rotas das telas ficam pendentes. */
export function stubLoginOnly(login: () => Response) {
  const fetchMock = vi.fn((url: string) =>
    url === LOGIN_URL ? Promise.resolve(login()) : new Promise<Response>(() => {}),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
