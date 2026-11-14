# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Complemento de fixture indexado por id trata id ausente como valor vazio marcado e fora das somas, sem propagar undefined para a formatação
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: frontend/src/lib/analytics/shoppingDashboardMapper.ts:246 (C26) (analytics)
- last seen: 2026-11-14T09:22:44Z

### L-002 - Antes de declarar um valor sem respaldo no DER, conferir se colunas existentes o derivam, como status enumerado ou contagem distinta por chave estrangeira
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: .docs/architecture/architecture-and-domain.md:70,84 (plan.md Assumptions) (analytics)
- last seen: 2026-11-14T09:22:46Z

### L-003 - Marca de dado fictício precisa ser alcançável por ponteiro, toque e teclado; title nativo e texto sr-only não a identificam
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `shopping-dashboard` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C14 (Ficticio.tsx) (shopping-dashboard)
- last seen: 2026-11-14T09:22:50Z

### L-004 - Teste de percentual sobre um total usa partes que não somam o total, para distinguir o total da soma das partes
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C8 (shoppingDashboardMapper.test.ts) (analytics)
- last seen: 2026-11-14T09:22:53Z

### L-005 - Provar arredondamento ao centavo com um caso que arredonda para cima; exemplos que truncam deixam Math.floor passar
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C23 (shoppingDashboardMapper.ts:154) (analytics)
- last seen: 2026-11-14T09:22:57Z

### L-006 - Provar arredondamento ao inteiro com uma divisão fracionária; divisões exatas deixam floor, ceil e nenhum arredondamento passarem
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C25 (shoppingDashboardMapper.ts:160) (analytics)
- last seen: 2026-11-14T09:22:59Z

### L-007 - Check de navegação cobre só itens com destino nesta feature; rotas de outra issue ficam registradas como dependência, não como prova
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `shopping-dashboard` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C21 (Sidebar.tsx:84-97) (shopping-dashboard)
- last seen: 2026-11-14T09:23:01Z

### L-008 - Check de tempo esgotado precisa de um cenário que nunca responde, com o fetch simulado honrando o AbortSignal
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `shopping-dashboard` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C17 (preview.tsx:36, analyticsClient.ts:34) (shopping-dashboard)
- last seen: 2026-11-14T09:23:03Z

### L-009 - Fixar o denominador do percentual no mapeamento, não em helper com o total à mão, e dizer no critério o que vale quando as partes não fecham o total
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C5 (shoppingDashboardMapper.ts:217) (analytics)
- last seen: 2026-11-14T09:23:05Z

### L-010 - Comparar grafia, contorno e cor de cada elemento com a captura vinculante e listar cada diferença em Differences antes de declarar None
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `shopping-dashboard` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C1 (plan.md Differences from the source) (shopping-dashboard)
- last seen: 2026-11-14T09:23:08Z

### L-011 - Escolher a unidade de exibição pelo valor já arredondado e marcar o pico pelo maior valor real da série, não pelo piso do eixo
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `analytics` · harmful: 0
- features: ord-12-portal-shopping
- evidence: C27, C28 (shoppingDashboardMapper.ts:57-58,197-200) (analytics)
- last seen: 2026-11-14T09:23:10Z

### L-012 - Testes de unidade do frontend precisam de script test e de um passo no CI, ou uma regressão passa com o CI verde
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `ci` · harmful: 0
- features: ord-12-portal-shopping
- evidence: .github/workflows/ci.yml (frontend/package.json sem script test) (ci)
- last seen: 2026-11-14T09:23:13Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
