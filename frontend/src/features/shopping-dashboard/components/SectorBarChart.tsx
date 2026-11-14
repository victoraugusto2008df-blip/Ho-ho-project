import type { ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'

/** Barras horizontais em HTML: a captura desenha rótulo, barra e valor em grade, sem eixo. */
export function SectorBarChart({ setores }: { setores: ModeloDoDashboard['setores'] }) {
  if (setores.length === 0) {
    return <p className="mt-5 text-sm text-[var(--text-muted)]">Nenhum segmento com notas no período.</p>
  }
  return (
    <ul className="mt-5 space-y-3" aria-label="Faturamento por segmento">
      {setores.map((setor) => (
        <li
          key={setor.nome}
          className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3"
          title={`${setor.nome}: ${setor.valor} · ${setor.percentual} do total`}
        >
          <span className="text-sm text-[var(--text-secondary)]">{setor.nome}</span>
          <span className="h-5 rounded-r bg-[var(--bg-canvas)]" aria-hidden="true">
            <span
              className="block h-full rounded-r bg-[var(--color-analytics)]"
              style={{ width: `${setor.proporcao * 100}%` }}
            />
          </span>
          <span className="text-right text-sm tabular-nums">
            <strong className="font-semibold text-[var(--text-primary)]">{setor.valor}</strong>
            <span className="sr-only">, {setor.percentual} do total</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
