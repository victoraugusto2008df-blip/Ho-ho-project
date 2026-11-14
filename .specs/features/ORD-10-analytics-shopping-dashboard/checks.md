# Dashboard Executivo do Shopping (ORD-10) checks

Profile: light
Plan: `.specs/features/ORD-10-analytics-shopping-dashboard/plan.md`

10 checks in 3 slices · 5 one-way doors · 0 open

## Checks

### S1 - Acesso restrito ao ADMIN_SHOPPING · ~3 files · ~6 KB · ~1.5k

**C1** - A `GET /api/v1/analytics/shopping/dashboard` with an `ADMIN_SHOPPING` token responds `200` with a numeric `faturamentoTotal` (AC 1)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardReturns200ForAdmin`

**C2** - A `GET /api/v1/analytics/shopping/dashboard` with a `CONSUMIDOR` or `LOJISTA` token responds `403` (AC 2)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardForbiddenForConsumidorAndLojista`

**C3** - A `GET /api/v1/analytics/shopping/dashboard` with no token or an invalid token responds `401` (AC 3)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardUnauthorizedWithoutToken`

### S2 - Faturamento e distribuição por categoria · ~5 files · ~12 KB · ~3k

**C4** - `faturamentoTotal` equals the sum of `valor_total` of all `APROVADA` notes across all lojas, rounded to 2 decimals (AC 4)
Proof: `./mvnw -B test -Dtest=ShoppingAnalyticsServiceTest#faturamentoTotalIsSumOfAprovada`
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#faturamentoTotalMatchesAprovadaNotes`

**C5** - `distribuicaoPorCategoria` percentages sum to exactly `100.00` (AC 5, door: percentage split)
Proof: `./mvnw -B test -Dtest=ShoppingAnalyticsServiceTest#distribuicaoPercentualSomaCem`

**C6** - The dashboard response contains no `clienteId`, CPF, `cpf_mascarado` or customer name anywhere in the payload (AC 6)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardContainsNoPii`

### S3 - Heatmap e contadores · ~4 files · ~12 KB · ~3k

**C7** - `volumePorDiaHora` returns the count of `APROVADA` notes grouped by day-of-week and hour-of-day (AC 7)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardReturnsVolumePorDiaHora`

**C8** - `totalVouchersLiberados` equals the count of `vouchers_estacionamento` rows with `status = 'LIBERADO'` (AC 8, door: voucher count)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardCountsLiberadoVouchers`

**C9** - `totalCampanhasAtivas` equals the count of rows in the `campanhas` table (AC 9, door: campaign count)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardIntegrationTest#shoppingDashboardCountsCampanhas`

**C10** - `ShoppingDashboardResponse` is a record with exactly five fields: `faturamentoTotal`, `distribuicaoPorCategoria`, `volumePorDiaHora`, `totalVouchersLiberados`, `totalCampanhasAtivas` (door: response contract)
Proof: `./mvnw -B test -Dtest=ShoppingDashboardResponseTest#recordCarriesContractFields`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /api/v1/analytics/shopping/dashboard` statuses (3) | `200` C1 · `403` C2 · `401` C3 | - |
| `ShoppingDashboardResponse` fields (5) | C10, table-driven over all 5 | - |

- Claims naming a status code or response shape: C1, C2, C3 - each has a proof that crosses the boundary (MockMvc + Testcontainers).
- C4, C5 are proven at their own layer (service) and, for C4, also at the boundary.

## Swept

- validation: n/a - read-only GET with no request body or query input to validate
- failure modes: n/a - read-only GET, no write or partial-failure path
- idempotency: n/a - read-only GET is naturally idempotent
- authorization: C1, C2, C3
- concurrency: n/a - read-only projection over committed rows, no writes or races
- data lifecycle: n/a - reads existing tables, no TTL/archival/deletion
- dependency failure: n/a - only local DB reads, no external service call
- state transitions: n/a - read-only, no entity state changes
- observability: n/a - no logging or metrics requirement in this slice

## Handoff

Size, with the arithmetic, written after the checks exist and before any code. Estimate is
`wc -c` of the files each slice touches, divided by four.

- S1 = ~6 KB (`ShoppingAnalyticsController` + `ShoppingDashboardIntegrationTest` RBAC cases) ≈ 1.5k
- S2 = ~12 KB (`ShoppingAnalyticsService`, `CategoriaTotal`, `DistribuicaoCategoria` + `ShoppingAnalyticsServiceTest` and the faturamento/PII integration cases) ≈ 3k
- S3 = ~12 KB (`ShoppingAnalyticsRepository`, `VolumeDiaHora`, `ShoppingDashboardResponse` + `ShoppingDashboardResponseTest` and the remaining integration cases) ≈ 3k
- Total ≈ 30 KB ≈ 7.5k tokens, under the 150k budget — one builder, no ask.

- **Boundary:** C1-C10 closed (uncommitted — local build only, no `git commit` requested)
- **Settled mid-build:** none
- **Abandoned:** none
