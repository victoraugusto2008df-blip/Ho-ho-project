import type { ModeloDoDashboard } from '@/lib/analytics/shoppingDashboardMapper'
import { Ficticio } from './Ficticio'

const COLUNAS_NUMERICAS = ['Enviados', 'Convertidos', 'Receita gerada', 'ROI', 'Taxa p/ shopping']

export function CampaignRoiTable({ campanhas }: { campanhas: ModeloDoDashboard['campanhas'] }) {
  const { linhas, total, ficticio } = campanhas
  return (
    <>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border-hairline)] text-xs text-[var(--text-muted)]">
            <tr>
              <th scope="col" className="py-2 pr-3 font-medium">
                Campanha
              </th>
              {COLUNAS_NUMERICAS.map((coluna, i) => (
                <th
                  key={coluna}
                  scope="col"
                  className={i === COLUNAS_NUMERICAS.length - 1 ? 'py-2 text-right font-medium' : 'py-2 pr-3 text-right font-medium'}
                >
                  {/* Nenhuma métrica por campanha tem campo no DER atual (critério 12). */}
                  <Ficticio ativo={ficticio}>{coluna}</Ficticio>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--bg-subtle)] tabular-nums">
            {linhas.map((linha) => (
              <tr key={linha.id}>
                <td className="py-2.5 pr-3">
                  <p className="font-medium text-[var(--text-primary)]">{linha.nome}</p>
                  <p className="text-xs text-[var(--text-muted)]">{linha.lojaSegmento}</p>
                </td>
                <td className="py-2.5 pr-3 text-right">{linha.enviados}</td>
                <td className="py-2.5 pr-3 text-right">
                  {linha.convertidos}
                  {linha.conversao !== null && (
                    <>
                      {' '}
                      <span className="text-xs text-[var(--text-muted)]">({linha.conversao})</span>
                    </>
                  )}
                </td>
                <td className="py-2.5 pr-3 text-right">{linha.receita}</td>
                <td className="py-2.5 pr-3 text-right font-semibold">{linha.roi}</td>
                <td className="py-2.5 text-right">{linha.taxaShopping}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[var(--border-hairline)] font-semibold">
              <td className="py-2.5 pr-3">Total</td>
              <td className="py-2.5 pr-3 text-right">{total.enviados}</td>
              <td className="py-2.5 pr-3 text-right">{total.convertidos}</td>
              <td className="py-2.5 pr-3 text-right">{total.receita}</td>
              <td />
              <td className="py-2.5 text-right">{total.taxaShopping}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        ROI = (receita gerada − custo da campanha) ÷ custo da campanha. Custo = desconto concedido + taxa de sucesso de
        R$ 2,50 por cupom convertido (receita do shopping).
      </p>
    </>
  )
}
