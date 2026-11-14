# Dashboard do Lojista (ORD-08)

## Problem

The lojista opens the B2B portal (Tela 2) and there is no dashboard endpoint. The store's ticket médio, its category benchmark, its peak hours and its cross-shopping all sit uncomputed in `notas_fiscais` / `lojas` / `categorias`. A dashboard that exposed the category average without a guard would let a lojista whose category has one or two competitors reverse-engineer a rival's figures (ReN05), and a careless query would leak customer CPF or name (LGPD / RNF04).

When this ships, `GET /api/v1/analytics/lojista/dashboard` returns the authenticated lojista's ticket médio, the category benchmark (only when the category has 3 or more active lojas, otherwise `benchmarkingDisponivel: false`), peak hours/days and cross-shopping — with no customer identity anywhere in the payload.

## Flow

This reuses the `notas_fiscais`, `lojas` and `categorias` tables (ORD-01), the JWT principal carrying `lojaId` (ORD-02), and the existing `@PreAuthorize` role guard — no new persistence or config surface is introduced.

1. `GET /api/v1/analytics/lojista/dashboard` -> `AnalyticsController` (new, no door - placement per conventions) - requires `ROLE_LOJISTA` and reads `lojaId` from `authentication.principal.lojaId`
2. `AnalyticsController` -> `AnalyticsService` (new, no door) - orchestrates the four metrics
3. `AnalyticsService` -> `AnalyticsRepository` (new, no door - placement) - queries `notas_fiscais`, `lojas` and `categorias` (tables created in ORD-01) for ticket médio, benchmark, picos and cross-shopping
4. `AnalyticsService` (new, no door) - applies the ReN05 guard (door 2): count distinct active lojas in the category
5. out: `200` with the dashboard DTO (door 1); `401`/`403` are already produced by the ORD-02 security chain

## Impact

| Front | What changes |
| --- | --- |
| domain | new terms: `AnalyticsController`, `AnalyticsService`, `AnalyticsRepository`, `DashboardResponse` - all live in the `analytics` module |
| stored data | nothing to migrate - reads only; no table, column or seed is added |

## Relations

None - no stored-data shape change. This is a read-only projection over `notas_fiscais`, `lojas` and `categorias` (created in ORD-01).

## Surface

Only routes this adds or whose signature changes.

| Route | In | Out | Status |
| --- | --- | --- | --- |
| `GET /api/v1/analytics/lojista/dashboard` | none (`lojaId` from JWT) | `ticketMedio` · `benchmarkingDisponivel` · `mediaCategoria` · `horariosPico` · `diasPico` · `crossShopping` | `200` |

## Landing

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| Dashboard response contract | JSON `{ "ticketMedio": <number>, "benchmarkingDisponivel": <bool>, "mediaCategoria": <number|null>, "horariosPico": [{"hora": 0..23, "total": <int>}], "diasPico": [{"diaSemana": <string>, "total": <int>}], "crossShopping": [{"categoria": <string>, "total": <int>}] }` | a nested envelope or camel/snake mix - ORD-11 binds to these exact field names |
| ReN05 guard | `mediaCategoria` is returned only when the category has >= 3 distinct active lojas; otherwise `benchmarkingDisponivel: false` and `mediaCategoria: null` | returning the average regardless of the store count - leaks a rival's figures when the category is thin (ReN05) |
| Cross-shopping privacy | `crossShopping` carries only `categoria` + `total` (count), aggregated - never `clienteId`, CPF or customer name | including `clienteId`/`cpf_mascarado`/nome - violates LGPD (RNF04) |

- Nothing else in this change is hard to reverse

## Criteria

### S1: Ticket médio e benchmark com K-Anonymity (P1)

The store's ticket médio is returned, and the category benchmark obeys ReN05.

**Acceptance Criteria**

1. WHEN a `GET /api/v1/analytics/lojista/dashboard` is called with a `LOJISTA` token THEN the system SHALL respond `200` with `ticketMedio` equal to the average `valorTotal` of the loja's `APROVADA` notes, rounded to 2 decimals
2. IF the loja's category has fewer than 3 distinct active lojas THEN the system SHALL respond with `benchmarkingDisponivel: false` and `mediaCategoria: null` (ReN05)
3. IF the loja's category has 3 or more distinct active lojas THEN the system SHALL respond with `benchmarkingDisponivel: true` and `mediaCategoria` equal to the average `valorTotal` of the `APROVADA` notes across those active lojas
4. The system SHALL source `lojaId` exclusively from `authentication.principal.lojaId`, never from the request body or query parameters

**Independent test:** a `LOJISTA` token for the seeded `lojista@shopping.com` (loja `22222222-2222-2222-2222-222222222201`, category Vestuário with 3 active lojas) -> `200` with `benchmarkingDisponivel: true`; a `LOJISTA` token for loja `22222222-2222-2222-2222-222222222204` (Burger King, Alimentação with 1 active loja) -> `benchmarkingDisponivel: false` and `mediaCategoria: null`.

### S2: Picos de movimento e Cross-Shopping (P1)

Peak hours/days and cross-shopping are returned without exposing customer identity.

**Acceptance Criteria**

5. The system SHALL return `horariosPico` and `diasPico` as counts of the loja's `APROVADA` notes grouped by hour-of-day and by day-of-week
6. The system SHALL return `crossShopping` as the other categories the loja's customers also buy from, each with `categoria` and a `total` count
7. The system SHALL NOT include any `clienteId`, CPF or customer name anywhere in the response

**Independent test:** the dashboard for the seeded lojista returns `horariosPico`/`diasPico` derived from the 15 seeded `APROVADA` notes, and `crossShopping` entries carry only `categoria` + `total` (a full scan of the JSON finds no `clienteId`, no 11-digit CPF, and no `nome`).

## Out of scope

| Excluded | Why |
| --- | --- |
| Campaign management (`POST /api/v1/campanhas`) | ORD-09 - separate card |
| Shopping-wide executive dashboard | ORD-10 - separate card |
| `itens_nota` per-item granularity | ADR-03 (YAGNI) - MVP operates on the note total only |
| Caching / materialized views | premature for a demo; queries run against the live tables |

## Assumptions

| Assumption | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Ticket médio metric | average `valorTotal` of `APROVADA` notes, 2 decimal places | the value the portal's KPI card shows | n |
| Category benchmark metric | average `valorTotal` of `APROVADA` notes across the active lojas of the category | matches ReN05 ("média da categoria") | n |
| Peak metric | count of notes grouped by hour-of-day and day-of-week | "horários/dias de pico" = when most purchases happen | n |
| Cross-shopping aggregation | other categories ranked by note count descending | "quais outras categorias mais consomem" | n |
| `mediaCategoria` when unavailable | `null` (field always present) | the front switches on `benchmarkingDisponivel`, not on field absence | n |

**Open questions:** none - all resolved or logged above.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| API `GET /api/v1/analytics/lojista/dashboard` | response shape | AC 1, AC 5, AC 6 |
| API `GET /api/v1/analytics/lojista/dashboard` | error shape and codes | existing - ORD-02 security chain (401/403, empty body) |
| API `GET /api/v1/analytics/lojista/dashboard` | who may call it | existing - ORD-02 RBAC (`@PreAuthorize("hasRole('LOJISTA')")`) |
| all new `/api/v1/analytics/*` | versioning, rate limits | n/a - single MVP version; rate limiting deferred to v2 (RNF06) |

## Sources

- GitHub Issue [#8](https://github.com/victoraugusto2008df-blip/Ho-ho-project/issues/8): `[ORD-08] BACK — Dashboard do Lojista + Trava K-Anonymity (ReN05)`
- Architecture & ADRs: `.docs/architecture/architecture-and-domain.md` (module `analytics`, API contract)
- Requirements: `.docs/markdown/requirements.md` (ReN05, RNF04)
- Planning Kanban: `.docs/planning/mvp-sabado-kanban.md` (Card ORD-08)
