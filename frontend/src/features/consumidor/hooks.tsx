import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { NotasApi } from './notasApi'
import { CICLO_SIMULACAO } from './chavesDemo'
import { notasApi } from './realNotasApi'
import {
  MENSAGEM_CPF_INVALIDO,
  MENSAGEM_FALHA_ENVIO,
  MENSAGEM_NEGOCIO,
  MENSAGEM_SEM_CONSENTIMENTO,
  REGRA_NEGOCIO,
  chaveValida,
  cpfValido,
  formatarReais,
  mascararCpf,
  normalizarChave,
} from './regras'
import { NegocioError } from './types'

const NotasApiContext = createContext<NotasApi | null>(null)

/** Fornece a `NotasApi` à Tela 1: o backend, ou a que o teste passar em `api`. */
export function NotasApiProvider({ api, children }: { api?: NotasApi; children: ReactNode }) {
  const valor = useMemo(() => api ?? notasApi, [api])
  return <NotasApiContext.Provider value={valor}>{children}</NotasApiContext.Provider>
}

export function useNotasApi(): NotasApi {
  const api = useContext(NotasApiContext)
  if (!api) throw new Error('useNotasApi precisa de um NotasApiProvider')
  return api
}

export const CHAVE_NOTAS_HOJE = ['consumidor', 'notas-hoje'] as const
export const CHAVE_BENEFICIO_HOJE = ['consumidor', 'beneficio-hoje'] as const

export function useNotasHoje() {
  const api = useNotasApi()
  return useQuery({ queryKey: CHAVE_NOTAS_HOJE, queryFn: () => api.listarNotasHoje() })
}

export function useBeneficioHoje() {
  const api = useNotasApi()
  return useQuery({ queryKey: CHAVE_BENEFICIO_HOJE, queryFn: () => api.beneficioHoje() })
}

export const CPF_FICTICIO = '529.982.247-25'

export type Mensagem =
  | { tipo: 'sucesso'; texto: string }
  | { tipo: 'erro'; texto: string; regra?: string }

/**
 * Estado do cadastro de nota, compartilhado pelo formulário e pelo painel do protótipo:
 * o painel preenche e envia chaves.
 */
export function useCadastroNota() {
  const api = useNotasApi()
  const queryClient = useQueryClient()
  const [cpf, setCpfBruto] = useState(CPF_FICTICIO)
  const [chave, setChaveBruta] = useState('')
  const [consentimento, setConsentimento] = useState(false)
  const [mensagem, setMensagem] = useState<Mensagem | null>(null)
  const [proximaSimulacao, setProximaSimulacao] = useState(0)

  const envio = useMutation({
    mutationFn: (chaveEnviada: string) => api.enviarNota(chaveEnviada),
    onSuccess: (nota) => {
      setChaveBruta('')
      setMensagem({ tipo: 'sucesso', texto: `Nota de ${formatarReais(nota.valor)} validada.` })
    },
    onError: (erro) => {
      if (erro instanceof NegocioError) {
        setMensagem({ tipo: 'erro', texto: MENSAGEM_NEGOCIO[erro.codigo], regra: REGRA_NEGOCIO[erro.codigo] })
      } else {
        setMensagem({ tipo: 'erro', texto: MENSAGEM_FALHA_ENVIO })
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CHAVE_NOTAS_HOJE }),
        queryClient.invalidateQueries({ queryKey: CHAVE_BENEFICIO_HOJE }),
      ]),
  })

  function setChave(entrada: string) {
    setChaveBruta(normalizarChave(entrada))
    setMensagem(null)
  }

  function setCpf(entrada: string) {
    setCpfBruto(mascararCpf(entrada))
  }

  function simularLeitura() {
    setChave(CICLO_SIMULACAO[proximaSimulacao])
    setProximaSimulacao((i) => (i + 1) % CICLO_SIMULACAO.length)
  }

  /** Valida no front (CPF, LGPD, 44 dígitos) e só então envia. */
  function enviar(chaveEnviada: string = chave) {
    if (envio.isPending) return
    if (!cpfValido(cpf)) return setMensagem({ tipo: 'erro', texto: MENSAGEM_CPF_INVALIDO })
    if (!consentimento) return setMensagem({ tipo: 'erro', texto: MENSAGEM_SEM_CONSENTIMENTO })
    if (!chaveValida(chaveEnviada)) return setMensagem({ tipo: 'erro', texto: MENSAGEM_NEGOCIO.CHAVE_INVALIDA })
    setMensagem(null)
    envio.mutate(chaveEnviada)
  }

  /** Botões do painel: preenchem a chave de demonstração e já enviam. */
  function enviarChaveDemo(chaveDemo: string) {
    setChaveBruta(chaveDemo)
    enviar(chaveDemo)
  }

  return {
    cpf,
    setCpf,
    chave,
    setChave,
    consentimento,
    setConsentimento,
    mensagem,
    enviando: envio.isPending,
    simularLeitura,
    enviar,
    enviarChaveDemo,
  }
}

export type CadastroNota = ReturnType<typeof useCadastroNota>
