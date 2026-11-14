import { Card, CardContent } from '@/components/ui/Card'
import { ErroDashboard, Esqueleto } from './Estados'
import { useDashboardLojista } from './hooks'
import { formatarReais } from './regras'

export function TicketMedioCard() {
  const dashboard = useDashboardLojista()

  return (
    <Card aria-labelledby="ticket-titulo" aria-busy={dashboard.isPending}>
      <CardContent className="pt-5 space-y-2">
        <h2 id="ticket-titulo" className="text-sm text-[var(--text-muted)] font-normal font-[family-name:var(--font-sans)]">
          Ticket médio
        </h2>
        {dashboard.isPending && <Esqueleto linhas={2} />}
        {dashboard.isError && <ErroDashboard aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dashboard.data && (
          <p className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums font-[family-name:var(--font-display)]">
            {formatarReais(dashboard.data.ticketMedio)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
