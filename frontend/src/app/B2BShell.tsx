import { useEffect, useState } from 'react'
import { Link, Outlet, useMatches } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStatus } from '@/features/auth/useAuth'
import { PERFIS } from '@/features/auth/types'
import { cn } from '@/lib/utils'
import { AppFooter } from './AppFooter'
import { BrandMark } from './BrandMark'
import { LoginAlert } from './LoginAlert'
import { LogoutButton } from './LogoutButton'
import { ProfileSwitcher } from './ProfileSwitcher'

export interface NavItem {
  label: string
  to: string
}

/** Contrato do slot de navegação: a rota do portal declara os itens do seu menu. */
export interface PortalRouteHandle {
  nav?: NavItem[]
}

function initials(name: string): string {
  const letters = name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
  return letters.join('') || '?'
}

const sectionTitle =
  'px-3 mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]'

/** Shell B2B (Lojista e Shopping): sidebar fixa no desktop e gaveta abaixo de 768px. */
export function B2BShell() {
  const auth = useAuthStatus()
  const matches = useMatches()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (auth.status !== 'valid') return null
  const { session } = auth
  const nav = matches.flatMap((match) => (match.handle as PortalRouteHandle | undefined)?.nav ?? [])
  const displayName = session.nome ?? session.sub
  const close = () => setOpen(false)

  return (
    <div className="min-h-screen md:flex">
      <div className="md:hidden sticky top-0 z-30 h-14 px-4 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
        <BrandMark />
        <Button
          variant="ghost"
          size="sm"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="menu-portal"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>

      {open && (
        <div
          data-testid="menu-overlay"
          className="md:hidden fixed inset-0 z-30 bg-[var(--palette-slate-900)]/40"
          onClick={close}
        />
      )}

      <aside
        id="menu-portal"
        data-open={open}
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-hairline)] transition-transform',
          'md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full max-md:invisible',
        )}
      >
        <div className="px-4 py-4 border-b border-[var(--border-hairline)]">
          <BrandMark />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          {nav.length > 0 && (
            <nav aria-label={PERFIS[session.role].portal}>
              <p className={sectionTitle}>{PERFIS[session.role].portal}</p>
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.to + item.label}>
                    <Link
                      to={item.to}
                      onClick={close}
                      className="block px-3 py-2 text-sm rounded-[var(--radius-control)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <nav aria-label="Telas do protótipo">
            <p className={sectionTitle}>Telas do protótipo</p>
            <ProfileSwitcher orientation="vertical" onPick={close} />
          </nav>
        </div>

        <div className="border-t border-[var(--border-hairline)] p-3 space-y-2">
          <LoginAlert />
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-xs font-semibold flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p title={displayName} className="text-sm font-medium text-[var(--text-primary)] leading-snug truncate">
                {displayName}
              </p>
              <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">{`Perfil: ${session.role}`}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <div className="flex justify-end px-4 sm:px-6 pt-4">
          <Badge tone="warning">Protótipo · dados fictícios</Badge>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
