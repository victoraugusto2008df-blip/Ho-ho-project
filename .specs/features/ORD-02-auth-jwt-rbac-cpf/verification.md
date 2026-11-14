# ORD-02-auth-jwt-rbac-cpf verification

**Verdict**: PASS
**Profile**: light
**Diff range**: develop..HEAD
**Round**: 2 - scoped
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | login as seeded `lojista@shopping.com`/`demo123` returns `200` with token carrying `role=LOJISTA` and `lojaId=22222222-2222-2222-2222-222222222201` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AuthControllerTest.java:28` - `.andExpect(status().isOk())`, `:30` - `.andExpect(jsonPath("$.role").value("LOJISTA"))`, `:31` - `.andExpect(jsonPath("$.lojaId").value("22222222-2222-2222-2222-222222222201"))` | PASS |
| C2 | unknown email or wrong password returns `401` with no token | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AuthControllerTest.java:39-40` - `.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.token").doesNotExist())` (unknown email), `:45-46` (wrong password) | PASS |
| C3 | missing `email` or `senha` returns `400` with validation-error body | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AuthControllerTest.java:54-55` - `.andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("validation_error"))`, `:60-61` (missing email) | PASS |
| C4 | token payload carries `role`, `lojaId`, `clienteId`; `CONSUMIDOR` carries `clienteId`; no `tipo`/`tenantId` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/service/JwtServiceTest.java:27-30` - `get("role")` = `"CONSUMIDOR"` / `get("clienteId")` / `containsKey("tipo").isFalse()` / `containsKey("tenantId").isFalse()`, and `:36-37` - `get("role")` `LOJISTA` / `get("lojaId")` | PASS |
| C5 | protected route with no header, invalid-signature token, or expired token returns `401` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/SecurityIntegrationTest.java:42` - `.andExpect(status().isUnauthorized())` (no header), `:44-45` - `.header("Authorization", "Bearer token-invalido").andExpect(status().isUnauthorized())`, `:47-56` - signed token with `.expiration(... - 86400000L)` then `.andExpect(status().isUnauthorized())` at `:55-56` | PASS |
| C6 | `LOJISTA` route with `CONSUMIDOR` token returns `403` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/SecurityIntegrationTest.java:63` - `.andExpect(status().isForbidden())` | PASS |
| C7 | `ADMIN_SHOPPING` route with `ADMIN_SHOPPING` token returns `200` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/SecurityIntegrationTest.java:70-71` - `.andExpect(status().isOk()).andExpect(jsonPath("$.role").value("ADMIN_SHOPPING"))` | PASS |
| C8 | Loja A token targeting store B returns `403` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/SecurityIntegrationTest.java:78` - `.andExpect(status().isForbidden())` (STORE_A token, `/loja/` + STORE_B path) | PASS |
| C9 | `lojaId` sourced from principal, not request param | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/SecurityIntegrationTest.java:87` - `.andExpect(jsonPath("$.lojaId").value(STORE_A.toString()))` while request `.param("lojaId", STORE_B.toString())` at `:84` | PASS |
| C10 | role maps to `ROLE_`-prefixed authority over all 3 roles | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/service/UsuarioDetailsServiceTest.java:34-36` - `containsExactly("ROLE_CONSUMIDOR")` / `("ROLE_LOJISTA")` / `("ROLE_ADMIN_SHOPPING")` | PASS |
| C11 | `@PreAuthorize("#lojaId == authentication.principal.lojaId")` denies mismatched `lojaId` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/TenantIsolationTest.java:36-37` - `assertThatThrownBy(() -> tenantScopedService.tenantInfo(STORE_B)).isInstanceOf(AccessDeniedException.class)` | PASS |
| C12 | `cpf_hash` is SHA-256 hex of `(cpf + injected pepper)`; known vector matches and pepper change changes digest | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/util/CpfHashUtilTest.java:14-15` - `.isEqualTo("207dadae0ae4a8474ade03c87c647b363994bf78a902be3537bedd0b30226dc6")` and `:22` - `assertThat(a.hash("12345678901")).isNotEqualTo(b.hash("12345678901"))` | PASS |
| C13 | digest is exactly 64 lowercase hex chars | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/util/CpfHashUtilTest.java:29` - `assertThat(digest).hasSize(64).matches("[0-9a-f]{64}")` | PASS |
| C14 | `mask("12345678901")` returns `***.456.789-**` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/util/CpfMaskUtilTest.java:11` - `assertThat(CpfMaskUtil.mask("12345678901")).isEqualTo("***.456.789-**")` | PASS |
| C15 | mask invariant: 14 chars, first 3 + last 2 masked, middle 6 kept | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/auth/util/CpfMaskUtilTest.java:18-21` - `assertThat(masked).hasSize(14)` / `substring(0, 4)).isEqualTo("***.")` / `substring(11)).isEqualTo("-**")` / `.matches("\\*\\*\\*\\.\\d{3}\\.\\d{3}-\\*\\*")` | PASS |

## Gate

`.\mvnw.cmd -B test` - 17 passed, 0 failed
