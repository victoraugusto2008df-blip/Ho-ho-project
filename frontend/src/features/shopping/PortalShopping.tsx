import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatarReais } from '@/features/consumidor/regras'
import { Esqueleto } from '@/features/lojista/Estados'
import { larguraProporcional } from '@/features/lojista/regras'
import { useDashboardShopping } from './hooks'

export const MENSAGEM_ERRO_SHOPPING = 'Não foi possível carregar os dados do shopping.'

function Erro({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return (
    <div className="space-y-2">
      <p role="alert" className="text-sm text-[var(--color-danger)]">
        {MENSAGEM_ERRO_SHOPPING}
      </p>
      <Button variant="secondary" size="sm" onClick={aoTentarDeNovo}>
        Tentar novamente
      </Button>
    </div>
  )
}

function Indicador({ id, titulo, legenda, children }: { id: string; titulo: string; legenda?: string; children: ReactNode }) {
  const dashboard = useDashboardShopping()
  return (
    <Card aria-labelledby={id} aria-busy={dashboard.isPending}>
      <CardContent className="pt-5 space-y-2">
        <h2 id={id} className="text-sm text-[var(--text-muted)] font-normal font-[family-name:var(--font-sans)]">
          {titulo}
        </h2>
        {dashboard.isPending && <Esqueleto linhas={2} />}
        {dashboard.isError && <Erro aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dashboard.data && (
          <>
            <p className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums font-[family-name:var(--font-display)]">
              {children}
            </p>
            {legenda && <p className="text-xs text-[var(--text-muted)]">{legenda}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function FaturamentoPorSegmentoCard() {
  const dashboard = useDashboardShopping()
  const categorias = dashboard.data?.faturamentoPorCategoria ?? []
  const maior = Math.max(0, ...categorias.map((c) => c.valor))

  return (
    <Card aria-labelledby="segmento-titulo" aria-busy={dashboard.isPending}>
      <CardHeader>
        <CardTitle id="segmento-titulo" className="text-base">
          Faturamento consolidado por segmento
        </CardTitle>
        <CardDescription className="text-sm">Valor das NFC-e cadastradas no programa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dashboard.isPending && <Esqueleto linhas={5} />}
        {dashboard.isError && <Erro aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dashboard.data && categorias.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">Nenhuma nota cadastrada ainda.</p>
        )}
        {categorias.length > 0 && (
          <ul aria-label="Faturamento por segmento" className="space-y-3">
            {categorias.map(({ categoria, valor }) => (
              <li
                key={categoria}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)_6.5rem] items-center gap-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)_7rem]"
              >
                <span className="text-[var(--text-secondary)]">{categoria}</span>
                <div className="h-4 rounded-r-sm bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    data-testid="barra-segmento"
                    className="h-full rounded-r-sm bg-[var(--color-analytics)]"
                    style={{ width: `${larguraProporcional(valor, maior)}%` }}
                  />
                </div>
                <span className="text-right font-semibold text-[var(--text-primary)] tabular-nums">
                  {formatarReais(valor)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Tela 3 - Portal do Shopping, na versão mínima do roteiro da banca (AD-027): os 3 indicadores
 * e o faturamento por segmento, sobre todo o histórico.
 */
export function PortalShopping() {
  const dados = useDashboardShopping().data

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Portal do Shopping
          </h1>
          <Badge tone="warning" className="border-[var(--color-warning)]/40">
            Protótipo · dados fictícios
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Indicador id="faturamento-titulo" titulo="Faturamento identificado" legenda="soma das NFC-e validadas">
            {dados && formatarReais(dados.faturamentoTotal)}
          </Indicador>
          <Indicador id="vouchers-titulo" titulo="Vouchers de estacionamento">
            {dados?.vouchersLiberados.toLocaleString('pt-BR')}
          </Indicador>
          <Indicador id="campanhas-titulo" titulo="Campanhas ativas">
            {dados?.campanhasAtivas.toLocaleString('pt-BR')}
          </Indicador>
        </div>
        <FaturamentoPorSegmentoCard />
      </main>
    </div>
  )
}
