# Autenticação JWT, RBAC & Hashing de CPF (ORD-02)

## Problem

The backend currently has no login endpoint, no route protection, and no way to hash or mask a CPF. Any HTTP client can call any future route with no identity, nothing stops a lojista from reading another store's data, and a CPF would be persisted and exposed in plaintext. The consumers, lojistas and the shopping administration all pay for this — consumers and lojistas through privacy and competitive-data leakage, the shopping through LGPD non-compliance (RN04 / RNF04).

When this ships, `POST /api/v1/auth/login` authenticates the seeded users and returns a signed JWT carrying `role` and the tenant identifier (`lojaId`/`clienteId`); every protected route is guarded by role; the `lojaId` used in tenant-scoped queries is always taken from the token, never from the request; and a CPF is only ever persisted as `cpf_hash` and only ever displayed as `cpf_mascarado`.

## Flow

This reuses the seeded `usuarios` (BCrypt hashes, `role`, `loja_id`/`cliente_id`) from ORD-01, the existing `app.security.jwt.*` and `app.security.cpf-hash-pepper` config keys, and Spring Security's existing filter chain — no new persistence or config surface is introduced.

1. `POST /api/v1/auth/login` with `{email, senha}` -> `AuthController` (new, no door - placement per conventions) - validates the body, delegates to the authentication manager
2. `UsuarioDetailsService` (new, no door) - loads `Usuario` by `email` via `auth` module (exists) and maps it to Spring `UserDetails` with `role`, `lojaId` and `clienteId`
3. `AuthenticationManager` (exists - `spring-boot-starter-security`) - verifies the BCrypt password via `PasswordEncoder` (exists)
4. `JwtService` (new, no door) - signs an HS256 token with claims `role`, `lojaId`, `clienteId`; `out:` `{token, role, lojaId, clienteId}`
5. `JwtAuthenticationFilter` (new, no door) - on the next request reads `Authorization: Bearer`, validates signature and expiry, sets the `SecurityContext` with a `ROLE_*` authority and a principal carrying `lojaId`/`clienteId`
6. `SecurityConfig` (new, no door) - stateless `SecurityFilterChain` mapping routes to roles (door 2)
7. `@PreAuthorize` (exists - `spring-security`) - enforces tenant isolation: `lojaId` is read from the principal, never from the request (door 5)

## Impact

| Front | What changes |
| --- | --- |
| domain | new terms: `AuthController`, `UsuarioDetailsService`, `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`, `CpfHashUtil`, `CpfMaskUtil` - all live in the `auth` module |
| stored data | nothing to migrate - `clientes.cpf_hash`/`cpf_mascarado` and `usuarios` already exist from ORD-01; this feature only adds the code that computes and reads them |

## Relations

None - no stored-data shape change (`clientes.cpf_hash`, `clientes.cpf_mascarado` and `usuarios` were created in ORD-01)

## Surface

Only routes this adds or whose signature changes.

| Route | In | Out | Status |
| --- | --- | --- | --- |
| `POST /api/v1/auth/login` | `email`, `senha` | `token` · `role` · `lojaId` · `clienteId` | `200`, `401`, `400` |

## Landing

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| JWT claim contract | claims `role`, `lojaId`, `clienteId` in the token payload | claims named `tipo`/`tenantId` - breaks the contract the frontend and ORD-08/09/10 will bind to |
| Role-to-authority mapping | `CONSUMIDOR` -> `ROLE_CONSUMIDOR`, `LOJISTA` -> `ROLE_LOJISTA`, `ADMIN_SHOPPING` -> `ROLE_ADMIN_SHOPPING` | `hasAuthority("LOJISTA")` without the `ROLE_` prefix - incompatible with `@PreAuthorize("hasRole(...)")` and `spring-security` conventions |
| CPF hash algorithm | `SHA-256(cpf + pepper)` as 64-char lowercase hex, matching `cpf_hash VARCHAR(64)` | SHA-1 or MD5 - weaker, and non-deterministic length breaks the unique index |
| CPF mask format | `***.456.789-**` (mask first 3 and last 2 digits, keep middle 6), matching `cpf_mascarado VARCHAR(14)` | `***.***.789-**` - keeps too little data to let the user recognise their own CPF |
| Tenant isolation pattern | `lojaId` sourced only from the JWT principal and enforced via `@PreAuthorize("#lojaId == authentication.principal.lojaId")` | accepting `lojaId` from the request body/query - a lojista could forge it to read a competitor's data |

- Nothing else in this change is hard to reverse

## Criteria

### S1: Login & JWT issuance (P1)

A seeded user authenticates and receives a signed JWT carrying role and tenant identifier.

**Acceptance Criteria**

1. WHEN a `POST /api/v1/auth/login` request carries the `email` and `senha` of a seeded user THEN the system SHALL respond `200` with a JWT whose claims include `role` and, for a `LOJISTA` user, `lojaId` equal to the user's store id
2. IF a `POST /api/v1/auth/login` request carries an unknown `email` or an incorrect `senha` THEN the system SHALL respond `401` with no token
3. IF a `POST /api/v1/auth/login` request omits `email` or `senha` THEN the system SHALL respond `400` with a validation error body

**Independent test:** authenticate `lojista@shopping.com`/`demo123` and parse the JWT claims (`role=LOJISTA`, `lojaId=22222222-2222-2222-2222-222222222201`); a wrong password returns `401`.

### S2: RBAC & multi-tenant isolation (P1)

Protected routes are guarded by role, and tenant-scoped data is isolated per store.

**Acceptance Criteria**

4. IF a request to a protected route carries no JWT or an invalid JWT THEN the system SHALL respond `401`
5. IF a request to a route restricted to `LOJISTA` carries a JWT whose `role` is `CONSUMIDOR` THEN the system SHALL respond `403`
6. The system SHALL allow a request to a route restricted to `ADMIN_SHOPPING` when the JWT `role` is `ADMIN_SHOPPING`, responding `200`
7. The system SHALL source `lojaId` for tenant-scoped operations from the authenticated principal (JWT claims), never from the request body or query parameters
8. IF a `LOJISTA` token whose `lojaId` is store A calls a tenant-scoped operation targeting store B THEN the system SHALL respond `403`

**Independent test:** role-restricted probe endpoints exercised via MockMvc prove `401` (no token), `403` (wrong role), `200` (correct role), and the cross-tenant case (Loja A token reading Loja B) returns `403`.

### S3: CPF hashing & masking (P1)

A CPF is only ever persisted as `cpf_hash` and displayed as `cpf_mascarado`.

**Acceptance Criteria**

9. The system SHALL compute `cpf_hash` as the SHA-256 hexadecimal digest of `(cpf + pepper)`, where the `pepper` is injected from the `CPF_HASH_PEPPER` environment variable and is not hardcoded inside the hashing utility
10. The system SHALL derive `cpf_mascarado` in the format `***.456.789-**` from an 11-digit CPF, masking the first 3 and last 2 digits

**Independent test:** `CpfHashUtil.hash` with a fixed pepper returns the known 64-char digest and changes when the pepper changes; `CpfMaskUtil.mask("12345678901")` returns `***.456.789-**`.

## Out of scope

| Excluded | Why |
| --- | --- |
| User registration and password reset endpoints | ADR-05 - demo uses seeded accounts with quick access |
| Refresh tokens and token revocation | Not needed for a single-day MVP demo |
| The data endpoints themselves (`analytics`, `campanhas`, `notas`) | Owned by ORD-08/09/10; this feature only delivers the security layer they will plug into |
| Rate limiting / throttling on the login route | RNF06 - deferred to v2 (Redis) |

## Assumptions

| Assumption | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Pepper handling for local development | Keep the existing dev fallback `pepper_desenvolvimento_local_lgpd` in `application.yml`; production pepper supplied via `CPF_HASH_PEPPER` only | The dev value is a non-secret placeholder, and removing it would break local reproducibility of the seeded demo; the real pepper never enters the repo | n |
| JWT signing algorithm and key | HS256 with the existing `app.security.jwt.secret` (`JWT_SECRET`), 256-bit key, `expiration-ms: 86400000` | Already declared in `application.yml`; jjwt 0.12.6 requires a key of at least 32 bytes | n |
| Authority representation for the three profiles | `ROLE_CONSUMIDOR`, `ROLE_LOJISTA`, `ROLE_ADMIN_SHOPPING` | Matches `hasRole(...)` / `@PreAuthorize` conventions and keeps the domain enum unchanged | n |

**Open questions:** none - all resolved or logged above.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| API `POST /api/v1/auth/login` | response shape (`token`, `role`, `lojaId`, `clienteId`) | AC 1 |
| API `POST /api/v1/auth/login` | error shape and codes (`401` invalid creds, `400` validation) | AC 2, AC 3 |
| protected routes (future `ORD-08/09/10`) | unauthorised vs forbidden (`401` vs `403`) | AC 4, AC 5 |
| all new `/api/v1/auth/*` | versioning, rate limits | n/a - single MVP version; rate limiting is out of scope (RNF06 v2) |

## Sources

- GitHub Issue [#2](https://github.com/victoraugusto2008df-blip/Ho-ho-project/issues/2): `[ORD-02] BACK — Autenticação JWT, RBAC & Hashing de CPF`
- Architecture & ADRs: `.docs/architecture/architecture-and-domain.md` (ADR-02, ADR-05, module `auth`/`shared`)
- Requirements: `.docs/markdown/requirements.md` (RN04, RNF04)
- Planning Kanban: `.docs/planning/mvp-sabado-kanban.md` (Card ORD-02)
