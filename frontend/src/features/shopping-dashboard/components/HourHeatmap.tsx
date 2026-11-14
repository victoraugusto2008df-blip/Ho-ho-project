import { formatarInteiro, HORAS_DO_MAPA, type ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'

// Rampa sequencial de um só matiz, do claro ao escuro, montada só com tokens (sem hex no JSX).
const RAMPA = [
  'color-mix(in srgb, var(--color-analytics) 22%, var(--bg-surface))',
  'color-mix(in srgb, var(--color-analytics) 42%, var(--bg-surface))',
  'color-mix(in srgb, var(--color-analytics) 64%, var(--bg-surface))',
  'color-mix(in srgb, var(--color-analytics) 88%, var(--bg-surface))',
  'color-mix(in srgb, var(--color-analytics-deep) 55%, var(--color-analytics))',
  'var(--color-analytics-deep)',
  'color-mix(in srgb, var(--color-analytics-deep) 62%, var(--text-primary))',
]
const NIVEL_DE_TEXTO_CLARO = 3

export function LegendaDoMapa() {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]" aria-hidden="true">
      <span>Menos</span>
      <span className="flex gap-0.5">
        {RAMPA.map((cor) => (
          <span key={cor} className="h-3 w-5 rounded-sm" style={{ background: cor }} />
        ))}
      </span>
      <span>Mais</span>
    </div>
  )
}

/** Tabela HTML de 7 x 12 células (critério 6); o Recharts não tem mapa de calor. */
export function HourHeatmap({ linhas }: { linhas: ModeloDoDashboard['mapa']['linhas'] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate text-xs" style={{ borderSpacing: 2 }}>
        <caption className="sr-only">Notas por dia da semana e faixa horária</caption>
        <thead>
          <tr>
            <th className="w-12" aria-hidden="true" />
            {HORAS_DO_MAPA.map((hora) => (
              <th key={hora} scope="col" className="pb-1 text-center font-normal text-[var(--text-muted)]">
                {hora}h
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.dia}>
              <th scope="row" className="pr-2 text-right font-normal text-[var(--text-muted)]">
                {linha.dia}
              </th>
              {linha.celulas.map((celula) => (
                <td
                  key={celula.hora}
                  className="h-9 rounded text-center tabular-nums hover:outline-2 hover:-outline-offset-2 hover:outline-[var(--text-primary)]"
                  style={{
                    background: RAMPA[celula.nivel],
                    color: celula.nivel >= NIVEL_DE_TEXTO_CLARO ? 'var(--bg-surface)' : 'var(--text-primary)',
                  }}
                  title={`${linha.dia}, ${celula.hora}h–${celula.hora + 1}h: ${formatarInteiro(celula.notas)} notas (média)`}
                >
                  {formatarInteiro(celula.notas)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
