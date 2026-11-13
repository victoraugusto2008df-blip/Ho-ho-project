import { Layers, Palette, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const kanbanSlots = [
  {
    id: 'ORD-03',
    title: 'Shell, Rotas & Seletor de Perfil (Acesso Rápido)',
    owner: 'Dev 3',
    status: 'Aguardando implementação',
  },
  {
    id: 'ORD-07',
    title: 'Tela 1 — Portal do Consumidor (NFC-e & Estacionamento)',
    owner: 'Dev 3',
    status: 'Aguardando implementação',
  },
  {
    id: 'ORD-11',
    title: 'Tela 2 — Portal do Lojista (Benchmarking & Campanhas)',
    owner: 'Dev 4',
    status: 'Aguardando implementação',
  },
  {
    id: 'ORD-12',
    title: 'Tela 3 — Portal da Administração do Shopping',
    owner: 'Dev 4',
    status: 'Aguardando implementação',
  },
]

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg bg-[var(--color-brand)] text-white font-bold text-sm flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              SA
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                Shopping Analytics &amp; Loyalty Hub
              </p>
              <p className="text-xs text-[var(--text-muted)]">Equipe 22 — Ho-Ho</p>
            </div>
          </div>

          <Badge tone="warning">Base Frontend · Pronta para o Kanban</Badge>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Fundação Visual &amp; Design System Configurados
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Estrutura React + TypeScript + Vite + Tailwind v4 + TanStack Query + Recharts alinhada
            aos tokens dos mockups oficiais. Os cards do Kanban permanecem livres para a equipe
            implementar conforme a divisão.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--color-brand)]" aria-hidden="true" />
                Tokens em 3 Camadas
              </CardTitle>
              <CardDescription>Primitivos, Semânticos e Componentes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge tone="brand">Brand Indigo</Badge>
              <Badge tone="analytics">Analytics Blue</Badge>
              <Badge tone="success">Meta Atingida</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-analytics)]" aria-hidden="true" />
                Primitivos UI Base
              </CardTitle>
              <CardDescription>Componentes reutilizáveis e acessíveis</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-[var(--text-secondary)]">
              <code>Button</code>, <code>Card</code> e <code>Badge</code> prontos em{' '}
              <code>src/components/ui/</code> com foco visível e <code>tabular-nums</code>.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" aria-hidden="true" />
                Proxy &amp; Query Client
              </CardTitle>
              <CardDescription>Integração pronta com o Spring Boot</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-[var(--text-secondary)]">
              Requisições para <code>/api</code> redirecionadas para{' '}
              <code>http://localhost:8080</code> no Vite.
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-brand)]" aria-hidden="true" />
              Slots do Kanban Reservados para a Equipe
            </CardTitle>
            <CardDescription>
              Nenhum card funcional foi adiantado — cada trilha está livre conforme{' '}
              <code>mvp-sabado-kanban.md</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-[var(--border-hairline)]">
            {kanbanSlots.map((slot) => (
              <div
                key={slot.id}
                className="py-3 first:pt-1 last:pb-1 flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-primary)]">
                    {slot.id}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {slot.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{slot.owner}</Badge>
                  <Badge tone="analytics">{slot.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App

