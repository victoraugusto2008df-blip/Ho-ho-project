import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

/** Moldura comum aos painéis da Tela 3: seção com âncora para a barra lateral, título e subtítulo. */
export function Painel({
  id,
  titulo,
  subtitulo,
  acessorio,
  className,
  children,
}: {
  id: string
  titulo: string
  subtitulo: ReactNode
  acessorio?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={cn('min-w-0 scroll-mt-6', className)}>
      <Card className="h-full p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id={`${id}-titulo`} className="text-base font-semibold text-[var(--text-primary)]">
              {titulo}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">{subtitulo}</p>
          </div>
          {acessorio}
        </div>
        {children}
      </Card>
    </section>
  )
}
