import { QRCodeSVG } from 'qrcode.react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { useBeneficioHoje } from './hooks'
import { formatarHora, formatarReais, formatarValidoAte } from './regras'
import { VALOR_DIARIA_ESTACIONAMENTO } from './types'

/** Card do voucher; só aparece com voucher `LIBERADO` (os outros estados ficam para a v2). */
export function VoucherCard() {
  const { data } = useBeneficioHoje()
  const voucher = data?.voucher
  if (!voucher || voucher.status !== 'LIBERADO') return null

  return (
    <Card
      aria-labelledby="voucher-titulo"
      className="border-2 border-dashed border-[var(--color-success-bar)]"
    >
      <CardContent className="pt-4 space-y-3">
        <div>
          <h2 id="voucher-titulo" className="text-sm font-semibold text-[var(--text-primary)]">
            Voucher de estacionamento grátis
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Apresente o QR Code na cancela de saída.</p>
        </div>

        <Badge tone="warning">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-[var(--radius-pill)] bg-current" />
          Pendente · pronto para uso
        </Badge>

        <div className="flex items-start gap-4">
          <div className="p-1.5 rounded-[var(--radius-control)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] shrink-0">
            <QRCodeSVG value={voucher.qrPayload} size={88} title={`QR Code do voucher ${voucher.codigo}`} />
          </div>
          <dl className="text-xs space-y-1.5">
            <div>
              <dt className="text-[var(--text-muted)]">Código</dt>
              <dd className="font-semibold text-[var(--text-primary)] font-[family-name:var(--font-mono)] tabular-nums">
                {voucher.codigo}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Emitido às</dt>
              <dd className="font-medium text-[var(--text-primary)] tabular-nums">{formatarHora(voucher.emitidoEm)}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Válido até</dt>
              <dd className="font-medium text-[var(--text-primary)] tabular-nums">
                {formatarValidoAte(voucher.validoAte)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-xs text-[var(--color-success)] tabular-nums">
          Economia de <strong>{formatarReais(VALOR_DIARIA_ESTACIONAMENTO)}</strong> no estacionamento (valor público
          da diária)
        </p>

        <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded-[var(--radius-control)] px-2.5 py-2 tabular-nums">
          Limite de 1 isenção por CPF por dia. Válido para saída até o fechamento do shopping hoje (seg. a sáb. 22h;
          dom. 20h).
        </p>
      </CardContent>
    </Card>
  )
}
