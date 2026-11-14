/// <reference types="vite/client" />
import type { Fetcher, NotasApi } from './notasApi'
import { mockNotasApi } from './mockNotasApi'
import { criarRealNotasApi, fetchSemSessao } from './realNotasApi'

/**
 * `true` só com `VITE_BACKEND_CONSUMIDOR=true` exatamente; ausente, `"false"` ou `"TRUE"` usam o mock.
 */
export function usarBackendReal(): boolean {
  // `import.meta.env` literal: é a forma que o Vite e o Vitest substituem. Os tipos vêm da
  // referência a `vite/client` acima, sem criar o vite-env.d.ts que o ORD-03 traz.
  return import.meta.env.VITE_BACKEND_CONSUMIDOR === 'true'
}

/**
 * Escolhe a implementação da Tela 1: o mock enquanto o backend (ORD-05 e ORD-06) não existe,
 * ou a real sobre o `fetcher` dado. No merge do ORD-03, passar o `apiFetch`.
 */
export function criarNotasApi(fetcher?: Fetcher): NotasApi {
  // O cliente padrão só é citado dentro do ramo da flag: no build `demo` o ramo é constante
  // falsa e o código do backend real sai do pacote.
  return usarBackendReal() ? criarRealNotasApi(fetcher ?? fetchSemSessao) : mockNotasApi
}
