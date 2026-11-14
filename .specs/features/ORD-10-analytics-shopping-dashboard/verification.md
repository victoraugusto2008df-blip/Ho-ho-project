# ORD-10-analytics-shopping-dashboard verification

**Verdict**: PASS
**Profile**: light
**Diff range**: 62e59c3..7881239 (develop..HEAD)
**Round**: 1 - full
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | ADMIN_SHOPPING token -> 200 with numeric faturamentoTotal | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:52` - `.andExpect(status().isOk())`; `ShoppingDashboardIntegrationTest.java:53` - `.andExpect(jsonPath("$.faturamentoTotal").isNumber())` | PASS |
| C2 | CONSUMIDOR/LOJISTA token -> 403 | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:61` - `.andExpect(status().isForbidden())` (CONSUMIDOR); `ShoppingDashboardIntegrationTest.java:65` - `.andExpect(status().isForbidden())` (LOJISTA) | PASS |
| C3 | no/invalid token -> 401 | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:71` - `.andExpect(status().isUnauthorized())` (no token); `ShoppingDashboardIntegrationTest.java:75` - `.andExpect(status().isUnauthorized())` (invalid token) | PASS |
| C4 | faturamentoTotal = sum of APROVADA notes | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingAnalyticsServiceTest.java:35` - `assertThat(response.faturamentoTotal()).isEqualByComparingTo("3194.90")`; `ShoppingDashboardIntegrationTest.java:87` - `.andExpect(jsonPath("$.faturamentoTotal").value(esperado.doubleValue()))` | PASS |
| C5 | distribuicaoPorCategoria sums to 100.00 | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingAnalyticsServiceTest.java:55` - `assertThat(soma).isEqualByComparingTo("100.00")` | PASS |
| C6 | no PII in response | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:98` - `assertThat(body).doesNotContain("clienteId").doesNotContain("cpf").doesNotContain("nome")` | PASS |
| C7 | volumePorDiaHora grouped by day/hour | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:111` - `.andExpect(jsonPath("$.volumePorDiaHora[0].diaSemana").isNotEmpty())`; `ShoppingDashboardIntegrationTest.java:112` - `.andExpect(jsonPath("$.volumePorDiaHora[0].hora").isNumber())`; `ShoppingDashboardIntegrationTest.java:113` - `.andExpect(jsonPath("$.volumePorDiaHora[0].total").isNumber())` | PASS |
| C8 | totalVouchersLiberados = count of LIBERADO | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:130` - `.andExpect(jsonPath("$.totalVouchersLiberados").value(1))` | PASS |
| C9 | totalCampanhasAtivas = count of campanhas | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardIntegrationTest.java:147` - `.andExpect(jsonPath("$.totalCampanhasAtivas").value(2))` | PASS |
| C10 | ShoppingDashboardResponse record has 5 contract fields | `.\mvnw.cmd -B test "-Dtest=ShoppingDashboardIntegrationTest,ShoppingAnalyticsServiceTest,ShoppingDashboardResponseTest"` exit 0 | `ShoppingDashboardResponseTest.java:14` - `.containsExactly("faturamentoTotal", "distribuicaoPorCategoria", "volumePorDiaHora", "totalVouchersLiberados", "totalCampanhasAtivas")` | PASS |

## Gate

`.\mvnw.cmd -B test` - 74 tests, 0 failures, 0 errors (BUILD SUCCESS)
