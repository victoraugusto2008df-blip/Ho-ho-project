import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatarInteiro, type ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'
import { CHART_PALETTE } from '../chartPalette'

type Volume = ModeloDoDashboard['volume']
type Ponto = Volume['pontos'][number]

function Dica({ active, payload }: { active?: boolean; payload?: { payload: Ponto }[] }) {
  const ponto = payload?.[0]?.payload
  if (!active || !ponto) return null
  return (
    <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[var(--text-primary)]">{ponto.dica}</p>
      <p className="text-[var(--text-secondary)] tabular-nums">{formatarInteiro(ponto.notas)} notas</p>
    </div>
  )
}

/**
 * Rótulo direto só no pico. Nas pontas da série ele é empurrado para dentro do gráfico, para não
 * colidir com o eixo Y nem sair pela borda direita.
 */
function RotuloDoPico({
  viewBox,
  texto,
  indice,
  total,
}: {
  viewBox?: { x?: number; y?: number; width?: number }
  texto: string
  indice: number
  total: number
}) {
  // No ReferenceDot, o viewBox é o quadrado do ponto; o centro fica no meio dele.
  const x = (viewBox?.x ?? 0) + (viewBox?.width ?? 0) / 2
  const y = viewBox?.y ?? 0
  const primeiro = indice === 0 && total > 1
  const ultimo = indice === total - 1 && total > 1
  return (
    <text
      x={primeiro ? x + 14 : ultimo ? x - 14 : x}
      y={y - 6}
      textAnchor={primeiro ? 'start' : ultimo ? 'end' : 'middle'}
      fontSize={11}
      fontWeight={600}
      fill={CHART_PALETTE.text}
    >
      {texto}
    </text>
  )
}

export function NotesVolumeChart({ volume }: { volume: Volume }) {
  const { pontos, passo, topo, pico } = volume
  // No máximo dez rótulos no eixo, contados a partir do último ponto, como no protótipo.
  const cada = Math.ceil(pontos.length / 10)
  const rotulos = pontos.filter((_, i) => (pontos.length - 1 - i) % cada === 0).map((ponto) => ponto.rotulo)
  const destaque = pico === null ? null : pontos[pico]

  return (
    <>
      <div
        className="mt-4 h-60"
        role="img"
        aria-label="Gráfico de linha do volume de notas; a tabela abaixo traz a mesma série"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pontos} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_PALETTE.hairline} />
            <XAxis
              dataKey="rotulo"
              ticks={rotulos}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: CHART_PALETTE.hairline }}
              tick={{ fontSize: 11, fill: CHART_PALETTE.secondary }}
            />
            <YAxis
              domain={[0, topo]}
              ticks={[0, passo, passo * 2, passo * 3, topo]}
              tickFormatter={formatarInteiro}
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fontSize: 11, fill: CHART_PALETTE.secondary }}
            />
            <Tooltip content={<Dica />} cursor={{ stroke: CHART_PALETTE.secondary, strokeDasharray: '3 3' }} />
            <Area
              type="linear"
              dataKey="notas"
              stroke={CHART_PALETTE.primary}
              strokeWidth={2}
              fill={CHART_PALETTE.primary}
              fillOpacity={0.08}
              activeDot={{ r: 5, stroke: CHART_PALETTE.surface, strokeWidth: 2 }}
              isAnimationActive={false}
            />
            {destaque && (
              <ReferenceDot
                x={destaque.rotulo}
                y={destaque.notas}
                r={4}
                fill={CHART_PALETTE.primary}
                stroke={CHART_PALETTE.surface}
                strokeWidth={2}
                label={<RotuloDoPico texto={formatarInteiro(destaque.notas)} indice={pico ?? 0} total={pontos.length} />}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          Ver dados em tabela
        </summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left text-xs tabular-nums">
            <thead className="text-[var(--text-muted)]">
              <tr>
                <th scope="col" className="py-1 pr-3 font-medium">
                  {volume.colunaDaTabela}
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((ponto) => (
                <tr key={ponto.dica} className="border-t border-[var(--border-hairline)]">
                  <td className="py-1 pr-3">{ponto.dica}</td>
                  <td className="py-1 text-right">{formatarInteiro(ponto.notas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  )
}
