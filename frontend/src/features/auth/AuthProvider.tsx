import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { UNAUTHORIZED_EVENT } from '@/lib/api'
import { decodeSession, InvalidTokenError, isExpired } from '@/lib/jwt'
import { postLogin } from './authApi'
import { AuthContext, type AuthContextValue } from './authContext'
import { clearToken, readToken, writeToken } from './sessionStore'
import { ACESSO_PATH, PERFIS, type Role } from './types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(readToken)
  const [ended, setEnded] = useState<'expired' | null>(null)

  const loginMutation = useMutation({
    mutationFn: async (role: Role) => {
      const jwt = await postLogin(role)
      const session = decodeSession(jwt)
      if (isExpired(session)) throw new InvalidTokenError('Token já expirado')
      return session
    },
    onSuccess: (session) => {
      writeToken(session.token)
      setToken(session.token)
      setEnded(null)
      queryClient.removeQueries()
      navigate(PERFIS[session.role].rota)
    },
  })

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    setEnded(null)
    queryClient.removeQueries()
    navigate(ACESSO_PATH, { replace: true })
  }, [navigate, queryClient])

  const invalidate = useCallback(() => {
    clearToken()
    setToken(null)
    setEnded('expired')
    queryClient.removeQueries()
  }, [queryClient])

  const clearEnded = useCallback(() => setEnded(null), [])

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, invalidate)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, invalidate)
  }, [invalidate])

  const { mutate, isPending, variables, error } = loginMutation
  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      ended,
      login: mutate,
      isLoggingIn: isPending,
      pendingRole: isPending ? (variables ?? null) : null,
      loginError: error,
      logout,
      invalidate,
      clearEnded,
    }),
    [token, ended, mutate, isPending, variables, error, logout, invalidate, clearEnded],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
