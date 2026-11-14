import type { Role } from './types'

export interface DemoUser {
  email: string
  senha: string
}

/** Usuários de demonstração semeados pelo backend (`V2__seed_demo_data.sql`). */
export const DEMO_USERS: Record<Role, DemoUser> = {
  CONSUMIDOR: { email: 'consumidor@shopping.com', senha: 'demo123' },
  LOJISTA: { email: 'lojista@shopping.com', senha: 'demo123' },
  ADMIN_SHOPPING: { email: 'admin@shopping.com', senha: 'demo123' },
}
