import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ShieldCheck } from 'lucide-react'
import { useDispararCampanha } from './hooks'
import { MENSAGEM_FALHA_CAMPANHA, mensagemCampanha } from './regras'

export function CampanhaCard() {
  const disparo = useDispararCampanha()

  function disparar() {
    if (disparo.isPending) return
    disparo.mutate()
  }

  return (
    <Card aria-labelledby="campanha-titulo">
      <CardHeader>
        <CardTitle id="campanha-titulo" className="text-base">
          Nova campanha em 1 clique
        </CardTitle>
        <CardDescription className="text-sm">
          Cupom enviado pelo app do shopping a um segmento pré-qualificado.
        </CardDescription>
        <Badge className="mt-2">
          <ShieldCheck aria-hidden="true" className="w-3 h-3" />
          Sem acesso a CPFs ou contatos
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <dt className="text-sm font-medium text-[var(--text-primary)]">Segmento</dt>
            <dd className="mt-1.5 rounded-[var(--radius-control)] border border-[var(--border-hairline)] px-3 py-2 text-sm text-[var(--text-primary)]">
              Clientes da sua loja inativos há 60 dias
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--text-primary)]">Desconto do cupom</dt>
            <dd className="mt-1.5 rounded-[var(--radius-control)] border border-[var(--border-hairline)] px-3 py-2 text-sm text-[var(--text-primary)] tabular-nums">
              15%
            </dd>
          </div>
        </dl>

        <Button size="lg" className="tabular-nums" disabled={disparo.isPending} onClick={disparar}>
          {disparo.isPending ? 'Disparando…' : 'Disparar Cupom 15% OFF'}
        </Button>

        {disparo.isSuccess && (
          <p role="status" className="text-sm font-medium text-[var(--color-success)] tabular-nums">
            {mensagemCampanha(disparo.data.publicoAtingido)}
          </p>
        )}
        {disparo.isError && (
          <p role="alert" className="text-sm text-[var(--color-danger)]">
            {MENSAGEM_FALHA_CAMPANHA}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
