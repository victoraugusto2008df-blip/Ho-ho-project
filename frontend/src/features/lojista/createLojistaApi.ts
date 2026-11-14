/// <reference types="vite/client" />
import { fetchSemSessao } from '@/features/consumidor/realNotasApi'
import type { Fetcher } from '@/features/consumidor/notasApi'
import type { LojistaApi } from './lojistaApi'
import { mockLojistaApi } from './mockLojistaApi'
import { criarRealLojistaApi } from './realLojistaApi'

/**
 * `true` só com `VITE_BACKEND_LOJISTA=true` exatamente; ausente, `"false"` ou `"TRUE"` usam o mock.
 * A flag é própria da Tela 2: ligar a Tela 1 no real não liga esta (door 2 do plano).
 */
export function usarBackendRealLojista(): boolean {
  return import.meta.env.VITE_BACKEND_LOJISTA === 'true'
}

/** Escolhe a implementação da Tela 2. No merge do ORD-03, passar o `apiFetch`. */
export function criarLojistaApi(fetcher?: Fetcher): LojistaApi {
  // O cliente padrão só é citado dentro do ramo da flag: no build `demo` o ramo é constante
  // falsa e o código do backend real sai do pacote.
  return usarBackendRealLojista() ? criarRealLojistaApi(fetcher ?? fetchSemSessao) : mockLojistaApi
}
