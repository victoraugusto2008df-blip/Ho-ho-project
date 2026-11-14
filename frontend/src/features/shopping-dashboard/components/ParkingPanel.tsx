import type { ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'
import { Ficticio } from './Ficticio'

// Mesma ordem de cor do protótipo: azul, laranja e verde, todos tokens do design system.
const COR_DO_STATUS: Record<string, string> = {
  Utilizados: 'var(--color-analytics)',
  Expirados: 'var(--color-warning)',
  Pendentes: 'var(--color-success-bar)',
}

export function ParkingPanel({ estacionamento }: { estacionamento: ModeloDoDashboard['estacionamento'] }) {
  const { emitidos, adesao, saidas, cpfs, status } = estacionamento
  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[var(--text-muted)]">Vouchers emitidos</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] tabular-nums">{emitidos}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">Adesão</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] tabular-nums">
            <Ficticio ativo={adesao.ficticio}>{adesao.texto}</Ficticio>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            das{' '}
            <Ficticio ativo={saidas.ficticio}>
              <span className="tabular-nums">{saidas.texto}</span>
            </Ficticio>{' '}
            saídas de veículos
          </p>
        </div>
      </div>

      <Ficticio ativo={status.ficticio}>
        <span className="mt-5 block text-xs font-medium text-[var(--text-muted)]">Status dos vouchers</span>
        <span
          className="mt-2 flex h-4 w-full gap-[2px] overflow-hidden rounded"
          role="img"
          aria-label={`Barra empilhada: ${status.itens.map((item) => `${item.nome} ${item.valor}`).join(', ')}`}
        >
          {status.itens
            .filter((item) => item.proporcao > 0)
            .map((item) => (
              <span
                key={item.nome}
                title={`${item.nome}: ${item.valor} (${item.percentual})`}
                style={{ width: `${item.proporcao * 100}%`, background: COR_DO_STATUS[item.nome] }}
              />
            ))}
        </span>
        <span className="mt-3 block space-y-1.5 text-sm">
          {status.itens.map((item) => (
            <span key={item.nome} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: COR_DO_STATUS[item.nome] }}
                  aria-hidden="true"
                />
                {item.nome}
              </span>
              <span className="tabular-nums">
                <strong className="font-semibold text-[var(--text-primary)]">{item.valor}</strong>{' '}
                <span className="text-[var(--text-muted)]">· {item.percentual}</span>
              </span>
            </span>
          ))}
        </span>
      </Ficticio>

      <p className="mt-4 rounded-lg bg-[var(--bg-canvas)] p-3 text-xs text-[var(--text-secondary)]">
        <Ficticio ativo={cpfs.ficticio}>
          <span className="tabular-nums">{cpfs.texto}</span>
        </Ficticio>{' '}
        CPFs distintos cadastraram notas no período. Pendentes = vouchers de hoje ainda não usados; expiram no
        fechamento (seg. a sáb. 22h; dom. 20h).
      </p>
    </div>
  )
}
