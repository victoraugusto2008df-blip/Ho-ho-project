import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, useAuthStatus } from './useAuth'
import { ACESSO_PATH, EXPIRADO_PATH, PERFIS, type Role } from './types'

/** Guarda de UX: a autorização real é do backend. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const auth = useAuthStatus()
  const { ended } = useAuth()

  if (auth.status === 'expired' || (auth.status === 'anonymous' && ended === 'expired')) {
    return <Navigate to={EXPIRADO_PATH} replace />
  }
  if (auth.status === 'anonymous') return <Navigate to={ACESSO_PATH} replace />
  if (auth.session.role !== role) return <Navigate to={PERFIS[auth.session.role].rota} replace />
  return <>{children}</>
}
