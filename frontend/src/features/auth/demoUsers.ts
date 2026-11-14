import type { Role } from './types'

export interface DemoUser {
  email: string
  senha: string
  /** Nome que o token simulado carrega; o backend real decide o seu. */
  nome: string
}

/**
 * Usuários de demonstração semeados pelo backend (ORD-01).
 * Credenciais ainda não confirmadas: ajuste aqui quando o seed for definido.
 */
export const DEMO_USERS: Record<Role, DemoUser> = {
  CONSUMIDOR: { email: 'consumidor@hoho.demo', senha: 'demo123', nome: 'Consumidor Demo' },
  LOJISTA: { email: 'lojista@hoho.demo', senha: 'demo123', nome: 'Passo Firme Calçados' },
  ADMIN_SHOPPING: {
    email: 'admin@hoho.demo',
    senha: 'demo123',
    nome: 'Administração Capim Dourado',
  },
}
