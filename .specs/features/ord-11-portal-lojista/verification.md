# ORD-11 - Tela 2: Portal do Lojista verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 789fed0
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | browser picture `captures/figura3-portal-lojista.running.png` vs `captures/figura3-portal-lojista.png` | no - in the saved picture the "Horários de pico" card is blank (no axes, grid or bars), while the capture draws the 12-bar chart; a headless Chrome at 1317px on the same `HEAD` draws the chart, so it is the picture that is wrong, not the code |
| C2 | `PortalLojista.test.tsx` `C2 App escolhe a Tela 2 só com tela=lojista` | yes - table-driven on `/`, `?tela=lojista` and `?tela=shopping`, asserting presence and absence of both screens through the real `App` |
| C3 | `PortalLojista.test.tsx` `C3 card de ticket médio mostra o valor em reais` | yes - 142.3 / 1234.5 / 0 asserted inside the "Ticket médio" card |
| C4 | `PortalLojista.test.tsx` `C4 benchmarking liberado mostra as duas barras e o gap com sinal` | yes - asserts the pure `gapDoTicket` values (including `null` for an average of 0) and, on screen, both bars plus "-32,2%", "+8,3%" and "0,0%" |
| C5 | `PortalLojista.test.tsx` `C5 benchmarking bloqueado mostra cadeado e explicação da ReN05` | yes - asserts the title, the text, `svg.lucide-lock` inside `.border-dashed` with the warning token, that "Sua loja" is kept, and that the average and gap are absent |
| C6 | `PortalLojista.test.tsx` `C6 média da categoria nunca aparece com o benchmarking bloqueado` | yes - `document.body.textContent` does not contain "210" with `false`+210, and `true`+`null` shows the blocked block |
| C7 | `PortalLojista.test.tsx` `C7 aviso de K-Anonymity aparece com o benchmarking liberado` | yes - matches the full normalized text |
| C8 | `lojista.test.ts` `C8 horas do pico são preenchidas de ponta a ponta com zero` + `PortalLojista.test.tsx` `C8 gráfico de pico desenha uma barra por hora` | yes - gaps, empty input and out-of-order input; 12 `.recharts-bar-rectangle` on screen (with jsdom's `getBoundingClientRect` stubbed) |
| C9 | `lojista.test.ts` `C9 resumo do pico usa a maior hora com desempate pela mais cedo` + `PortalLojista.test.tsx` `C9 barra de pico destacada e legenda do pico na tela` | partly - the text, 23h–0h and the tie are exact; on screen the label assertion is `some(text === '175')` (not "only above the peak"), and "cor mais escura" is asserted only as `COR_PICO !== primary` |
| C10 | `PortalLojista.test.tsx` `C10 ver dados em tabela abre a tabela de horários e vendas` | yes - no table before the click; headers; 12 rows; contents of rows 0 and 9 |
| C11 | `PortalLojista.test.tsx` `C11 afinidade lista as 6 maiores categorias com contagem de compras` | yes - 8→6, descending order, tie Beta/Zeta by name, widths 100%/50%, subtitle, footer, "1 compra" |
| C12 | `PortalLojista.test.tsx` `C12 pico e afinidade vazios mostram o estado vazio` | yes |
| C13 | `PortalLojista.test.tsx` `C13 card de campanha mostra segmento desconto e botão fixos` | yes |
| C14 | `PortalLojista.test.tsx` `C14 disparar campanha envia o corpo fixo e mostra o público atingido` | yes - table-driven 312/1/0, called once, exact body |
| C15 | `PortalLojista.test.tsx` `C15 botão de campanha fica desabilitado durante o disparo` | yes - `disabled` with "Disparando…", a second click makes no second call, re-enabled after resolving |
| C16 | `PortalLojista.test.tsx` `C16 falha no disparo mostra o erro e reabilita o botão` | yes |
| C17 | `lojista.test.ts` `C17 backend real chama o dashboard e a campanha pelo fetcher` | yes - path, method, header and literal body; a 500 rejects. `fetchSemSessao` prefixes `/api/v1` (`realNotasApi.ts:48`) |
| C18 | `lojista.test.ts` `C18 só VITE_BACKEND_LOJISTA true liga o backend real da Tela 2` | yes - 5 cases; `setup.ts` runs `unstubAllEnvs` after each test |
| C19 | command `npm run build:demo` / `build:integrado` + `grep` on `dist/assets/*.js` | yes - with `demo`, `/api/v1`, `/campanhas` and `/analytics/lojista` are absent; with `integrado` the two routes are present |
| C20 | `PortalLojista.test.tsx` `C20 nenhum seletor de loja e nenhum lojaId nas requisições` | yes |
| C21 | `PortalLojista.test.tsx` `C21 os quatro cards de dados mostram carregando` | yes - `role=status` named "Carregando…" in each of the 4 cards and no "R$" |
| C22 | `PortalLojista.test.tsx` `C22 erro do dashboard mostra tentar novamente e mantém a campanha` | yes - 4 messages, 4 buttons, campaign enabled, second `GET` and data after retrying |
| C23 | `PortalLojista.test.tsx` `C23 cabeçalho mostra título e selos` | yes |
| C24 | `lojista.test.ts` `C24 mock devolve o dashboard e a campanha na forma do contrato` | yes - unblocked and blocked through the URL, hours 10–21, peak at 19h, 6 categories, 312 and ISO `criadoEm` |
| C25 | command `grep` for hex, emoji and imports in `src/features/lojista` + `src/App.tsx` | yes - the only hex values are in `chartPalette.ts` (`COR_PICO` = `--palette-blue-800`, the same as `--color-analytics-deep`); icons come only from `lucide-react` |
| C26 | `lojista.test.ts` `C26 paleta dos gráficos é a do guia de design system` | yes - the 6 values from the guide §3 Exemplo 5 |
| C27 | `PortalLojista.test.tsx` `C27 valores percentuais e contagens da Tela 2 usam tabular-nums` | yes for what the check names (R$, %, compras/vendas, with more than 8 matches); it does not cover the blocked state or bare numbers (the X axis "10h", the peak label in thousands) |
| C28 | `PortalLojista.test.tsx` `C28 controles selos e blocos da Tela 2 usam Button Badge e Card` | yes |
| C29 | walk - DevTools console over `/?tela=lojista`, table, campaign, `&benchmarking=bloqueado` | yes (author's walk; I could not re-attest the console. In headless Chrome at `HEAD`, both states render with the chart, the blocked block and the campaign) |
| C30 | walk - at 375px `scrollWidth === clientWidth` | yes (author's walk; headless Chrome clamps the viewport to 500px, so I could not reproduce 375px. From the code, the fixed grids add up to about 216px plus the bar, the badges are `whitespace-nowrap` at ~230px, and the header has `flex-wrap`, so it fits in 343px) |
| C31 | `PortalLojista.test.tsx` `C31 gap arredonda a magnitude igual nos dois sinais` | yes - appended after the Verifier's round and read by the orchestrator, not by the independent Verifier: `gapDoTicket(183.5, 200)` must be -8.3 (the code of `789fed0` gave -8.2, so it fails there), `216.5` gives 8.3, and the screen shows "-8,3%" |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The C1 picture does not show the peak chart: the "Horários de pico" card is blank between the subtitle and the caption, while the capture draws 12 bars with the 19h bar highlighted. The code draws it (headless Chrome at 1317px on `HEAD` 789fed0 shows the axes, the 12 bars, the dark 19h bar and "175"), so the picture was taken before the `ResponsiveContainer` was measured | `captures/figura3-portal-lojista.running.png`, the area between "Vendas identificadas por faixa horária" and "Pico às 19h–20h…" is empty; `captures/figura3-portal-lojista.png` draws the chart | retake the picture at 1317px after the chart renders (wait for `.recharts-bar-rectangle` before saving) and send it to the screens sub-agent | picture retaken at `ecf3ca3` after 12 `.recharts-bar-rectangle` rendered (no code commit: the code already drew the chart); C1 judged again by screens round 2 at `ecf3ca3` |
| The gap rounds differently by sign: a difference of exactly 8.25% gives "+8,3%" when positive and "-8,2%" when negative, because `Math.round` rounds half toward +∞. The AC asks for one decimal place with a sign, and the magnitude should not depend on the sign | `frontend/src/features/lojista/regras.ts:24` - `Math.round(((ticketMedio - mediaCategoria) / mediaCategoria) * 1000) / 10`; throwaway example: `gapDoTicket(183.5, 200)` → -8.2 and `gapDoTicket(216.5, 200)` → 8.3 | round the absolute value and reapply the sign (keeping `0` without "-"), and add the case 183.5 vs 200 → "-8,3%" to C4 | `bde6a0e` - C31 (appended) proves -8,3 / +8,3 and "-8,3%" on screen |
| C9 on screen is looser than its claim: "o valor do pico aparece acima dela" is checked with `some(t => t.textContent === '175')` (the test's own comment says "uma vez só", but that is not asserted), and "cor mais escura" only as `COR_PICO !== CHART_PALETTE.primary` | `frontend/src/features/lojista/PortalLojista.test.tsx:203-206` | assert that exactly one bar label exists (`svg text` from `rotuloPico` = 1) and that it is the peak's; assert `COR_PICO` equal to the expected dark tone (`#1E40AF`) | `bde6a0e` - C9's on-screen test now asserts exactly one bar label, equal to "175", and `COR_PICO` equal to Blue 800 |

Probes with no finding: `topCrossShopping` with 7 categories tied at the 6/7 cut (`Fx` before `Gx`), accented names (`Alimentação, Ótica, Pets`), an empty list; `preencherHoras` and `resumoDoPico` over 24 hours (peak at 23h → "23h–0h"), hour 0, thousands ("5.000 vendas", "6.234"); `mensagemCampanha(1500)` → "1.500 clientes". `horariosPico` with every `total` 0 yields "Pico às 10h–11h com 0 vendas (0,0% do total de 0)." - the plan only defines the empty array as the empty state, so this is not a finding, just a note.
