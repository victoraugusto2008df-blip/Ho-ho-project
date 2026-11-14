import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MENSAGEM_ERRO_DASHBOARD } from './regras'

/** Esqueleto de carregamento de um card de dados; o leitor de tela ouve "Carregando…". */
export function Esqueleto({ linhas = 3, className }: { linhas?: number; className?: string }) {
  return (
    <div role="status" aria-label="Carregando…" className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: linhas }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded-[var(--radius-control)] bg-[var(--bg-subtle)]"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

/** Erro de um card de dados: mensagem e "Tentar novamente", que refaz o `GET` do dashboard. */
export function ErroDashboard({ aoTentarDeNovo }: { aoTentarDeNovo: () => void }) {
  return (
    <div className="space-y-2">
      <p role="alert" className="text-sm text-[var(--color-danger)]">
        {MENSAGEM_ERRO_DASHBOARD}
      </p>
      <Button variant="secondary" size="sm" onClick={aoTentarDeNovo}>
        Tentar novamente
      </Button>
    </div>
  )
}
