# Lessons

Operational memory across features. Tracked machine-readable in `lessons.json`.

## Promoted (trusted defaults - apply across all cards)

_none yet_

## Candidate (apply only when the card touches the named scope)

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

### L-013 - A text assertion over React output must read each element's own text, not raw text nodes: JSX like {n}/{44} renders as 3 separate nodes
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-tests` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C4 (frontend-tests)
- last seen: 2026-11-14T07:46:44Z

### L-014 - After a mutation that invalidates queries, wait for queryClient.isFetching() and isMutating() to reach 0 before asserting the list did not change
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-tests` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C20 (frontend-tests)
- last seen: 2026-11-14T07:46:44Z

### L-015 - An only-from-library rule is proven by an allowlist of import sources over every file the card touches, never by a blocklist of rival libraries
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-proofs` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C3 (frontend-proofs)
- last seen: 2026-11-14T07:46:44Z

### L-016 - A percentage that unlocks a goal must reach 100 only when the value reaches the goal: truncate below it, and test the value one cent under the boundary
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `frontend-rules` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.md C33/C42 (frontend-rules)
- last seen: 2026-11-14T07:46:44Z

### L-017 - Every default the plan sets differently from a binding capture (a checkbox state, a prefilled value) is asked in the plan phase and listed in Differences from the source, not left as an unconfirmed Assumption
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `frontend-screens` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.md LGPD / AD-015 (frontend-screens)
- last seen: 2026-11-14T07:46:44Z

### L-018 - Take the running picture at the capture's exact pixel size (window height included) from the first round: a full-page screenshot of a taller page fails the gate after the last screens round
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `frontend-screens` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: screens.rodadas1-2-9ba30d7.md (frontend-screens)
- last seen: 2026-11-14T07:46:45Z

### L-019 - Antes de salvar a imagem de uma tela com Recharts, esperar as barras (.recharts-bar-rectangle) existirem e abrir a imagem salva: o ResponsiveContainer desenha depois do primeiro layout.
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `frontend/recharts` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C1 (frontend/recharts)
- last seen: 2026-11-14T14:51:45Z

### L-020 - Percentual com sinal: arredondar a magnitude e reaplicar o sinal, e testar o meio exato (x,x5) nos dois sinais; Math.round arredonda meio para +infinito.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend/regras` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C31 / regras.ts gapDoTicket (frontend/regras)
- last seen: 2026-11-14T14:51:46Z

### L-021 - Teste de destaque em grafico afirma a contagem exata de rotulos e o valor literal da cor, nao 'existe algum' nem 'e diferente da cor padrao'.
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend/tests` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C9 (frontend/tests)
- last seen: 2026-11-14T14:51:46Z

## Quarantined (failed when applied - ignore)

_none_
