import { Outlet } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { AppFooter } from './AppFooter'
import { BrandMark } from './BrandMark'
import { LoginAlert } from './LoginAlert'
import { LogoutButton } from './LogoutButton'
import { ProfileSwitcher } from './ProfileSwitcher'

/** Shell do Consumidor: barra no topo, como nas figuras 1 e 2. */
export function ConsumidorShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <BrandMark />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <ProfileSwitcher />
            <Badge tone="warning">Protótipo · dados fictícios</Badge>
            <LogoutButton />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 empty:hidden pb-2">
          <LoginAlert />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
