import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useNotasHoje } from './hooks'
import { formatarHora, formatarReais, ordenarNotas, resumoNotas } from './regras'

export function NotasHojeCard() {
  const notas = useNotasHoje()
  const lista = notas.data ? ordenarNotas(notas.data) : []

  return (
    <Card aria-labelledby="notas-titulo" aria-busy={notas.isPending}>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between gap-3 pb-2">
          <h2 id="notas-titulo" className="text-sm font-semibold text-[var(--text-primary)]">
            Notas de hoje
          </h2>
          {notas.data && notas.data.length > 0 && (
            <span data-testid="resumo-notas" className="text-xs text-[var(--text-muted)] tabular-nums">
              {resumoNotas(notas.data)}
            </span>
          )}
        </div>

        {notas.isPending && <p className="text-sm text-[var(--text-muted)]">Carregando suas notas…</p>}

        {notas.isError && (
          <div className="space-y-2">
            <p role="alert" className="text-sm text-[var(--color-danger)]">
              Não foi possível carregar suas notas.
            </p>
            <Button variant="secondary" size="sm" onClick={() => void notas.refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {notas.data && lista.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">Nenhuma nota enviada hoje. Cadastre a primeira acima.</p>
        )}

        {lista.length > 0 && (
          <ul aria-label="Notas de hoje" className="divide-y divide-[var(--border-hairline)]">
            {lista.map((nota) => (
              <li key={nota.chave} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{nota.estabelecimento}</p>
                  <p className="text-xs text-[var(--text-muted)] tabular-nums">
                    {nota.categoria} · {formatarHora(nota.dataEmissao)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                    {formatarReais(nota.valor)}
                  </span>
                  <Badge tone="success">
                    <Check aria-hidden="true" className="w-3 h-3" />
                    Validada
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
