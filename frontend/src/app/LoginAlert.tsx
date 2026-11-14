import { loginMessage } from '@/features/auth/loginMessage'
import { useAuth } from '@/features/auth/useAuth'

/** Falha de uma troca de perfil feita de dentro do shell. */
export function LoginAlert() {
  const { loginError } = useAuth()
  if (!loginError) return null
  return (
    <p role="alert" className="text-xs text-[var(--color-danger)]">
      {loginMessage(loginError)}
    </p>
  )
}
