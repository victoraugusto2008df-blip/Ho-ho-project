# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - A text assertion over React output must read each element's own text, not raw text nodes: JSX like {n}/{44} renders as 3 separate nodes
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-tests` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C4 (frontend-tests)
- last seen: 2026-11-14T07:46:44Z

### L-002 - After a mutation that invalidates queries, wait for queryClient.isFetching() and isMutating() to reach 0 before asserting the list did not change
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-tests` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C20 (frontend-tests)
- last seen: 2026-11-14T07:46:44Z

### L-003 - An only-from-library rule is proven by an allowlist of import sources over every file the card touches, never by a blocklist of rival libraries
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-proofs` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.rodada1-70cef7a.md C3 (frontend-proofs)
- last seen: 2026-11-14T07:46:44Z

### L-004 - A percentage that unlocks a goal must reach 100 only when the value reaches the goal: truncate below it, and test the value one cent under the boundary
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `frontend-rules` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.md C33/C42 (frontend-rules)
- last seen: 2026-11-14T07:46:44Z

### L-005 - Every default the plan sets differently from a binding capture (a checkbox state, a prefilled value) is asked in the plan phase and listed in Differences from the source, not left as an unconfirmed Assumption
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `frontend-screens` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: verification.md LGPD / AD-015 (frontend-screens)
- last seen: 2026-11-14T07:46:44Z

### L-006 - Take the running picture at the capture's exact pixel size (window height included) from the first round: a full-page screenshot of a taller page fails the gate after the last screens round
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `frontend-screens` · harmful: 0
- features: ord-07-portal-consumidor
- evidence: screens.rodadas1-2-9ba30d7.md (frontend-screens)
- last seen: 2026-11-14T07:46:45Z

### L-007 - Antes de salvar a imagem de uma tela com Recharts, esperar as barras (.recharts-bar-rectangle) existirem e abrir a imagem salva: o ResponsiveContainer desenha depois do primeiro layout.
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `frontend/recharts` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C1 (frontend/recharts)
- last seen: 2026-11-14T14:51:45Z

### L-008 - Percentual com sinal: arredondar a magnitude e reaplicar o sinal, e testar o meio exato (x,x5) nos dois sinais; Math.round arredonda meio para +infinito.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend/regras` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C31 / regras.ts gapDoTicket (frontend/regras)
- last seen: 2026-11-14T14:51:46Z

### L-009 - Teste de destaque em grafico afirma a contagem exata de rotulos e o valor literal da cor, nao 'existe algum' nem 'e diferente da cor padrao'.
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend/tests` · harmful: 0
- features: ord-11-portal-lojista
- evidence: C9 (frontend/tests)
- last seen: 2026-11-14T14:51:46Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
