import type { MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export const SECOES = [
  { id: 'kpis', rotulo: 'Visão executiva' },
  { id: 'segmentos', rotulo: 'Faturamento por segmento' },
  { id: 'volume', rotulo: 'Volume de notas' },
  { id: 'estacionamento', rotulo: 'Estacionamento' },
  { id: 'campanhas', rotulo: 'ROI de campanhas' },
] as const

export type SecaoId = (typeof SECOES)[number]['id']

/** Endereços das outras telas. As rotas são do shell do ORD-03 (issue #3); sem endereço, o item não navega. */
export interface LinksDasTelas {
  consumidor?: string
  lojista?: string
}

const ITEM = 'flex items-center gap-2 rounded-md px-3 py-2'
const ITEM_INATIVO = 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'

export function Sidebar({
  secaoAtiva,
  aoEscolherSecao,
  links,
}: {
  secaoAtiva: SecaoId
  aoEscolherSecao: (secao: SecaoId) => void
  links: LinksDasTelas
}) {
  function irPara(evento: MouseEvent<HTMLAnchorElement>, secao: SecaoId) {
    // Rolagem pelo DOM, e não pelo hash da URL: o roteador do ORD-03 pode usar o hash.
    evento.preventDefault()
    aoEscolherSecao(secao)
    document.getElementById(secao)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const telas = [
    { rotulo: '1 · Consumidor', href: links.consumidor },
    { rotulo: '2 · Lojista', href: links.lojista },
  ]

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border-hairline)] bg-[var(--bg-surface)] lg:flex">
      <div className="flex items-center gap-3 border-b border-[var(--border-hairline)] px-5 py-4">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-brand)] text-sm font-bold text-[var(--bg-surface)]"
          aria-hidden="true"
        >
          SA
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-[var(--text-primary)]">Shopping Analytics &amp; Loyalty Hub</span>
          <span className="block text-xs text-[var(--text-muted)]">Equipe 22 — Ho-Ho</span>
        </span>
      </div>

      <nav aria-label="Portal do Shopping" className="flex-1 overflow-y-auto px-3 py-4 text-sm">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Portal do Shopping
        </p>
        {SECOES.map((secao) => {
          const ativa = secao.id === secaoAtiva
          return (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              onClick={(evento) => irPara(evento, secao.id)}
              aria-current={ativa ? 'location' : undefined}
              className={cn(
                ITEM,
                ativa ? 'bg-[var(--color-brand-soft)] font-medium text-[var(--color-brand-hover)]' : ITEM_INATIVO,
              )}
            >
              {secao.rotulo}
            </a>
          )
        })}

        <p className="mt-6 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Telas do protótipo
        </p>
        {telas.map((tela) =>
          tela.href ? (
            <a key={tela.rotulo} href={tela.href} className={cn(ITEM, ITEM_INATIVO)}>
              {tela.rotulo}
            </a>
          ) : (
            <span key={tela.rotulo} className={cn(ITEM, 'text-[var(--text-secondary)]')}>
              {tela.rotulo}
            </span>
          ),
        )}
        <span aria-current="page" className={cn(ITEM, 'font-medium text-[var(--text-primary)]')}>
          3 · Shopping
        </span>
      </nav>

      <div className="flex items-center gap-3 border-t border-[var(--border-hairline)] px-5 py-4">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text-secondary)]"
          aria-hidden="true"
        >
          CD
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-medium text-[var(--text-primary)]">Administração Capim Dourado</span>
          <span className="block text-xs text-[var(--text-muted)]">Perfil: ADMIN_SHOPPING</span>
        </span>
      </div>
    </aside>
  )
}
