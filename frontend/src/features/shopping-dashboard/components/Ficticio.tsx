import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const AVISO_FICTICIO = 'Dado fictício: o payload do ORD-10 não trouxe este valor'

/**
 * Marca de dado fictício (critério 12). Em repouso não desenha nada, como a captura vinculante; a dica
 * abre com o ponteiro em cima, com o toque e com o foco do teclado (`Tab`), fecha com `Esc` sem tirar o
 * foco e continua aberta enquanto o ponteiro passa para cima dela. Fora de marca, devolve o conteúdo
 * intacto.
 *
 * `bloco` envolve conteúdo em bloco; `abaixo` e `direita` posicionam a dica dentro de contêineres com
 * rolagem, como a tabela de ROI, onde uma dica acima ou centralizada seria cortada.
 */
export function Ficticio({
  ativo,
  children,
  bloco = false,
  abaixo = false,
  direita = false,
}: {
  ativo: boolean
  children: ReactNode
  bloco?: boolean
  abaixo?: boolean
  direita?: boolean
}) {
  const idDaDica = useId()
  const [dispensada, setDispensada] = useState(false)
  if (!ativo) return <>{children}</>

  function fecharComEsc(evento: KeyboardEvent<HTMLSpanElement>) {
    if (evento.key === 'Escape') setDispensada(true)
  }

  return (
    <span
      tabIndex={0}
      aria-describedby={idDaDica}
      data-ficticio=""
      onKeyDown={fecharComEsc}
      onBlur={() => setDispensada(false)}
      onMouseLeave={() => setDispensada(false)}
      className={cn(
        'group/ficticio relative rounded-sm',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
        bloco ? 'block' : 'inline',
      )}
    >
      {children}
      <span className="sr-only"> (dado fictício)</span>
      <span
        id={idDaDica}
        role="tooltip"
        className={cn(
          'absolute z-50 hidden',
          !dispensada && 'group-hover/ficticio:block group-focus/ficticio:block',
          abaixo ? 'top-full pt-1' : 'bottom-full pb-1',
          direita ? 'right-0' : 'left-1/2 -translate-x-1/2',
        )}
      >
        <span className="block w-max max-w-56 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2 py-1 text-left text-xs font-normal text-[var(--text-secondary)] shadow-lg">
          {AVISO_FICTICIO}
        </span>
      </span>
    </span>
  )
}
