import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { FormularioNota } from './FormularioNota'
import { NotasHojeCard } from './NotasHojeCard'
import { PainelPrototipo } from './PainelPrototipo'
import { ProgressoCard } from './ProgressoCard'
import { VoucherCard } from './VoucherCard'
import { useCadastroNota } from './hooks'
import { formatarHora, formatarReais } from './regras'
import { META_ESTACIONAMENTO } from './types'

function useHoraAtual(): string {
  const [hora, setHora] = useState(() => formatarHora(new Date().toISOString()))
  useEffect(() => {
    const id = window.setInterval(() => setHora(formatarHora(new Date().toISOString())), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return hora
}

function Cabecalho() {
  const hora = useHoraAtual()
  return (
    <header className="bg-[var(--color-brand)] text-white px-4 pt-3 pb-4 lg:px-5">
      <div aria-hidden="true" className="flex items-center justify-between text-[11px] font-medium tabular-nums mb-2">
        <span>{hora}</span>
        <span className="flex items-center gap-1">
          <span className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-[var(--radius-pill)] bg-current" />
            ))}
          </span>
          4G
          <span className="w-1.5 h-2.5 rounded-[1px] bg-current" />
        </span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-white/80">Capim Dourado Shopping · Palmas – TO · Programa de Benefícios</p>
        <Badge className="shrink-0 bg-white/15 text-white border-transparent text-[10px]">Perfil: CONSUMIDOR</Badge>
      </div>
      <h1 className="mt-1 text-xl font-bold tracking-tight font-[family-name:var(--font-display)]">
        Estacionamento grátis
      </h1>
      <p className="mt-1 text-sm text-white/90">
        Some <strong className="tabular-nums">{formatarReais(META_ESTACIONAMENTO)}</strong> em notas de hoje e saia sem
        pagar.
      </p>
    </header>
  )
}

/**
 * Tela 1 - Portal do Consumidor (ORD-07). No desktop, o app num quadro de celular e o
 * painel do protótipo ao lado; no celular, uma coluna só, com o painel no fim.
 */
export function PortalConsumidor() {
  const cadastro = useCadastroNota()

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] lg:py-6">
      <div className="mx-auto px-4 pt-4 lg:p-0 lg:flex lg:items-start lg:justify-center lg:gap-8">
        <div className="w-full lg:w-[356px] lg:shrink-0 lg:rounded-[2.75rem] lg:border-[9px] lg:border-[var(--text-primary)] lg:overflow-hidden lg:shadow-xl bg-[var(--bg-canvas)]">
          <Cabecalho />
          <main className="px-3.5 py-3 space-y-3">
            <ProgressoCard />
            <VoucherCard />
            <FormularioNota cadastro={cadastro} />
            <NotasHojeCard />
          </main>
        </div>

        <aside aria-label="Painel do protótipo" className="pt-4 pb-6 lg:p-0 lg:w-[284px] lg:shrink-0">
          <PainelPrototipo cadastro={cadastro} />
        </aside>
      </div>
    </div>
  )
}
