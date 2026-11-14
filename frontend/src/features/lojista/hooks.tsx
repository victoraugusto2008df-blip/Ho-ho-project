import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { LojistaApi } from './lojistaApi'
import { criarLojistaApi } from './createLojistaApi'
import { CAMPANHA_PADRAO } from './types'

const LojistaApiContext = createContext<LojistaApi | null>(null)

/** Fornece a implementação de `LojistaApi` à Tela 2; sem `api`, escolhe pela flag. */
export function LojistaApiProvider({ api, children }: { api?: LojistaApi; children: ReactNode }) {
  const valor = useMemo(() => api ?? criarLojistaApi(), [api])
  return <LojistaApiContext.Provider value={valor}>{children}</LojistaApiContext.Provider>
}

export function useLojistaApi(): LojistaApi {
  const api = useContext(LojistaApiContext)
  if (!api) throw new Error('useLojistaApi precisa de um LojistaApiProvider')
  return api
}

export const CHAVE_DASHBOARD = ['lojista', 'dashboard'] as const

export function useDashboardLojista() {
  const api = useLojistaApi()
  return useQuery({ queryKey: CHAVE_DASHBOARD, queryFn: () => api.dashboard() })
}

export function useDispararCampanha() {
  const api = useLojistaApi()
  return useMutation({ mutationFn: () => api.dispararCampanha(CAMPANHA_PADRAO) })
}
