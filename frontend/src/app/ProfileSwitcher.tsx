import { Button } from '@/components/ui/Button'
import { useAuth, useAuthStatus } from '@/features/auth/useAuth'
import { PERFIS, ROLES } from '@/features/auth/types'
import { cn } from '@/lib/utils'

interface ProfileSwitcherProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  /** Chamado a cada clique, inclusive no perfil ativo (a gaveta do B2B fecha com ele). */
  onPick?: () => void
}

/** Troca de perfil em 1 clique: abas `1 · Consumidor`, `2 · Lojista`, `3 · Shopping`. */
export function ProfileSwitcher({
  orientation = 'horizontal',
  className,
  onPick,
}: ProfileSwitcherProps) {
  const auth = useAuthStatus()
  const { login, isLoggingIn } = useAuth()
  const active = auth.status === 'valid' ? auth.session.role : null

  return (
    <div
      className={cn(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-wrap items-center',
        className,
      )}
    >
      {ROLES.map((role) => {
        const isActive = role === active
        return (
          <Button
            key={role}
            variant="ghost"
            size="sm"
            aria-current={isActive ? 'page' : undefined}
            disabled={isLoggingIn}
            className={cn(
              orientation === 'vertical' && 'justify-start',
              isActive &&
                'bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]',
            )}
            onClick={() => {
              onPick?.()
              if (!isActive) login(role)
            }}
          >
            {PERFIS[role].aba}
          </Button>
        )
      })}
    </div>
  )
}
