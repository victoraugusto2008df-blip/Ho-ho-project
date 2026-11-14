import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { BenchmarkingCard } from './BenchmarkingCard'
import { CampanhaCard } from './CampanhaCard'
import { CrossShoppingCard } from './CrossShoppingCard'
import { HorariosPicoCard } from './HorariosPicoCard'
import { TicketMedioCard } from './TicketMedioCard'

/**
 * Tela 2 - Portal do Lojista (ORD-11). Só a loja do token: não há seletor de loja.
 * Em 1024px ou mais os cards seguem o mockup; abaixo disso empilham em uma coluna.
 */
export function PortalLojista() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Portal do Lojista
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Lock aria-hidden="true" className="w-3 h-3" />
              Somente dados agregados da sua loja
            </Badge>
            <Badge tone="warning" className="border-[var(--color-warning)]/40">
              Protótipo · dados fictícios
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TicketMedioCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
          <BenchmarkingCard />
          <CrossShoppingCard />
        </div>
        <HorariosPicoCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
          <CampanhaCard />
        </div>
      </main>
    </div>
  )
}
