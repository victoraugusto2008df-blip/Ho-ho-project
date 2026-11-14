# Dashboard do Lojista (ORD-08) checks

Profile: light
Plan: `.specs/features/ORD-08-analytics-lojista-dashboard/plan.md`

10 checks in 2 slices · 3 one-way doors · 0 open

## Checks

### S1 - Ticket médio e benchmark · 7 files · ~15 KB · ~4k

**C1** - A `GET /api/v1/analytics/lojista/dashboard` with a `LOJISTA` token responds `200` with a numeric `ticketMedio` equal to the average `valorTotal` of the loja's `APROVADA` notes, rounded to 2 decimals (AC 1)
Proof: `./mvnw -B test -Dtest=AnalyticsServiceTest#ticketMedioIsAverageOfValorTotal`
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#dashboardReturns200WithTicketMedio`

**C2** - A dashboard for a loja whose category has fewer than 3 active lojas responds with `benchmarkingDisponivel=false` and `mediaCategoria=null` (AC 2)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#fewerThanThreeActiveStoresHidesBenchmark`

**C3** - A dashboard for a loja whose category has 3 or more active lojas responds with `benchmarkingDisponivel=true` and a numeric `mediaCategoria` (AC 3)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#threeOrMoreActiveStoresReturnsBenchmark`

**C4** - The dashboard sources `lojaId` from `authentication.principal.lojaId`, ignoring any `lojaId` supplied in the query (AC 4)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#dashboardUsesPrincipalLojaIdNotQuery`

**C5** - `DashboardResponse` is a record with exactly six fields: `ticketMedio`, `benchmarkingDisponivel`, `mediaCategoria`, `horariosPico`, `diasPico`, `crossShopping` (Landing: response contract)
Proof: `./mvnw -B test -Dtest=DashboardResponseTest#recordCarriesContractFields`

**C6** - The benchmark is available only when the category has 3 or more distinct active lojas: below 3 the decision is `false`, at 3 or more it is `true` (Landing: ReN05 guard)
Proof: `./mvnw -B test -Dtest=KAnonymityGuardTest#benchmarkAvailableOnlyFromThreeActiveStores`

### S2 - Picos e Cross-Shopping · 4 files · ~10 KB · ~2.5k

**C7** - The dashboard returns `horariosPico` and `diasPico` as counts of the loja's `APROVADA` notes grouped by hour-of-day and by day-of-week (AC 5)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#dashboardReturnsPeakHoursAndDays`

**C8** - The dashboard returns `crossShopping` as the other categories the loja's customers also buy from, each with `categoria` and a `total` count (AC 6)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#dashboardReturnsCrossShopping`

**C9** - The dashboard response contains no `clienteId`, CPF or customer name anywhere in the payload (AC 7)
Proof: `./mvnw -B test -Dtest=AnalyticsDashboardIntegrationTest#responseContainsNoCustomerPii`

**C10** - Each `crossShopping` entry carries only `categoria` and `total`, never a customer identifier (Landing: cross-shopping privacy)
Proof: `./mvnw -B test -Dtest=CrossShoppingItemTest#carriesOnlyCategoriaAndTotal`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /api/v1/analytics/lojista/dashboard` statuses (1) | `200` C1 | - |
| ReN05 guard outcomes (2) | `benchmarkingDisponivel: false` C2 · `true` C3 | - |
| `DashboardResponse` fields (6) | C5, table-driven over all 6 | - |
| `crossShopping` entry fields (2) | `categoria` C10 · `total` C10 | - |

- Claims naming a status code or field value: C1, C2, C3 - each has a proof that crosses the boundary (MockMvc) or computes the value at its own layer.
- No other check claims more than the single case its proof exercises.

## Swept

- validation: C4
- failure modes: n/a - read-only GET, no write or partial-failure path
- idempotency: n/a - read-only GET is naturally idempotent
- authorization: existing - ORD-02 SecurityConfig (`anyRequest().authenticated()` + `@PreAuthorize("hasRole('LOJISTA')")`)
- concurrency: n/a - read-only projection over committed rows, no writes or races
- data lifecycle: n/a - reads existing tables, no TTL/archival/deletion
- dependency failure: n/a - only local DB reads, no external service call
- state transitions: n/a - read-only, no entity state changes
- observability: n/a - no logging or metrics requirement in this slice

## Handoff

Size, with the arithmetic, written after the checks exist and before any code. Estimate is
`wc -c` of the files each slice touches, divided by four.

- S1 = ~15 KB (`AnalyticsController`, `AnalyticsService`, `AnalyticsRepository`, `DashboardResponse` + `AnalyticsServiceTest`, `AnalyticsDashboardIntegrationTest`, `DashboardResponseTest`, `KAnonymityGuardTest`) ≈ 4k
- S2 = ~10 KB (peak/cross-shopping queries + `CrossShoppingItem`, `CrossShoppingItemTest` and the remaining integration cases) ≈ 2.5k
- Total ≈ 25 KB ≈ 6.5k tokens, under the 150k budget — one builder, no ask.

<Appended by each builder as it finishes, three lines each:>
