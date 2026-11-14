import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

export function KpiCard({ titulo, valor, rodape }: { titulo: string; valor: string; rodape: ReactNode }) {
  return (
    <Card className="p-5 shadow-sm">
      <p className="text-sm text-[var(--text-muted)]">{titulo}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">{valor}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{rodape}</p>
    </Card>
  )
}
