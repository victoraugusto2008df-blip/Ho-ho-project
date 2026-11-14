import type { ReactNode } from 'react'

export const AVISO_FICTICIO = 'Dado fictício: o modelo de dados atual não sustenta este valor'

/**
 * Marca de dado fictício (critério 12): dica ao passar o ponteiro e texto para leitor de tela, sem
 * alterar o desenho que a captura vinculante fixa. Fora de marca, devolve o conteúdo intacto.
 */
export function Ficticio({ ativo, children }: { ativo: boolean; children: ReactNode }) {
  if (!ativo) return <>{children}</>
  return (
    <span title={AVISO_FICTICIO} data-ficticio="">
      {children}
      <span className="sr-only"> (dado fictício)</span>
    </span>
  )
}
