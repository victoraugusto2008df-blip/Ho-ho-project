# ORD-08-analytics-lojista-dashboard verification

**Verdict**: PASS
**Profile**: light
**Diff range**: origin/develop..HEAD
**Round**: 1 - full
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | `200` with numeric `ticketMedio` = average `valorTotal` of `APROVADA` notes, 2 decimals | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/analytics/service/AnalyticsServiceTest.java:39` - `assertThat(response.ticketMedio()).isEqualByComparingTo("200.00")`; `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:38` - `.andExpect(status().isOk())`, `:39` - `.andExpect(jsonPath("$.ticketMedio").isNumber())` | PASS |
| C2 | fewer than 3 active lojas -> `benchmarkingDisponivel=false` and `mediaCategoria=null` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:47` - `.andExpect(jsonPath("$.benchmarkingDisponivel").value(false))`, `:48` - `.andExpect(jsonPath("$.mediaCategoria").value(nullValue()))` | PASS |
| C3 | 3 or more active lojas -> `benchmarkingDisponivel=true` and numeric `mediaCategoria` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:56` - `.andExpect(jsonPath("$.benchmarkingDisponivel").value(true))`, `:57` - `.andExpect(jsonPath("$.mediaCategoria").isNumber())` | PASS |
| C4 | sources `lojaId` from `authentication.principal.lojaId`, ignoring query `lojaId` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:63` - `.param("lojaId", BURGER_KING.toString())`, `:64` - token for ZARA, `:66` - `.andExpect(jsonPath("$.benchmarkingDisponivel").value(true))` | PASS |
| C5 | `DashboardResponse` record with exactly six fields `ticketMedio`, `benchmarkingDisponivel`, `mediaCategoria`, `horariosPico`, `diasPico`, `crossShopping` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/analytics/dto/DashboardResponseTest.java:14` - `.containsExactly("ticketMedio", "benchmarkingDisponivel", "mediaCategoria", "horariosPico", "diasPico", "crossShopping")` | PASS |
| C6 | benchmark available only at >= 3 distinct active lojas (false below 3, true at 3) | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/analytics/service/KAnonymityGuardTest.java:38` - `assertThat(abaixo.benchmarkingDisponivel()).isFalse()`, `:39` - `assertThat(abaixo.mediaCategoria()).isNull()`, `:43` - `assertThat(tres.benchmarkingDisponivel()).isTrue()`, `:44` - `assertThat(tres.mediaCategoria()).isEqualByComparingTo("100.00")` | PASS |
| C7 | `horariosPico` and `diasPico` grouped by hour-of-day and day-of-week | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:74` - `.andExpect(jsonPath("$.horariosPico").isArray())`, `:76` - `.andExpect(jsonPath("$.horariosPico[0].hora").isNumber())`, `:77` - `.andExpect(jsonPath("$.diasPico").isArray())`, `:79` - `.andExpect(jsonPath("$.diasPico[0].diaSemana").isNotEmpty())` | PASS |
| C8 | `crossShopping` returns other categories with `categoria` + `total` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:89` - `.andExpect(jsonPath("$.crossShopping[0].categoria").isNotEmpty())`, `:90` - `.andExpect(jsonPath("$.crossShopping[0].total").isNumber())` | PASS |
| C9 | response contains no `clienteId`, CPF or customer name | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/AnalyticsDashboardIntegrationTest.java:102` - `.doesNotContain("clienteId")`, `:103` - `.doesNotContain("cpf")`, `:104` - `.doesNotContain("nome")` | PASS |
| C10 | each `crossShopping` entry carries only `categoria` and `total` | `.\mvnw.cmd -B test` exit 0 | `backend/src/test/java/com/hoho/shoppinghub/analytics/dto/CrossShoppingItemTest.java:14` - `.containsExactly("categoria", "total")` | PASS |

## Gate

`.\mvnw.cmd -B test` - 55 passed, 0 failed
