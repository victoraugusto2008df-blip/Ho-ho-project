import { useContext, useEffect } from 'react'
import { decodeSession, isExpired } from '@/lib/jwt'
import { AuthContext, type AuthContextValue } from './authContext'
import type { Session } from './types'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return context
}

export type AuthStatus =
  | { status: 'anonymous' }
  | { status: 'expired' }
  | { status: 'valid'; session: Session }

export function evaluateToken(token: string | null, now: number = Date.now()): AuthStatus {
  if (token === null) return { status: 'anonymous' }
  try {
    const session = decodeSession(token)
    return isExpired(session, now) ? { status: 'expired' } : { status: 'valid', session }
  } catch {
    return { status: 'expired' }
  }
}

/**
 * Estado da sessão a cada renderização, para que um token vencido seja pego na
 * próxima navegação. Uma sessão vencida ou ilegível é apagada.
 */
export function useAuthStatus(): AuthStatus {
  const { token, invalidate } = useAuth()
  const result = evaluateToken(token)
  const expired = result.status === 'expired'

  useEffect(() => {
    if (expired) invalidate()
  }, [expired, invalidate])

  return result
}
