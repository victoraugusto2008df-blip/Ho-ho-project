import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'
import type { Periodo } from '@/lib/analytics/tipos'
import { cn } from '@/lib/utils'
import { clienteFixture, ErroDoDashboard, type DashboardClient } from './analyticsClient'
import { useShoppingDashboard } from './useShoppingDashboard'
import { CampaignRoiTable } from './components/CampaignRoiTable'
import {
  DashboardComErro,
  DashboardSemPermissao,
  DashboardVazio,
  EsqueletoDoDashboard,
} from './components/DashboardStates'
import { Ficticio } from './components/Ficticio'
import { HourHeatmap, LegendaDoMapa } from './components/HourHeatmap'
import { KpiCard } from './components/KpiCard'
import { NotesVolumeChart } from './components/NotesVolumeChart'
import { Painel } from './components/Painel'
import { ParkingPanel } from './components/ParkingPanel'
import { SectorBarChart } from './components/SectorBarChart'
import { Sidebar, type LinksDasTelas, type SecaoId } from './components/Sidebar'

const PERIODOS: { valor: Periodo; rotulo: string }[] = [
  { valor: 'hoje', rotulo: 'Hoje' },
  { valor: '7d', rotulo: '7 dias' },
  { valor: '30d', rotulo: '30 dias' },
]

export interface ShoppingDashboardPageProps {
  /** Origem dos dados. Sem valor, usa a fixture local até o endpoint do ORD-10 (issue #10) existir. */
  client?: DashboardClient
  /** Endereços das Telas 1 e 2, que o roteador do ORD-03 (issue #3) define. */
  links?: LinksDasTelas
}

/**
 * Tela 3 - Portal da Administração do Shopping (ORD-12). Componente autocontido: o shell do ORD-03
 * (issue #3) a registra na rota e aplica a guarda por perfil `ADMIN_SHOPPING`.
 */
export function ShoppingDashboardPage({ client = clienteFixture, links = {} }: ShoppingDashboardPageProps) {
  const [periodo, setPeriodo] = useState<Periodo>('7d')
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoId>('kpis')
  const consulta = useShoppingDashboard(periodo, client)
  const semPermissao = consulta.error instanceof ErroDoDashboard && consulta.error.tipo === 'sem-permissao'

  let conteudo
  if (consulta.isPending) conteudo = <EsqueletoDoDashboard />
  else if (semPermissao) conteudo = <DashboardSemPermissao />
  else if (consulta.isError)
    conteudo = <DashboardComErro aoTentarDeNovo={() => consulta.refetch()} tentando={consulta.isFetching} />
  else if (consulta.data.vazio) conteudo = <DashboardVazio />
  else conteudo = <Dashboard modelo={consulta.data} />

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <Sidebar secaoAtiva={secaoAtiva} aoEscolherSecao={setSecaoAtiva} links={links} />

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-6 py-5">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Portal do Shopping · Visão executiva · Palmas – TO</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Capim Dourado Shopping</h1>
            <p className="mt-1 min-h-5 text-sm text-[var(--text-muted)]" aria-live="polite">
              {consulta.data ? `Exibindo: ${consulta.data.exibindo}` : consulta.isPending ? 'Carregando…' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Período" className="inline-flex rounded-lg bg-[var(--bg-subtle)] p-1 text-sm">
              {PERIODOS.map((opcao) => {
                const ativo = opcao.valor === periodo
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => setPeriodo(opcao.valor)}
                    className={cn(
                      'cursor-pointer rounded-md px-3 py-1.5',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
                      ativo
                        ? 'bg-[var(--bg-surface)] font-medium text-[var(--text-primary)] shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    {opcao.rotulo}
                  </button>
                )
              })}
            </div>
            <Badge tone="warning">Protótipo · dados fictícios</Badge>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {conteudo}
          <p className="text-center text-xs text-[var(--text-muted)]">
            Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios
          </p>
        </main>
      </div>
    </div>
  )
}

function Dashboard({ modelo }: { modelo: ModeloDoDashboard }) {
  const { kpis, destaque } = modelo
  return (
    <>
      <section id="kpis" aria-label="Indicadores consolidados" className="grid scroll-mt-6 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard titulo="Faturamento identificado" valor={kpis.faturamento} rodape="soma das NFC-e validadas" />
        <KpiCard titulo="Notas cadastradas" valor={kpis.notas} rodape={kpis.notasRodape} />
        <KpiCard titulo="Ticket médio do shopping" valor={kpis.ticketMedio} rodape="por nota fiscal" />
        <KpiCard
          titulo="Vouchers de estacionamento"
          valor={kpis.vouchers}
          rodape={<Ficticio ativo={kpis.vouchersRodape.ficticio}>{kpis.vouchersRodape.texto}</Ficticio>}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        <Painel
          id="segmentos"
          titulo="Faturamento consolidado por segmento"
          subtitulo="Valor das NFC-e cadastradas no programa"
          className="xl:col-span-2"
        >
          <SectorBarChart setores={modelo.setores} />
          {destaque && (
            <p className="mt-4 rounded-lg bg-[var(--color-brand-soft)] p-3 text-sm text-[var(--color-brand-deep)]">
              <strong>{destaque.lider.nome}</strong> lidera com{' '}
              <span className="tabular-nums">{destaque.lider.percentual}</span> do faturamento;{' '}
              <strong>{destaque.menor.nome}</strong> é o segmento com menor participação (
              <span className="tabular-nums">{destaque.menor.percentual}</span>) — insumo para o tenant mix.
            </p>
          )}
        </Painel>
        <Painel
          id="volume"
          titulo="Volume de notas cadastradas"
          subtitulo={modelo.volume.subtitulo}
          className="xl:col-span-3"
        >
          <NotesVolumeChart volume={modelo.volume} />
        </Painel>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Painel
          id="mapa"
          titulo="Notas por dia da semana e horário"
          subtitulo={modelo.mapa.subtitulo}
          acessorio={<LegendaDoMapa />}
          className="xl:col-span-3"
        >
          <HourHeatmap linhas={modelo.mapa.linhas} />
        </Painel>
        <Painel
          id="estacionamento"
          titulo="Adesão ao estacionamento grátis"
          subtitulo="Meta de R$ 150,00/dia por CPF · 1 isenção por dia · 967 vagas"
          className="xl:col-span-2"
        >
          <ParkingPanel estacionamento={modelo.estacionamento} />
        </Painel>
      </div>

      <Painel
        id="campanhas"
        titulo="ROI das campanhas ativas"
        subtitulo="Cupons disparados pelos lojistas via app do shopping"
      >
        <CampaignRoiTable campanhas={modelo.campanhas} />
      </Painel>
    </>
  )
}
