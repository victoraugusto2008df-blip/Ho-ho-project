# Dashboard Executivo do Shopping (ORD-10)

## Problem

The shopping administration opens the executive portal (Tela 3) and there is no endpoint consolidating the shopping-wide figures. Total captured revenue, the per-category revenue split, the purchase heatmap, the vouchers issued and the active campaigns all sit uncomputed across `notas_fiscais`, `categorias`, `vouchers_estacionamento` and `campanhas`. A route that leaked customer identity, or that a lojista could call to read a competitor's aggregate, would violate LGPD (RNF04) and the profile isolation from ORD-02.

When this ships, `GET /api/v1/analytics/shopping/dashboard` returns — for the `ADMIN_SHOPPING` profile only — the total captured revenue, the per-category percentage split (summing to 100%), the day-by-hour purchase volume for the heatmap, the total released parking vouchers and the total active campaigns, with no personally identifiable data anywhere in the payload.

## Flow

This reuses the `notas_fiscais`, `categorias`, `vouchers_estacionamento` and `campanhas` tables (ORD-01), the JWT principal (ORD-02), and the `JdbcTemplate` aggregation pattern already in use by the lojista `AnalyticsRepository` (ORD-08) — no new persistence or config surface is introduced.

1. `GET /api/v1/analytics/shopping/dashboard` -> `ShoppingAnalyticsController` (new, no door - placement per conventions) - requires `ROLE_ADMIN_SHOPPING` (door 2) via `@PreAuthorize`
2. `ShoppingAnalyticsController` -> `ShoppingAnalyticsService` (new, no door) - orchestrates the five metrics with no tenant filter (shopping-wide)
3. `ShoppingAnalyticsService` -> `ShoppingAnalyticsRepository` (new, no door - placement) - queries `notas_fiscais`, `categorias`, `vouchers_estacionamento` and `campanhas` via `JdbcTemplate` (pattern exists in ORD-08)
4. out: `200` with the dashboard DTO (door 1); `401`/`403` produced by the ORD-02 security chain (exists)

## Impact

| Front | What changes |
| --- | --- |
| domain | new terms: `ShoppingAnalyticsController`, `ShoppingAnalyticsService`, `ShoppingAnalyticsRepository`, `ShoppingDashboardResponse`, `DistribuicaoCategoria`, `VolumeDiaHora` - all live in the `analytics` module |
| stored data | nothing to migrate - read-only; no table, column or seed is added. `campanhas` is read directly because ORD-09's entity is not yet merged |

## Relations

None - no stored-data shape change. This is a read-only projection over `notas_fiscais`, `categorias`, `vouchers_estacionamento` and `campanhas` (all created in ORD-01).

## Surface

Only routes this adds or whose signature changes.

| Route | In | Out | Status |
| --- | --- | --- | --- |
| `GET /api/v1/analytics/shopping/dashboard` | none (role from JWT) | `faturamentoTotal` · `distribuicaoPorCategoria` · `volumePorDiaHora` · `totalVouchersLiberados` · `totalCampanhasAtivas` | `200`, `401`, `403` |

## Landing

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| Dashboard response contract | JSON `{ "faturamentoTotal": <number>, "distribuicaoPorCategoria": [{"categoria": <string>, "percentual": <number>}], "volumePorDiaHora": [{"diaSemana": <string>, "hora": 0..23, "total": <int>}], "totalVouchersLiberados": <int>, "totalCampanhasAtivas": <int> }` | a nested envelope or camel/snake mix - ORD-12 binds to these exact field names |
| Role guard | `@PreAuthorize("hasRole('ADMIN_SHOPPING')")` on the controller; `CONSUMIDOR`/`LOJISTA` get `403` | `hasAnyRole(...)` or no guard - would let a lojista read shopping-wide aggregates of competitors |
| Percentage split sum | `distribuicaoPorCategoria` percentages are rounded to 2 decimals with the largest category absorbing the residual so the list sums to exactly `100.00` | naive rounding that sums to `99.99`/`100.01` - breaks the ORD-12 pie chart and the "soma 100%" acceptance criterion |
| Voucher count semantics | `totalVouchersLiberados` = `COUNT(*)` of `vouchers_estacionamento` with `status = 'LIBERADO'` | counting `UTILIZADO`/`EXPIRADO` - overstates the "liberados" KPI on Tela 3 |
| Campaign count semantics | `totalCampanhasAtivas` = `COUNT(*)` of `campanhas` (the table has no active flag) | a `status` filter that does not exist - the `campanhas` table has no active/inactive column |

- Nothing else in this change is hard to reverse

## Criteria

### S1: Acesso restrito ao ADMIN_SHOPPING (P1)

Only the shopping administration profile reaches the executive dashboard.

**Acceptance Criteria**

1. The system SHALL restrict `GET /api/v1/analytics/shopping/dashboard` to the `ADMIN_SHOPPING` role, responding `200` for a valid `ADMIN_SHOPPING` token
2. IF a request to `GET /api/v1/analytics/shopping/dashboard` carries a `CONSUMIDOR` or `LOJISTA` token THEN the system SHALL respond `403`
3. IF a request to `GET /api/v1/analytics/shopping/dashboard` carries no token or an invalid token THEN the system SHALL respond `401`

**Independent test:** `MockMvc`/Testcontainers call with `admin@shopping.com` token -> `200`; `consumidor@shopping.com` and `lojista@shopping.com` tokens -> `403`; no token -> `401`.

### S2: Faturamento total e distribuição por categoria (P1)

Total captured revenue and its per-category percentage split are returned.

**Acceptance Criteria**

4. The system SHALL return `faturamentoTotal` equal to the sum of `valor_total` of all `APROVADA` notes across all lojas, rounded to 2 decimals
5. The system SHALL return `distribuicaoPorCategoria` as each category's percentage of `faturamentoTotal`, and the percentages SHALL sum to exactly `100.00`
6. The system SHALL NOT include any `clienteId`, CPF, `cpf_mascarado` or customer name anywhere in the response (LGPD)

**Independent test:** the dashboard `faturamentoTotal` equals the sum of the 15 seeded `APROVADA` notes plus any new note; `distribuicaoPorCategoria` percentages sum to `100.00`; a full JSON scan finds no PII.

### S3: Heatmap de volume e contadores de vouchers/campanhas (P1)

The day-by-hour purchase volume and the voucher/campaign counters are returned.

**Acceptance Criteria**

7. The system SHALL return `volumePorDiaHora` as the count of `APROVADA` notes grouped by day-of-week and hour-of-day
8. The system SHALL return `totalVouchersLiberados` equal to the count of `vouchers_estacionamento` rows with `status = 'LIBERADO'`
9. The system SHALL return `totalCampanhasAtivas` equal to the count of rows in the `campanhas` table

**Independent test:** `volumePorDiaHora` matches the day/hour distribution of the 15 seeded notes; `totalVouchersLiberados` matches the vouchers emitted in ORD-06; `totalCampanhasAtivas` matches the campaigns created in ORD-09.

## Out of scope

| Excluded | Why |
| --- | --- |
| Lojista dashboard (`GET /api/v1/analytics/lojista/dashboard`) | ORD-08 - already shipped |
| Campaign creation (`POST /api/v1/campanhas`) | ORD-09 - separate card |
| Per-lojista drill-down of the executive figures | Tela 3 shows shopping-wide aggregates only |
| Caching / materialized views | premature for a demo; queries run against the live tables |

## Assumptions

| Assumption | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Heatmap day-of-week numbering | ISO `1..7` (Monday..Sunday), hour `0..23` | matches `EXTRACT(ISODOW ...)` already used by the lojista `picosPorDia` | n |
| Empty heatmap cells | omitted from the response (only cells with `total > 0`) | a dense 24x7 grid is wasteful; ORD-12 renders only non-empty cells | n |

**Open questions:** none - all resolved or logged above.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| API `GET /api/v1/analytics/shopping/dashboard` | response shape | AC 4, AC 5, AC 7, AC 8, AC 9 |
| API `GET /api/v1/analytics/shopping/dashboard` | error shape and codes (`401`/`403`) | existing - ORD-02 security chain (empty body) |
| API `GET /api/v1/analytics/shopping/dashboard` | who may call it | AC 1, AC 2, AC 3 |
| all new `/api/v1/analytics/*` | versioning, rate limits | n/a - single MVP version; rate limiting deferred to v2 (RNF06) |

## Sources

- GitHub Issue [#10](https://github.com/victoraugusto2008df-blip/Ho-ho-project/issues/10): `[ORD-10] BACK — Dashboard Executivo do Shopping (GET /api/v1/analytics/shopping/dashboard)`
- Architecture & ADRs: `.docs/architecture/architecture-and-domain.md` (module `analytics`, API contract)
- Requirements: `.docs/markdown/requirements.md` (RF12, RNF04)
- Planning Kanban: `.docs/planning/mvp-sabado-kanban.md` (Card ORD-10)
- `.local-tasks/ORD-10.md` (Issue #10 — critérios de aceite e DoD)
