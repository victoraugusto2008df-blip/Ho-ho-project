import { createContext } from 'react'
import type { Role } from './types'

export interface AuthContextValue {
  /** Token guardado na sessão: `null` sem sessão, `''` quando o guardado é ilegível. */
  token: string | null
  /** Motivo do encerramento da última sessão; `expired` leva o aviso à tela de acesso. */
  ended: 'expired' | null
  login: (role: Role) => void
  isLoggingIn: boolean
  pendingRole: Role | null
  loginError: unknown
  logout: () => void
  /** Encerra uma sessão vencida ou ilegível, sem navegar. */
  invalidate: () => void
  clearEnded: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
