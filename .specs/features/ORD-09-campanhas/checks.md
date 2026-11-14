# Disparo de Campanha em 1 Clique (POST /api/v1/campanhas) - Checks

Profile: light
Plan: .specs/features/ORD-09-campanhas/plan.md

## Intent

5 checks in 2 slices · 3 one-way doors · 0 open

## Checks

### S1 - Persistência de Campanha, Vínculo ao Tenant e Agregação Anônima (LGPD)

**C1** - Authenticated `LOJISTA` posting valid `titulo`, `descontoPercentual`, and `criterioAlvo` persists `Campanha` bound to JWT `lojaId` and returns HTTP 201 (ORD-09, AC 1)
Proof: `cd backend && ./mvnw test -Dtest=CampanhaIntegrationTest#createCampanhaPersistsAndBindsToJwtLojaId`

**C2** - Response body of `POST /api/v1/campanhas` returns only integer `publicoAtingido` and exposes zero PII fields such as customer lists, `clienteId`, `cpf`, or `nome` (ORD-09, AC 2)
Proof: `cd backend && ./mvnw test -Dtest=CampanhaIntegrationTest#responseContainsOnlyAnonymousAudienceCountWithoutPii`

**C3** - `publicoAtingido` counts distinct eligible customers with `APROVADA` receipts in the authenticated store according to `criterioAlvo` without leaking other stores (ORD-09, AC 3)
Proof: `cd backend && ./mvnw test -Dtest=CampanhaIntegrationTest#audienceCountReflectsEligibleCriteriaWithoutCrossStoreLeak`

### S2 - Validação de Entrada e Autorização por Perfil (`ROLE_LOJISTA`)

**C4** - Invalid `descontoPercentual` (< 1 or > 100) or blank `titulo`/`criterioAlvo` returns HTTP 400 (`validation_error`) without persisting a campaign (ORD-09, AC 4)
Proof: `cd backend && ./mvnw test -Dtest=CampanhaIntegrationTest#invalidPayloadReturnsBadRequest`

**C5** - `POST /api/v1/campanhas` returns HTTP 401 when unauthenticated and HTTP 403 for `CONSUMIDOR` and `ADMIN_SHOPPING` (ORD-09, AC 5)
Proof: `cd backend && ./mvnw test -Dtest=CampanhaIntegrationTest#createCampanhaEnforcesLojistaAuthorization`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| campaign creation rules (3) | persist with JWT `lojaId` `C1` · zero PII in response `C2` · store-scoped `COUNT(DISTINCT cliente_id)` `C3` | - |
| validation error cases (4) | `desconto < 1` `C4` · `desconto > 100` `C4` · blank `titulo` `C4` · blank `criterioAlvo` `C4` | - |
| authorization roles (4) | unauthenticated -> `401` `C5` · `LOJISTA` -> `201` `C1` · `CONSUMIDOR` -> `403` `C5` · `ADMIN_SHOPPING` -> `403` `C5` | - |
| one-way doors (3) | `lojaId` strictly from JWT `C1` · DB aggregate count only `C2, C3` · response without recipient list `C2` | - |

## Swept

- validation: C4
- failure modes: C4, C5
- idempotency: n/a - creating distinct campaigns via POST is intentionally non-idempotent
- authorization: C1, C5
- concurrency: n/a - read-only COUNT aggregation + independent INSERT into `campanhas`
- data lifecycle: C1, C3
- dependency failure: n/a - PostgreSQL/Flyway startup failure halts Spring Boot fail-fast
- state transitions: n/a - campaign creation only
- observability: n/a - audit logging not required in ORD-09

## Handoff

- S1 = ~12k tokens, S2 = ~8k tokens; total estimate ~20k tokens, well under the 150k budget - one builder
- Build status: C1-C5 implemented in `CampanhaIntegrationTest` and passing (`./mvnw -B test`: 68/68 tests pass, 0 failures, 0 errors, 0 skipped)
