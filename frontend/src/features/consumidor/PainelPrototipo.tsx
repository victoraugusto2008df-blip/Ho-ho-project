import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { CadastroNota } from './hooks'
import { CHAVES_DEMO } from './chavesDemo'

const ERROS_SIMULADOS = [
  { titulo: 'Nota duplicada', regra: 'ReN01', descricao: 'Reenvia uma chave já cadastrada', chave: CHAVES_DEMO.DUPLICADA },
  { titulo: 'Nota com mais de 72h', regra: 'ReN02', descricao: 'Emitida há 4 dias', chave: CHAVES_DEMO.ANTIGA },
  {
    titulo: 'CNPJ fora do shopping',
    regra: 'RF03',
    descricao: 'Loja emissora não é lojista ativo',
    chave: CHAVES_DEMO.LOJA_NAO_CREDENCIADA,
  },
] as const

export const ORDEM_VALIDACAO = [
  'CPF válido + consentimento LGPD (RN04)',
  'Chave com 44 dígitos (RF01)',
  'Chave nunca cadastrada (ReN01)',
  'Consulta à SEFAZ simulada (RF02)',
  'Emitida há no máximo 72h (ReN02)',
  'CNPJ emissor é lojista ativo (RF03)',
  'Soma do dia ≥ R$ 150 → voucher (ReN03/ReN04)',
] as const

/** Controles da demonstração para a banca (AD-011). Não fazem parte do app final. */
export function PainelPrototipo({ cadastro }: { cadastro: CadastroNota }) {
  return (
    <div className="space-y-4">
      <Card aria-labelledby="painel-titulo">
        <CardContent className="pt-4 space-y-3">
          <div>
            <h2 id="painel-titulo" className="text-sm font-semibold text-[var(--text-primary)]">
              Painel do protótipo
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Controles para demonstrar as regras de negócio. Não fazem parte do app final.
            </p>
          </div>

          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Simular erros de validação
          </h3>
          <div className="space-y-2">
            {ERROS_SIMULADOS.map((erro) => (
              <Button
                key={erro.regra}
                variant="secondary"
                disabled={cadastro.enviando}
                onClick={() => cadastro.enviarChaveDemo(erro.chave)}
                className="w-full h-auto flex-col items-start gap-0.5 px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                  {erro.titulo}
                  <Badge tone="neutral" className="px-1.5 text-[10px]">
                    {erro.regra}
                  </Badge>
                </span>
                <span className="text-xs font-normal text-[var(--text-muted)]">{erro.descricao}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card aria-labelledby="ordem-titulo">
        <CardContent className="pt-4">
          <h2 id="ordem-titulo" className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            Ordem de validação
          </h2>
          <ol aria-label="Ordem de validação" className="list-decimal pl-5 space-y-1 text-xs text-[var(--text-secondary)]">
            {ORDEM_VALIDACAO.map((item) => (
              <li key={item} className="tabular-nums">
                {item}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
