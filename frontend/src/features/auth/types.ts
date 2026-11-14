export type Role = 'CONSUMIDOR' | 'LOJISTA' | 'ADMIN_SHOPPING'

export const ROLES: readonly Role[] = ['CONSUMIDOR', 'LOJISTA', 'ADMIN_SHOPPING']

export interface Session {
  token: string
  role: Role
  /** Identificador do usuário no token (e-mail do usuário seedado). */
  sub: string
  /** Nome de exibição, quando o backend o inclui no token. */
  nome?: string
  /** Expiração em segundos desde a época (claim `exp` do JWT). */
  exp: number
}

export interface Perfil {
  rota: string
  /** Texto da aba de troca rápida, como nos mockups. */
  aba: string
  /** Rótulo do botão da tela de acesso. */
  entrar: string
  /** Nome do portal, usado no menu lateral do B2B. */
  portal: string
  /** Card do Kanban dono do conteúdo da tela. */
  card: string
}

export const PERFIS: Record<Role, Perfil> = {
  CONSUMIDOR: {
    rota: '/consumidor',
    aba: '1 · Consumidor',
    entrar: 'Entrar como Consumidor',
    portal: 'Portal do Consumidor',
    card: 'ORD-07',
  },
  LOJISTA: {
    rota: '/lojista',
    aba: '2 · Lojista',
    entrar: 'Entrar como Lojista',
    portal: 'Portal do Lojista',
    card: 'ORD-11',
  },
  ADMIN_SHOPPING: {
    rota: '/shopping',
    aba: '3 · Shopping',
    entrar: 'Entrar como Admin Shopping',
    portal: 'Portal do Shopping',
    card: 'ORD-12',
  },
}

export const ACESSO_PATH = '/acesso'
export const EXPIRADO_PATH = '/acesso?motivo=expirado'
