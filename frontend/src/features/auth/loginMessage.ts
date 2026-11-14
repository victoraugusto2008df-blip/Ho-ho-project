import { ApiError } from '@/lib/api'
import { InvalidTokenError } from '@/lib/jwt'
import { InvalidLoginResponseError } from './authApi'

/** Texto mostrado ao apresentador para cada falha do login. */
export function loginMessage(error: unknown): string {
  if (error instanceof InvalidTokenError || error instanceof InvalidLoginResponseError) {
    return 'Resposta de login inválida.'
  }
  if (error instanceof ApiError) {
    return error.status === 401
      ? 'Credenciais de demonstração inválidas.'
      : 'Erro no servidor. Tente novamente.'
  }
  return 'Não foi possível conectar ao servidor.'
}
