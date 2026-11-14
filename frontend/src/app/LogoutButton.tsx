import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'

export function LogoutButton({ showLabel = false }: { showLabel?: boolean }) {
  const { logout } = useAuth()
  return (
    <Button variant="ghost" size="sm" aria-label="Sair" title="Sair" onClick={logout}>
      <LogOut className="w-4 h-4" aria-hidden="true" />
      {showLabel && <span>Sair</span>}
    </Button>
  )
}
