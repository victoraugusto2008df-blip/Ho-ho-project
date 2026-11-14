import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CHART_PALETTE, COR_PICO } from './chartPalette'
import { ErroDashboard, Esqueleto } from './Estados'
import { useDashboardLojista } from './hooks'
import { preencherHoras, resumoDoPico, type BarraHora } from './regras'

interface RotuloProps {
  x?: number | string
  y?: number | string
  width?: number | string
  value?: number | string
  index?: number
}

function Grafico({ barras, horaPico }: { barras: BarraHora[]; horaPico: number }) {
  const indicePico = barras.findIndex((b) => b.hora === horaPico)

  // O valor aparece só acima da barra de pico; as demais ficam sem rótulo.
  function rotuloPico({ x = 0, y = 0, width = 0, value, index }: RotuloProps) {
    if (index !== indicePico) return <g />
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - 6}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        className="tabular-nums fill-[var(--text-primary)]"
      >
        {value}
      </text>
    )
  }

  return (
    <div data-testid="grafico-pico" className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={barras} margin={{ top: 20, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_PALETTE.hairline} />
          <XAxis dataKey="rotulo" stroke={CHART_PALETTE.secondary} fontSize={11} tickLine={false} />
          <YAxis
            stroke={CHART_PALETTE.secondary}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, (maximo: number) => Math.max(50, Math.ceil(maximo / 50) * 50)]}
            className="tabular-nums"
          />
          <Tooltip
            cursor={{ fill: CHART_PALETTE.hairline, opacity: 0.4 }}
            formatter={(valor) => [`${valor} vendas`, 'Vendas']}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} isAnimationActive={false} label={rotuloPico}>
            {barras.map((barra) => (
              <Cell key={barra.hora} fill={barra.hora === horaPico ? COR_PICO : CHART_PALETTE.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function TabelaHorarios({ barras }: { barras: BarraHora[] }) {
  return (
    <table className="mt-3 w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--border-hairline)] text-left text-xs text-[var(--text-muted)]">
          <th scope="col" className="py-1.5 font-medium">
            Horário
          </th>
          <th scope="col" className="py-1.5 text-right font-medium">
            Vendas
          </th>
        </tr>
      </thead>
      <tbody>
        {barras.map((barra) => (
          <tr key={barra.hora} className="border-b border-[var(--border-hairline)] last:border-0">
            <td className="py-1.5 text-[var(--text-secondary)] tabular-nums">{barra.rotulo}</td>
            <td className="py-1.5 text-right text-[var(--text-primary)] tabular-nums">{barra.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function HorariosPicoCard() {
  const dashboard = useDashboardLojista()
  const [tabelaAberta, setTabelaAberta] = useState(false)
  const dados = dashboard.data
  const barras = dados ? preencherHoras(dados.horariosPico) : []
  const resumo = dados ? resumoDoPico(dados.horariosPico) : null

  return (
    <Card aria-labelledby="pico-titulo" aria-busy={dashboard.isPending}>
      <CardHeader>
        <CardTitle id="pico-titulo" className="text-base">
          Horários de pico
        </CardTitle>
        <CardDescription className="text-sm">Vendas identificadas por faixa horária</CardDescription>
      </CardHeader>
      <CardContent>
        {dashboard.isPending && <Esqueleto linhas={5} />}
        {dashboard.isError && <ErroDashboard aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dados && !resumo && (
          <p className="text-sm text-[var(--text-muted)]">
            Ainda não há vendas identificadas para calcular os horários de pico.
          </p>
        )}
        {resumo && (
          <>
            <Grafico barras={barras} horaPico={resumo.hora} />
            <p className="mt-2 text-sm text-[var(--text-secondary)] tabular-nums">{resumo.texto}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 -ml-3"
              aria-expanded={tabelaAberta}
              onClick={() => setTabelaAberta((aberta) => !aberta)}
            >
              <ChevronRight
                aria-hidden="true"
                className={`w-4 h-4 transition-transform ${tabelaAberta ? 'rotate-90' : ''}`}
              />
              Ver dados em tabela
            </Button>
            {tabelaAberta && <TabelaHorarios barras={barras} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
