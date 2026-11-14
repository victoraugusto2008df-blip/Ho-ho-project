# ORD-09-campanhas verification

**Verdict**: PASS
**Profile**: light
**Diff range**: develop..083d8d8
**Round**: 1 - full
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | Authenticated `LOJISTA` posting valid `titulo`, `descontoPercentual`, and `criterioAlvo` persists `Campanha` bound to JWT `lojaId` and returns HTTP 201 | `Set-Location backend; .\mvnw.cmd -B test` (exit 0; `CampanhaIntegrationTest`: 5/5) | `backend/src/test/java/com/hoho/shoppinghub/CampanhaIntegrationTest.java:68-70,78-79` — `.andExpect(status().isCreated())`, `.andExpect(jsonPath("$.lojaId").value(ZARA_LOJA_ID.toString()))`, `assertThat(salvas).hasSize(1)` & `assertThat(salvas.getFirst().getLojaId()).isEqualTo(ZARA_LOJA_ID)` | PASS |
| C2 | Response body of `POST /api/v1/campanhas` returns only integer `publicoAtingido` and exposes zero PII fields (`clientes`, `clienteId`, `cpf`, `cpfHash`, `nome`) | `Set-Location backend; .\mvnw.cmd -B test` (exit 0; `CampanhaIntegrationTest`: 5/5) | `backend/src/test/java/com/hoho/shoppinghub/CampanhaIntegrationTest.java:102-107,111` — `.andExpect(jsonPath("$.publicoAtingido").isNumber())`, `.doesNotExist()` on `$.clientes`, `$.clienteId`, `$.cpf`, `$.cpfHash`, `$.nome`, and `assertThat(body).doesNotContain("Ana Silva", "Carlos Souza", "Mariana Lima", "456.789")` | PASS |
| C3 | `publicoAtingido` counts distinct eligible customers with `APROVADA` receipts in the authenticated store according to `criterioAlvo` without leaking other stores | `Set-Location backend; .\mvnw.cmd -B test` (exit 0; `CampanhaIntegrationTest`: 5/5) | `backend/src/test/java/com/hoho/shoppinghub/CampanhaIntegrationTest.java:131,144,157-158` — `.andExpect(jsonPath("$.publicoAtingido").value(2))` (`TICKET_ALTO` Zara), `.value(1)` (`RECORRENTES` Zara), `.value(FAST_SHOP_LOJA_ID.toString())` & `.value(2)` (`CLIENTES_LOJA` Fast Shop) | PASS |
| C4 | Invalid `descontoPercentual` (`< 1` or `> 100`) or blank `titulo`/`criterioAlvo` returns HTTP 400 (`validation_error`) without persisting a campaign | `Set-Location backend; .\mvnw.cmd -B test` (exit 0; `CampanhaIntegrationTest`: 5/5) | `backend/src/test/java/com/hoho/shoppinghub/CampanhaIntegrationTest.java:175-176,188-189,201-202,214-215,217` — `status().isBadRequest()` & `jsonPath("$.error").value("validation_error")` for `0`, `101`, `"   "` `titulo`, `""` `criterioAlvo`, plus `assertThat(campanhaRepository.count()).isZero()` | PASS |
| C5 | `POST /api/v1/campanhas` returns HTTP 401 when unauthenticated and HTTP 403 for `CONSUMIDOR` and `ADMIN_SHOPPING` | `Set-Location backend; .\mvnw.cmd -B test` (exit 0; `CampanhaIntegrationTest`: 5/5) | `backend/src/test/java/com/hoho/shoppinghub/CampanhaIntegrationTest.java:234,240,246` — `.andExpect(status().isUnauthorized())` (no token), `.andExpect(status().isForbidden())` (`CONSUMIDOR`), `.andExpect(status().isForbidden())` (`ADMIN_SHOPPING`) | PASS |

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| campaign creation rules (3) | persist with JWT `lojaId` `C1` · zero PII in response `C2` · store-scoped `COUNT(DISTINCT cliente_id)` `C3` | - |
| validation error cases (4) | `desconto < 1` `C4` · `desconto > 100` `C4` · blank `titulo` `C4` · blank `criterioAlvo` `C4` | - |
| authorization roles (4) | unauthenticated -> `401` `C5` · `LOJISTA` -> `201` `C1` · `CONSUMIDOR` -> `403` `C5` · `ADMIN_SHOPPING` -> `403` `C5` | - |
| one-way doors (3) | `lojaId` strictly from JWT `C1` (`CampanhaRequest.java:9-21`, `CampanhaController.java:32`) · DB aggregate count only `C2, C3` (`NotaFiscalRepository.java:27-56`) · response without recipient list `C2` (`CampanhaResponse.java:7-14`) | - |

## Swept existing

| Category | Check | Code verified |
| --- | --- | --- |
| validation | C4 | `CampanhaRequest.java:10-21` (`@NotBlank`, `@Size`, `@NotNull`, `@Min(1)`, `@Max(100)`) + `CampanhaController.java:30` (`@Valid`) |
| failure modes | C4, C5 | `CampanhaIntegrationTest.java:162-247` (400 `validation_error`, 401, 403) |
| authorization | C1, C5 | `CampanhaController.java:28` (`@PreAuthorize("hasRole('LOJISTA')")`) |
| data lifecycle | C1, C3 | `Campanha.java:12-36` (persisted in `campanhas`), `NotaFiscalRepository.java:27-56` (`status = 'APROVADA'`, scoped by `lojaId`) |

## Faults injected

Skipped under `Profile: light`.

## Gate

`Set-Location backend; .\mvnw.cmd -B test` — 68 passed, 0 failed, 0 errors, 0 skipped (`CampanhaIntegrationTest`: 5 passed, 0 failed, 0 errors, 0 skipped).
