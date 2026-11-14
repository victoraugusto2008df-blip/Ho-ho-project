import type { FormEvent } from 'react'
import { CheckCircle2, QrCode } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CPF_FICTICIO, type CadastroNota } from './hooks'
import { TAMANHO_CHAVE, agruparChave } from './regras'

const PLACEHOLDER_CHAVE = agruparChave('0'.repeat(TAMANHO_CHAVE))

const campoClasses =
  'w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-[var(--radius-control)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition'

export function FormularioNota({ cadastro }: { cadastro: CadastroNota }) {
  const { mensagem } = cadastro

  function onSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    cadastro.enviar()
  }

  return (
    <Card aria-labelledby="cadastro-titulo">
      <CardContent className="pt-4">
        <h2 id="cadastro-titulo" className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Cadastrar nota fiscal (NFC-e)
        </h2>

        <form noValidate onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              CPF
            </label>
            <input
              id="cpf"
              inputMode="numeric"
              autoComplete="off"
              value={cadastro.cpf}
              onChange={(e) => cadastro.setCpf(e.target.value)}
              className={`${campoClasses} tabular-nums`}
            />
            <p className="mt-1.5 text-xs text-[var(--text-muted)] tabular-nums">
              CPF fictício de teste:{' '}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cadastro.setCpf(CPF_FICTICIO)}
                className="h-auto p-0 align-baseline text-xs text-[var(--color-brand)] underline hover:bg-transparent hover:text-[var(--color-brand-hover)] tabular-nums"
              >
                {CPF_FICTICIO}
              </Button>
            </p>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="chave" className="block text-sm font-medium text-[var(--text-primary)]">
                Chave de acesso (44 dígitos)
              </label>
              <span data-testid="contador-chave" className="text-xs text-[var(--text-muted)] tabular-nums">
                {cadastro.chave.length}/{TAMANHO_CHAVE}
              </span>
            </div>
            <textarea
              id="chave"
              rows={2}
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              placeholder={PLACEHOLDER_CHAVE}
              value={agruparChave(cadastro.chave)}
              onChange={(e) => cadastro.setChave(e.target.value)}
              aria-describedby="chave-dica"
              className={`${campoClasses} resize-none font-[family-name:var(--font-mono)] text-xs tabular-nums leading-relaxed`}
            />
            <p id="chave-dica" className="mt-1.5 text-xs text-[var(--text-muted)]">
              Fica impressa abaixo do QR Code do cupom fiscal.
            </p>
          </div>

          <Button variant="secondary" className="w-full" onClick={cadastro.simularLeitura}>
            <QrCode aria-hidden="true" className="w-4 h-4" />
            Simular leitura de QR Code
          </Button>

          <label className="flex items-start gap-2.5 p-3 rounded-[var(--radius-control)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={cadastro.consentimento}
              onChange={(e) => cadastro.setConsentimento(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--color-brand)]"
            />
            <span>
              Autorizo o uso dos dados das minhas notas fiscais para o programa de benefícios, conforme a{' '}
              <strong className="text-[var(--text-primary)]">LGPD</strong>. Lojistas só veem dados agregados e
              anonimizados; posso revogar a qualquer momento.
            </span>
          </label>

          <Button type="submit" className="w-full" disabled={cadastro.enviando}>
            {cadastro.enviando ? 'Enviando…' : 'Enviar nota'}
          </Button>

          {mensagem?.tipo === 'erro' && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-[var(--radius-control)] bg-[var(--color-danger-soft)] text-sm text-[var(--color-danger)]"
            >
              {mensagem.regra && <Badge tone="danger">{mensagem.regra}</Badge>}
              <span>{mensagem.texto}</span>
            </div>
          )}
          {mensagem?.tipo === 'sucesso' && (
            <p
              role="status"
              className="flex items-center gap-2 p-3 rounded-[var(--radius-control)] bg-[var(--color-success-soft)] text-sm text-[var(--color-success)] tabular-nums"
            >
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0" />
              {mensagem.texto}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
