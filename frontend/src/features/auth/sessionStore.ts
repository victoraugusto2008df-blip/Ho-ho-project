export const SESSION_KEY = 'hoho.session'

/**
 * `null` = nada guardado. Texto vazio = havia algo ilegível, que vale como token vencido.
 */
export function readToken(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw === null) return null
    const stored: unknown = JSON.parse(raw)
    const token = (stored as { token?: unknown } | null)?.token
    return typeof token === 'string' ? token : ''
  } catch {
    return ''
  }
}

export function writeToken(token: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token }))
  } catch {
    // Armazenamento bloqueado: a sessão vale só enquanto a aba estiver aberta.
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Nada a limpar.
  }
}
