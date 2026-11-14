import { ROLES, type Role, type Session } from '@/features/auth/types'

export class InvalidTokenError extends Error {
  constructor(message = 'Token inválido') {
    super(message)
    this.name = 'InvalidTokenError'
  }
}

export function base64UrlEncode(text: string): string {
  let binary = ''
  new TextEncoder().encode(text).forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

function readPayload(token: string): Record<string, unknown> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new InvalidTokenError()
  try {
    const payload: unknown = JSON.parse(base64UrlDecode(parts[1]))
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new InvalidTokenError()
    }
    return payload as Record<string, unknown>
  } catch {
    throw new InvalidTokenError()
  }
}

/**
 * Lê os claims do JWT. Não valida a assinatura: quem autoriza é o backend.
 * Exige `role` entre os 3 perfis e `exp` numérico.
 */
export function decodeSession(token: string): Session {
  const payload = readPayload(token)
  const { role, exp, sub, nome } = payload
  if (typeof role !== 'string' || !ROLES.includes(role as Role)) {
    throw new InvalidTokenError('Token sem perfil válido')
  }
  if (typeof exp !== 'number' || !Number.isFinite(exp)) {
    throw new InvalidTokenError('Token sem expiração')
  }
  return {
    token,
    role: role as Role,
    sub: typeof sub === 'string' ? sub : '',
    nome: typeof nome === 'string' && nome !== '' ? nome : undefined,
    exp,
  }
}

export function isExpired(session: Pick<Session, 'exp'>, now: number = Date.now()): boolean {
  return session.exp * 1000 <= now
}
