import { Info, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErroDashboard, Esqueleto } from './Estados'
import { useDashboardLojista } from './hooks'
import { benchmarkingLiberado, formatarGap, formatarReais, gapDoTicket, larguraProporcional } from './regras'

function Barra({ rotulo, valor, maior, cor }: { rotulo: string; valor: number; maior: number; cor: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)_6rem]">
      <span className="text-[var(--text-secondary)]">{rotulo}</span>
      <div className="h-6 rounded-[var(--radius-control)] bg-[var(--bg-subtle)] overflow-hidden">
        <div
          data-testid="barra-benchmarking"
          className={`h-full rounded-[var(--radius-control)] ${cor}`}
          style={{ width: `${larguraProporcional(valor, maior)}%` }}
        />
      </div>
      <span className="text-right font-semibold text-[var(--text-primary)] tabular-nums">{formatarReais(valor)}</span>
    </div>
  )
}

function Bloqueio() {
  return (
    <div
      data-testid="benchmarking-bloqueado"
      className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-warning)]/50 bg-[var(--color-warning-soft)]/20 p-4"
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center">
        <Lock aria-hidden="true" data-testid="icone-cadeado" className="w-5 h-5 text-[var(--color-warning)]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">Benchmarking Temporariamente Indisponível</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
          Para proteger o sigilo concorrencial, as médias setoriais só são exibidas quando houver 3 ou mais lojistas
          ativos no seu segmento (ReN05).
        </p>
      </div>
    </div>
  )
}

export function BenchmarkingCard() {
  const dashboard = useDashboardLojista()
  const dados = dashboard.data
  const liberado = dados ? benchmarkingLiberado(dados) : false
  // A média só é lida no ramo liberado; bloqueado, ela nem chega à tela (ReN05).
  const media = dados && benchmarkingLiberado(dados) ? dados.mediaCategoria : null
  const gap = dados && media !== null ? gapDoTicket(dados.ticketMedio, media) : null

  return (
    <Card aria-labelledby="benchmarking-titulo" aria-busy={dashboard.isPending}>
      <CardHeader>
        <CardTitle id="benchmarking-titulo" className="text-base">
          Benchmarking setorial
        </CardTitle>
        <CardDescription className="text-sm">Ticket médio da sua loja vs. média do segmento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dashboard.isPending && <Esqueleto linhas={4} />}
        {dashboard.isError && <ErroDashboard aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dados && (
          <>
            <div className="space-y-3">
              <Barra
                rotulo="Sua loja"
                valor={dados.ticketMedio}
                maior={Math.max(dados.ticketMedio, media ?? 0)}
                cor="bg-[var(--color-analytics)]"
              />
              {media !== null ? (
                <Barra
                  rotulo="Média da categoria"
                  valor={media}
                  maior={Math.max(dados.ticketMedio, media)}
                  cor="bg-[var(--text-muted)]"
                />
              ) : (
                <Bloqueio />
              )}
            </div>

            {liberado && media !== null && gap !== null && (
              <div className="rounded-[var(--radius-card)] border border-[var(--border-hairline)] p-4">
                <p className="text-xs text-[var(--text-muted)]">Gap do ticket médio</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums font-[family-name:var(--font-display)]">
                  {formatarGap(gap)}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)] tabular-nums">
                  Seu ticket médio é {formatarReais(dados.ticketMedio)} vs. {formatarReais(media)} da média do setor.
                </p>
              </div>
            )}

            {liberado && (
              <div className="flex items-start gap-2 rounded-[var(--radius-control)] border border-[var(--color-analytics)]/25 bg-[var(--color-analytics-soft)] p-3 text-xs text-[var(--color-analytics-deep)]">
                <Info aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
                <p>
                  <strong>Privacidade (K-Anonymity, ReN05):</strong> segmento com o mínimo exigido de 3 lojistas
                  ativos. Os valores individuais de concorrentes nunca são exibidos, apenas a média do grupo.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
