import { useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Building2, Loader2, Store, User, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { loginMessage } from '@/features/auth/loginMessage'
import { PERFIS, ROLES, type Role } from '@/features/auth/types'
import { useAuth, useAuthStatus } from '@/features/auth/useAuth'
import { BrandMark } from './BrandMark'

const ICONS: Record<Role, LucideIcon> = {
  CONSUMIDOR: User,
  LOJISTA: Store,
  ADMIN_SHOPPING: Building2,
}

/** Tela de acesso rápido: 1 clique entra no perfil escolhido. */
export function AcessoPage() {
  const auth = useAuthStatus()
  const { login, isLoggingIn, pendingRole, loginError, clearEnded } = useAuth()
  const [params] = useSearchParams()

  useEffect(() => {
    clearEnded()
  }, [clearEnded])

  if (auth.status === 'valid') return <Navigate to={PERFIS[auth.session.role].rota} replace />

  const expired = params.get('motivo') === 'expirado'

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <BrandMark className="justify-center" />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acesso rápido</CardTitle>
            <CardDescription>Escolha um perfil de demonstração para entrar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {expired && (
              <p
                role="status"
                className="text-sm px-3 py-2 rounded-[var(--radius-control)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
              >
                Sua sessão expirou. Entre novamente.
              </p>
            )}
            {loginError != null && (
              <p
                role="alert"
                className="text-sm px-3 py-2 rounded-[var(--radius-control)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
              >
                {loginMessage(loginError)}
              </p>
            )}

            <div className="space-y-2">
              {ROLES.map((role) => {
                const Icon = ICONS[role]
                const pending = isLoggingIn && pendingRole === role
                return (
                  <Button
                    key={role}
                    variant={role === 'CONSUMIDOR' ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                    disabled={isLoggingIn}
                    aria-busy={pending}
                    onClick={() => login(role)}
                  >
                    {pending ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    )}
                    {pending ? 'Entrando…' : PERFIS[role].entrar}
                  </Button>
                )
              })}
            </div>

            <div className="pt-1 flex justify-center">
              <Badge tone="warning">Protótipo · dados fictícios</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
