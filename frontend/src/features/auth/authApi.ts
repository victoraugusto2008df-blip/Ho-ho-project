import { apiFetch } from '@/lib/api'
import { base64UrlEncode } from '@/lib/jwt'
import { DEMO_USERS } from './demoUsers'
import type { Role } from './types'

export class InvalidLoginResponseError extends Error {
  constructor() {
    super('Resposta de login inválida')
    this.name = 'InvalidLoginResponseError'
  }
}

const MOCK_TOKEN_TTL_SECONDS = 8 * 60 * 60

export function isMockAuth(): boolean {
  return import.meta.env.VITE_AUTH_MOCK === 'true'
}

/** JWT sem assinatura (`alg: none`) para o modo simulado; nunca chega ao backend. */
function createMockToken(role: Role, nowMs: number = Date.now()): string {
  const user = DEMO_USERS[role]
  const header = { alg: 'none', typ: 'JWT' }
  const payload = {
    sub: user.email,
    nome: user.nome,
    role,
    exp: Math.floor(nowMs / 1000) + MOCK_TOKEN_TTL_SECONDS,
  }
  return `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.mock`
}

/** Autentica o usuário de demonstração do perfil e devolve o JWT. */
export async function postLogin(role: Role): Promise<string> {
  if (isMockAuth()) return createMockToken(role)

  const { email, senha } = DEMO_USERS[role]
  const data = await apiFetch<{ token?: unknown } | null>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
  if (typeof data?.token !== 'string') throw new InvalidLoginResponseError()
  return data.token
}
