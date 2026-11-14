function encode(value: unknown): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export interface TokenOptions {
  role?: string
  /** Segundos desde a época; `null` omite o claim. */
  exp?: number | null
  sub?: string
  nome?: string
}

/** Monta um JWT de teste, sem assinatura. */
export function makeToken({ role = 'LOJISTA', exp, sub = 'user@hoho.demo', nome }: TokenOptions = {}): string {
  const payload: Record<string, unknown> = { sub, role }
  const expiresAt = exp === undefined ? nowSeconds() + 3600 : exp
  if (expiresAt !== null) payload.exp = expiresAt
  if (nome !== undefined) payload.nome = nome
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.sig`
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}
