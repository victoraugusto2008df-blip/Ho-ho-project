/**
 * Preview de DESENVOLVIMENTO da Tela 3 (ORD-12), servido pelo `npm run dev` em `/preview-tela-3.html`.
 * Não entra no build de produção, que só empacota `index.html`. Existe para as visitas manuais (`walk`)
 * de `.specs/features/ord-12-portal-shopping/checks.md` enquanto o shell do ORD-03 não registra a rota:
 * cada `?cenario=` alcança um estado da tela sem tocar em backend, banco ou permissão de usuário.
 *
 *   normal   fixture local, como a captura (padrão)
 *   vazio    faturamento 0 e nenhuma nota (C16)
 *   erro     o endpoint responde 500 até o primeiro "Tentar novamente" (C17)
 *   401/403  o endpoint nega o acesso (C18)
 *   lento    toda consulta leva 4 s (C15)
 *   corrida  `30 dias` leva 4 s e `Hoje` leva 1 s (C22)
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { payloadSimulado } from '@/lib/analytics/shoppingDashboardFixture'
import type { Periodo, ShoppingDashboardDto } from '@/lib/analytics/tipos'
import { criarClienteHttp, type DashboardClient } from './analyticsClient'
import { ShoppingDashboardPage } from './ShoppingDashboardPage'
import '@/index.css'

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

function periodoDa(url: string): Periodo {
  return new URL(url, window.location.origin).searchParams.get('periodo') as Periodo
}

function json(dto: ShoppingDashboardDto) {
  return new Response(JSON.stringify(dto), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

/** Simula o endpoint do ORD-10 para que o preview exercite o cliente HTTP de verdade, inclusive os status. */
function endpointSimulado(responder: (periodo: Periodo) => Promise<Response>): DashboardClient {
  return criarClienteHttp((entrada) => responder(periodoDa(String(entrada))))
}

let respostasComFalha = 0

const CENARIOS: Record<string, DashboardClient> = {
  normal: endpointSimulado(async (periodo) => json(payloadSimulado[periodo])),
  vazio: endpointSimulado(async (periodo) =>
    json({
      ...payloadSimulado[periodo],
      faturamentoCentavos: 0,
      notasCadastradas: 0,
      setores: [],
      serieVolume: [],
      mapaHorario: [],
      vouchers: { emitidos: 0 },
    }),
  ),
  // A consulta e a nova tentativa automática do hook falham; o "Tentar novamente" encontra a origem de volta.
  erro: endpointSimulado(async (periodo) => {
    respostasComFalha += 1
    return respostasComFalha <= 2 ? new Response('erro', { status: 500 }) : json(payloadSimulado[periodo])
  }),
  '401': endpointSimulado(async () => new Response(null, { status: 401 })),
  '403': endpointSimulado(async () => new Response(null, { status: 403 })),
  lento: endpointSimulado(async (periodo) => {
    await esperar(4000)
    return json(payloadSimulado[periodo])
  }),
  corrida: endpointSimulado(async (periodo) => {
    await esperar(periodo === '30d' ? 4000 : periodo === 'hoje' ? 1000 : 0)
    return json(payloadSimulado[periodo])
  }),
}

const cenario = new URLSearchParams(window.location.search).get('cenario') ?? 'normal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ShoppingDashboardPage client={CENARIOS[cenario] ?? CENARIOS.normal} />
    </QueryClientProvider>
  </StrictMode>,
)
