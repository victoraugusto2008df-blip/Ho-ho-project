import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useBeneficioHoje } from './hooks'
import { formatarReais, limitarPercentual } from './regras'

export function ProgressoCard() {
  const beneficio = useBeneficioHoje()

  return (
    <Card aria-labelledby="progresso-titulo" aria-busy={beneficio.isPending}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="progresso-titulo" className="text-sm font-semibold text-[var(--text-primary)]">
            Seu progresso hoje
          </h2>
          {beneficio.data && (
            <span className="text-xs text-[var(--text-muted)] tabular-nums">CPF {beneficio.data.cpfMascarado}</span>
          )}
        </div>

        {beneficio.isPending && <p className="text-sm text-[var(--text-muted)]">Carregando seu progresso…</p>}

        {beneficio.isError && (
          <div className="space-y-2">
            <p role="alert" className="text-sm text-[var(--color-danger)]">
              Não foi possível carregar seu progresso.
            </p>
            <Button variant="secondary" size="sm" onClick={() => void beneficio.refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {beneficio.data && (
          <ProgressoValores
            valorAcumulado={beneficio.data.valorAcumulado}
            meta={beneficio.data.meta}
            percentual={limitarPercentual(beneficio.data.percentual)}
            faltante={beneficio.data.faltante}
          />
        )}
      </CardContent>
    </Card>
  )
}

function ProgressoValores({
  valorAcumulado,
  meta,
  percentual,
  faltante,
}: {
  valorAcumulado: number
  meta: number
  percentual: number
  faltante: number
}) {
  const atingida = percentual >= 100

  return (
    <>
      <p className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums font-[family-name:var(--font-display)]">
          {formatarReais(valorAcumulado)}
        </span>
        <span className="text-sm text-[var(--text-muted)] tabular-nums">de {formatarReais(meta)}</span>
      </p>

      <div
        role="progressbar"
        aria-label="Progresso da meta do estacionamento"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentual}
        className="w-full h-2.5 rounded-[var(--radius-pill)] bg-[var(--bg-subtle)] overflow-hidden"
      >
        <div
          data-testid="barra-progresso"
          className="h-full rounded-[var(--radius-pill)] bg-[var(--color-success-bar)] transition-all duration-500"
          style={{ width: `${percentual}%` }}
        />
      </div>

      {atingida ? (
        <p className="text-sm text-[var(--text-secondary)]">
          <Check aria-hidden="true" className="inline w-4 h-4 mr-1 -mt-0.5 text-[var(--color-success)]" />
          <strong className="font-semibold text-[var(--color-success)]">Meta atingida!</strong> Seu estacionamento de
          hoje está liberado.
        </p>
      ) : (
        <p className="text-sm text-[var(--text-secondary)] tabular-nums">
          Faltam <strong className="font-semibold text-[var(--text-primary)]">{formatarReais(faltante)}</strong> para
          liberar seu estacionamento.
        </p>
      )}
    </>
  )
}
