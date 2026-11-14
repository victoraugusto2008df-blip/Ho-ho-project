# Autenticação JWT, RBAC & Hashing de CPF (ORD-02) checks

Profile: light
Plan: `.specs/features/ORD-02-auth-jwt-rbac-cpf/plan.md`

15 checks in 3 slices · 5 one-way doors · 0 open

## Checks

### S1 - Login & JWT issuance · 9 files · ~22 KB · ~5.5k

**C1** - A `POST /api/v1/auth/login` with the seeded `lojista@shopping.com` / `demo123` responds `200` with a JWT whose claims include `role=LOJISTA` and `lojaId=22222222-2222-2222-2222-222222222201` (AC 1)
Proof: `./mvnw -B test -Dtest=AuthControllerTest#loginLojistaReturnsTokenWithRoleAndLojaId`

**C2** - A `POST /api/v1/auth/login` with an unknown `email` or an incorrect `senha` responds `401` and returns no token in the body (AC 2)
Proof: `./mvnw -B test -Dtest=AuthControllerTest#loginWithUnknownEmailOrWrongPasswordReturns401WithoutToken`

**C3** - A `POST /api/v1/auth/login` that omits `email` or `senha` responds `400` with a validation-error body (AC 3)
Proof: `./mvnw -B test -Dtest=AuthControllerTest#loginMissingFieldReturns400WithValidationError`

**C4** - The signed token payload carries claims literally named `role`, `lojaId` and `clienteId`; a `CONSUMIDOR` token carries `clienteId`, and no `tipo`/`tenantId` claims exist (Landing: JWT claim contract)
Proof: `./mvnw -B test -Dtest=JwtServiceTest#tokenCarriesRoleLojaIdClienteIdClaims`

### S2 - RBAC & multi-tenant isolation · 6 files · ~18 KB · ~4.5k

**C5** - A request to a protected route with no `Authorization` header, or with a token whose signature is invalid or whose `exp` has elapsed, responds `401` (AC 4)
Proof: `./mvnw -B test -Dtest=SecurityIntegrationTest#protectedRouteWithoutOrWithInvalidTokenReturns401`

**C6** - A request to a `LOJISTA`-restricted route carrying a JWT with `role=CONSUMIDOR` responds `403` (AC 5)
Proof: `./mvnw -B test -Dtest=SecurityIntegrationTest#lojistaRouteWithConsumidorTokenReturns403`

**C7** - A request to an `ADMIN_SHOPPING`-restricted route carrying a JWT with `role=ADMIN_SHOPPING` responds `200` (AC 6)
Proof: `./mvnw -B test -Dtest=SecurityIntegrationTest#adminRouteWithAdminTokenReturns200`

**C8** - A `LOJISTA` token whose `lojaId` is store A calling a tenant-scoped operation that targets store B responds `403` (AC 8)
Proof: `./mvnw -B test -Dtest=SecurityIntegrationTest#crossTenantAccessReturns403`

**C9** - The `lojaId` used by a tenant-scoped operation is taken from the authenticated principal; a `lojaId` supplied in the request body or query parameters does not select the tenant (AC 7)
Proof: `./mvnw -B test -Dtest=SecurityIntegrationTest#requestSuppliedLojaIdIsNotTrusted`

**C10** - Role maps to a `ROLE_`-prefixed authority, table-driven over all three: `CONSUMIDOR`→`ROLE_CONSUMIDOR`, `LOJISTA`→`ROLE_LOJISTA`, `ADMIN_SHOPPING`→`ROLE_ADMIN_SHOPPING` (Landing: role-to-authority mapping)
Proof: `./mvnw -B test -Dtest=UsuarioDetailsServiceTest#mapsEachRoleToRolePrefixedAuthority`

**C11** - Tenant isolation is enforced by `@PreAuthorize("#lojaId == authentication.principal.lojaId")`; invoking a guarded tenant-scoped method with a `lojaId` that differs from `authentication.principal.lojaId` is denied (Landing: tenant isolation pattern)
Proof: `./mvnw -B test -Dtest=TenantIsolationTest#principalLojaIdGuardRejectsMismatchedLojaId`

### S3 - CPF hashing & masking · 4 files · ~7 KB · ~1.8k

**C12** - `cpf_hash` is the SHA-256 hexadecimal digest of `(cpf + injected pepper)`: for `cpf=12345678901` and `pepper=pepper_desenvolvimento_local_lgpd` the digest is `207dadae0ae4a8474ade03c87c647b363994bf78a902be3537bedd0b30226dc6`, and a different pepper yields a different digest — the pepper is injected, not hardcoded in the utility (AC 9)
Proof: `./mvnw -B test -Dtest=CpfHashUtilTest#hashMatchesKnownVector`
Proof: `./mvnw -B test -Dtest=CpfHashUtilTest#hashChangesWhenPepperChanges`

**C13** - The `cpf_hash` digest is exactly 64 lowercase hex characters, matching `clientes.cpf_hash VARCHAR(64)` — a SHA-1 (40) or MD5 (32) length never occurs (Landing: CPF hash algorithm)
Proof: `./mvnw -B test -Dtest=CpfHashUtilTest#digestIs64LowercaseHexChars`

**C14** - `cpf_mascarado` is derived from an 11-digit CPF: `CpfMaskUtil.mask("12345678901")` returns `***.456.789-**` (AC 10)
Proof: `./mvnw -B test -Dtest=CpfMaskUtilTest#maskOf12345678901ReturnsMaskedFormat`

**C15** - The mask format is exactly `***.456.789-**` for any 11-digit CPF: 14 characters, first 3 digits masked, middle 6 kept as `456.789`, last 2 masked — matching `clientes.cpf_mascarado VARCHAR(14)` (Landing: CPF mask format)
Proof: `./mvnw -B test -Dtest=CpfMaskUtilTest#maskInvariantHoldsAcrossCpfInputs`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `POST /api/v1/auth/login` statuses (3) | `200` C1 · `401` C2 · `400` C3 | - |
| JWT claim contract (3) | `role` C1 · `lojaId` C1 · `clienteId` C4 | - |
| role → `ROLE_` authority (3) | C10, table-driven over all 3 | - |
| protected-route authorization outcomes (4) | `401` no/invalid token C5 · `403` wrong role C6 · `200` correct role C7 · `403` cross-tenant C8 | - |

- Claims naming a status code, route or response shape: C1, C2, C3, C5, C6, C7, C8 — each has a proof that crosses the boundary.
- No other check claims more than the single case its proof exercises.

## Swept

- validation: C3
- failure modes: C2, C5
- idempotency: n/a - stateless read-only flow; JWT issuance is deterministic with no side effect to repeat
- authorization: C6, C7, C8, C11
- concurrency: n/a - no shared mutable state or write path in the auth flow
- data lifecycle: n/a - no new stored data; `clientes.cpf_hash`/`cpf_mascarado` and seed `usuarios` belong to ORD-01
- dependency failure: n/a - only in-process BCrypt verification and local JWT signing, no external call in scope
- state transitions: n/a - stateless JWT, no server session or entity state
- observability: n/a - no logging or metrics requirement in this feature

## Handoff

Size, with the arithmetic, written after the checks exist and before any code. Estimate is
`wc -c` of the files each slice touches, divided by four.

- S1 = 22 KB (AuthController, LoginRequest/Response, UsuarioDetailsService, JwtService,
  exception handling + AuthControllerTest, JwtServiceTest, UsuarioDetailsServiceTest) ≈ 5.5k
- S2 = 18 KB (JwtAuthenticationFilter, SecurityConfig, principal, probe controllers +
  SecurityIntegrationTest, TenantIsolationTest) ≈ 4.5k
- S3 = 7 KB (CpfHashUtil, CpfMaskUtil + CpfHashUtilTest, CpfMaskUtilTest) ≈ 1.8k
- Total ≈ 47 KB ≈ 11.8k tokens, under the 150k budget — one builder, no ask.

- **Boundary:** C1–C15 closed — 17/17 proofs green (`./mvnw -B test`), uncommitted (no commit requested)
- **Settled mid-build:** `Usuario` entity + `UsuarioRepository` created in the `auth` module (the plan assumed ORD-01 delivered them, but ORD-01 shipped only SQL migrations); ORD-01 `V1`/`V2` migrations materialized into this worktree as the build dependency; `ProbeController` + `TenantScopedService` added as demo stand-ins for the ORD-08/09/10 routes; `role` kept as `String` (no `Role` enum exists in the codebase)
- **Abandoned:** none
