import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErroDashboard, Esqueleto } from './Estados'
import { useDashboardLojista } from './hooks'
import { larguraProporcional, rotuloCompras, topCrossShopping } from './regras'

export function CrossShoppingCard() {
  const dashboard = useDashboardLojista()
  const dados = dashboard.data
  const categorias = dados ? topCrossShopping(dados.crossShopping) : []
  const maior = categorias[0]?.total ?? 0

  return (
    <Card aria-labelledby="cross-titulo" aria-busy={dashboard.isPending}>
      <CardHeader>
        <CardTitle id="cross-titulo" className="text-base">
          Afinidade de compras cruzadas
        </CardTitle>
        <CardDescription className="text-sm">Compras dos seus clientes em outras categorias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dashboard.isPending && <Esqueleto linhas={5} />}
        {dashboard.isError && <ErroDashboard aoTentarDeNovo={() => void dashboard.refetch()} />}
        {dados && categorias.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            Ainda não há compras cruzadas dos seus clientes em outras categorias.
          </p>
        )}
        {categorias.length > 0 && (
          <ul className="space-y-3">
            {categorias.map(({ categoria, total }) => (
              <li
                key={categoria}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm sm:grid-cols-[7rem_minmax(0,1fr)_6rem]"
              >
                <span className="text-[var(--text-secondary)]">{categoria}</span>
                <div className="h-3 rounded-[var(--radius-control)] bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    data-testid="barra-afinidade"
                    className="h-full rounded-[var(--radius-control)] bg-[var(--color-analytics)]"
                    style={{ width: `${larguraProporcional(total, maior)}%` }}
                  />
                </div>
                <span className="text-right font-semibold text-[var(--text-primary)] tabular-nums">
                  {rotuloCompras(total)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {dados && (
          <p className="text-xs text-[var(--text-muted)]">
            Mostramos apenas categorias, nunca lojas específicas ou clientes individuais.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
