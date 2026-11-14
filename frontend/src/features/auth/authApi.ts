import { apiFetch } from '@/lib/api'
import { DEMO_USERS } from './demoUsers'
import type { Role } from './types'

export class InvalidLoginResponseError extends Error {
  constructor() {
    super('Resposta de login inválida')
    this.name = 'InvalidLoginResponseError'
  }
}

/** Autentica o usuário de demonstração do perfil em `POST /api/v1/auth/login` e devolve o JWT. */
export async function postLogin(role: Role): Promise<string> {
  const { email, senha } = DEMO_USERS[role]
  const data = await apiFetch<{ token?: unknown } | null>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
  if (typeof data?.token !== 'string') throw new InvalidLoginResponseError()
  return data.token
}
