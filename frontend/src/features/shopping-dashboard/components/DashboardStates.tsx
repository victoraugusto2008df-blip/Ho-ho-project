import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, Lock, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

function Bloco({ className }: { className: string }) {
  return <span className={`block animate-pulse rounded bg-[var(--bg-subtle)] ${className}`} />
}

/** Critério 13: a mesma grade da tela carregada, com blocos no lugar de cada número e gráfico. */
export function EsqueletoDoDashboard() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando o dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="p-5 shadow-sm">
            <Bloco className="h-4 w-32" />
            <Bloco className="mt-3 h-8 w-36" />
            <Bloco className="mt-2 h-3 w-28" />
          </Card>
        ))}
      </div>
      {[0, 1].map((linha) => (
        <div key={linha} className="grid gap-6 xl:grid-cols-5">
          <Card className={`p-5 shadow-sm ${linha === 0 ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
            <Bloco className="h-5 w-56" />
            <Bloco className="mt-2 h-4 w-44" />
            <Bloco className="mt-5 h-64 w-full" />
          </Card>
          <Card className={`p-5 shadow-sm ${linha === 0 ? 'xl:col-span-3' : 'xl:col-span-2'}`}>
            <Bloco className="h-5 w-56" />
            <Bloco className="mt-2 h-4 w-44" />
            <Bloco className="mt-5 h-64 w-full" />
          </Card>
        </div>
      ))}
      <Card className="p-5 shadow-sm">
        <Bloco className="h-5 w-56" />
        <Bloco className="mt-2 h-4 w-72" />
        <Bloco className="mt-5 h-48 w-full" />
      </Card>
    </div>
  )
}

function Aviso({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center shadow-sm">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)]">
        {icone}
      </span>
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{titulo}</h2>
      {children}
    </Card>
  )
}

/** Critério 14. O seletor de período fica no cabeçalho, fora deste bloco, e continua utilizável. */
export function DashboardVazio() {
  return (
    <Aviso icone={<Inbox className="h-6 w-6" aria-hidden="true" />} titulo="Sem notas cadastradas no período">
      <p className="max-w-md text-sm text-[var(--text-muted)]">
        Nenhuma NFC-e foi validada no intervalo escolhido. Escolha outro período no seletor acima.
      </p>
    </Aviso>
  )
}

/** Critério 15. */
export function DashboardComErro({ aoTentarDeNovo, tentando }: { aoTentarDeNovo: () => void; tentando: boolean }) {
  return (
    <Aviso
      icone={<AlertTriangle className="h-6 w-6 text-[var(--color-danger)]" aria-hidden="true" />}
      titulo="Não foi possível carregar o dashboard"
    >
      <p className="max-w-md text-sm text-[var(--text-muted)]">
        O serviço de analytics não respondeu. Os dados não foram alterados; tente de novo em instantes.
      </p>
      <Button variant="secondary" onClick={aoTentarDeNovo} disabled={tentando}>
        <RotateCw className={`h-4 w-4 ${tentando ? 'animate-spin' : ''}`} aria-hidden="true" />
        Tentar novamente
      </Button>
    </Aviso>
  )
}

/** Critério 16: nenhum número do dashboard é desenhado neste estado. */
export function DashboardSemPermissao() {
  return (
    <Aviso icone={<Lock className="h-6 w-6" aria-hidden="true" />} titulo="Você não tem permissão para ver este painel">
      <p className="max-w-md text-sm text-[var(--text-muted)]">
        A visão executiva do shopping é restrita ao perfil ADMIN_SHOPPING. Entre com esse perfil para continuar.
      </p>
    </Aviso>
  )
}
