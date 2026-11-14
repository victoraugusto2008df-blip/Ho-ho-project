# ORD-14-ensaio-demo verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at a2dfdf0
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `ShoppingDashboardIntegrationTest.java` `faturamentoSumsOnlyApprovedReceipts` | yes - total equals the SQL sum, unchanged after a REJEITADA of 500.00, +150.00 after 65.00 and 85.00 (the 2 decimals are held only by C2) |
| C2 | `ShoppingDashboardIntegrationTest.java` `emptyDatabaseYieldsZerosAndNoCategories` | yes - raw body has `"faturamentoTotal":0.00`, counts 0 and 0, empty array |
| C3 | `ShoppingDashboardIntegrationTest.java` `countsEveryVoucherAndEveryCampaign` | yes - counts equal the table row counts, +1 each after one insert (voucher `UTILIZADO`, old date) |
| C4 | `ShoppingDashboardIntegrationTest.java` `faturamentoPorCategoriaIsSortedAndAddsUpToTheTotal` | yes - exact set of 3 names, descending values, each value equals the SQL sum, lines add up to the total, "Farmácia & Beleza" absent |
| C5 | `ShoppingDashboardIntegrationTest.java` `onlyAdminShoppingMaySeeTheDashboard` | yes - 200, 401, 403, 403 |
| C6 | captures/figura4-portal-shopping.running.png (judged in screens.md) | yes - judged by the screens sub-agent |
| C7 | `PortalShopping.test.tsx` `SHOP-07 a rota do shopping monta a Tela 3 e chama o backend com o Bearer` | yes - h1, value from the backend, shell footer, no "ORD-12", `Authorization: Bearer <token>` on every call to the route |
| C8 | `PortalShopping.test.tsx` `SHOP-08 indicadores mostram faturamento vouchers e campanhas` | yes - "R$ 3.150,40" and "R$ 0,00" inside the card, the legend, 7 and 3 then 0 and 0 as exact card text |
| C9 | `PortalShopping.test.tsx` `SHOP-09 faturamento por segmento lista as categorias com barra proporcional` | no - names, values and widths 100/33/25 are held, but the fixture arrives already from largest to smallest, so "na ordem recebida" is not: a card that re-sorts by value passes |
| C10 | `PortalShopping.test.tsx` `SHOP-10 sem categorias mostra o estado vazio` | yes - the text, no bar, no list |
| C11 | `PortalShopping.test.tsx` `SHOP-11 indicadores e card mostram carregando` | yes - `aria-busy` and the status "Carregando…" in each of the 4 cards, no value shown |
| C12 | `PortalShopping.test.tsx` `SHOP-12 erro do dashboard mostra tentar novamente e recupera` | yes - exact alert text, one more fetch after the click, data shown, alert and button gone |
| C13 | `RoteiroDemoE2ETest.java` `roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo` | yes - 422, `code`, exact `message`, `notas_fiscais` still 17 (the key comes from `MockSefazGateway.CHAVE_EXPIRADA_96H`, not the literal) |
| C14 | `RoteiroDemoE2ETest.java` `roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo` | yes - 201 and 201, 150.00, 100, 0.00, true, `HOHO-PARK-` prefix (keys come from the gateway constants, not the literals) |
| C15 | `RoteiroDemoE2ETest.java` `roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo` | yes - `ticketMedio` equals (sum before + 65.00) / (count before + 1) HALF_UP 2, campaign 201 with `publicoAtingido` 2 |
| C16 | `RoteiroDemoE2ETest.java` `roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo` | yes - total before + 150.00, 1 and 1, with 0 and 0 asserted before |
| C17 | `RoteiroDemoE2ETest.java` `roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo` | yes - 2 rounds, each after `DROP SCHEMA` + `flyway.migrate()` (17, 0, 0), real login of the 3 users with role asserted, no write between steps; with the clock at tomorrow noon the 150.00 of the day and the 2 notes of today only close if gateway, `FiscalService` and `EstacionamentoService` read the same clock |
| C18 | `.docs/qa/roteiro-demo.md` (lone proof: `grep -qF` of 14 terms and `grep -c 'Plano B'` >= 4) | no - the file holds every item on reading, but the proof stays green with a step missing its plan B ("## Plano B geral" is the 5th line with the term) and never looks for the profile, the control or the expected result of a step |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| C9 does not hold "na ordem recebida": a card that sorts by value passes | `frontend/src/features/shopping/PortalShopping.test.tsx:19-23` - the fixture is 2000, 650.4, 500, already descending; `:83-87` asserts that same order | send the categories out of value order in SHOP-09 (e.g. 500, 2000, 650.4) and assert the list and the widths in the received order | ab3c3c3 - C9 |
| C18's proof does not hold "um plano B por passo" nor the profile, control and expected result of each step | `checks.md:70` - `grep -c 'Plano B'` >= 4 counts `.docs/qa/roteiro-demo.md:94` ("## Plano B geral") together with `:56`, `:68`, `:79`, `:90`; removing one step's plan B leaves 4; "Perfil", "O que fazer" and "Resultado esperado" are not searched | check each "## Passo N" section for `**Perfil:**`, `**O que fazer:**`, `**Resultado esperado:**` and `**Plano B:**` (e.g. `awk` per section, or count each label >= 4 with "Plano B:" instead of "Plano B") | ab3c3c3 - C19 |
| The capture draws the money compact and criterion 6 fixes it in full, with no row in `Differences from the source` | `captures/figura4-portal-shopping.png` shows "R$ 1,39 mi" in "Faturamento identificado" and "R$ 421,4 mil" in the segment rows; `plan.md:112` and C8 fix "R$ 3.150,40", C9's test fixes "R$ 2.000,00" (`PortalShopping.test.tsx:84`) | add the row to `## Differences from the source` and have the user confirm it, or format as the capture does | ab3c3c3 - AD-035, linha em Differences from the source |
| AC 1's "com 2 casas" is held only on the empty database | `ShoppingDashboardIntegrationTest.java:68`, `:72` compare with `isEqualByComparingTo`, which accepts `3150.4`; only `:85` reads the raw body | in C1 assert the raw body, e.g. that it contains `"faturamentoTotal":` followed by the expected value with 2 decimals | ab3c3c3 - C1 |
| The E2E takes the three keys from the production constants, not from the literals AC 11 and AC 12 fix | `RoteiroDemoE2ETest.java:104`, `:112`, `:113` use `MockSefazGateway.CHAVE_*`; a changed constant keeps the test green while `.docs/qa/roteiro-demo.md:39-41` and `frontend/src/features/consumidor/chavesDemo.ts:7,9,15` break | write the three 44-digit keys as literals in the test | ab3c3c3 - C13, C14 |
| The diff loosened another feature's test of "sair esvazia o cache" and no check names the rule | `frontend/src/app/shell.test.tsx:76-78` - `getAll()` `toHaveLength(0)` became "no query with data"; a query entry recreated at logout now passes | name the rule in a check (what may remain in the cache after "Sair") or restore the strict assertion with the screen unmounted | ab3c3c3 - C20 |
| Rules the diff added that no check names: the tie-break by name and the default clock | `AnalyticsRepository.java:120` `ORDER BY valor DESC, c.nome` - no test has two categories with equal sums; the E2E replaces the `Clock` with a `@Primary` bean (`RoteiroDemoE2ETest.java:47-56`), so Coverage's "aplicação (`ClockConfig`) C17" is not held by C17 | add a tie case to C4; point the Coverage row at a test that runs on the application's own clock, or mark it unproven | ab3c3c3 - C4 (empate), C21 (relógio) |
