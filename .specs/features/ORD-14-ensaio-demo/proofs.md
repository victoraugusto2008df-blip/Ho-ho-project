# ORD-14-ensaio-demo proofs

**HEAD**: a2dfdf0
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 19 pass, 1 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run back / faturamentoSumsOnlyApprovedReceipts -- Time elapsed` | pass |
| C2 | `run back / emptyDatabaseYieldsZerosAndNoCategories -- Time elapsed` | pass |
| C3 | `run back / countsEveryVoucherAndEveryCampaign -- Time elapsed` | pass |
| C4 | `run back / faturamentoPorCategoriaIsSortedAndAddsUpToTheTotal -- Time elapsed` | pass |
| C5 | `run back / onlyAdminShoppingMaySeeTheDashboard -- Time elapsed` | pass |
| C6 | `browser - entrar como Admin Shopping com o roteiro executado, salvar captures/figura4-portal-shopping.running.` | **not judged** (screens.md) |
| C7 | `run front / ✓ SHOP-07 a rota do shopping monta a Tela 3 e chama o backend com o Bearer` | pass |
| C8 | `run front / ✓ SHOP-08 indicadores mostram faturamento vouchers e campanhas` | pass |
| C9 | `run front / ✓ SHOP-09 faturamento por segmento lista as categorias com barra proporcional` | pass |
| C10 | `run front / ✓ SHOP-10 sem categorias mostra o estado vazio` | pass |
| C11 | `run front / ✓ SHOP-11 indicadores e card mostram carregando` | pass |
| C12 | `run front / ✓ SHOP-12 erro do dashboard mostra tentar novamente e recupera` | pass |
| C13 | `run back / roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed` | pass |
| C14 | `run back / roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed` | pass |
| C15 | `run back / roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed` | pass |
| C16 | `run back / roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed` | pass |
| C17 | `run back / roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed` | pass |
| C18 | `f=.docs/qa/roteiro-demo.md; for t in "docker compose down -v" "docker compose up -d postgres" "spring-boot:run` | pass |
| Build | `cd backend && ./mvnw -B -q -DskipTests compile test-compile` | pass |
| Build | `cd frontend && npm run build` | pass |

## Output

`Run back` - exit 0

```
[INFO] com.hoho.shoppinghub.ShoppingDashboardIntegrationTest.emptyDatabaseYieldsZerosAndNoCategories -- Time elapsed: 0.031 s
[INFO] com.hoho.shoppinghub.ShoppingDashboardIntegrationTest.faturamentoPorCategoriaIsSortedAndAddsUpToTheTotal -- Time elapsed: 0.035 s
[INFO] com.hoho.shoppinghub.ShoppingDashboardIntegrationTest.onlyAdminShoppingMaySeeTheDashboard -- Time elapsed: 0.033 s
[INFO] com.hoho.shoppinghub.ShoppingDashboardIntegrationTest.countsEveryVoucherAndEveryCampaign -- Time elapsed: 0.044 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  25.305 s
[INFO] Finished at: 2026-11-14T13:34:44-03:00
[INFO] ------------------------------------------------------------------------
```

`Run front` - exit 0

```
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > INT-14 nota aprovada pelo backend aparece na mensagem e na lista 229ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C21 falha técnica mostra a mensagem genérica e mantém a chave 448ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C22 editar a chave apaga a mensagem anterior 447ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C23 lista ordena da mais recente e soma no cabeçalho 61ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C24 lista vazia mostra o estado vazio 30ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C25 lista tem estado de carregando erro e tentar novamente 108ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-18 botões do painel enviam as chaves do backend 263ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-19 a Tela 1 não tem reiniciar demonstração 32ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-20 ordem de validação mostra a ordem real do backend 8ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > montagem > INT-03 a Tela 1 chama o backend com o Bearer da sessão 54ms

 Test Files  11 passed (11)
      Tests  98 passed (98)
   Start at  13:34:46
   Duration  14.50s (transform 2.66s, setup 7.08s, collect 49.90s, tests 14.74s, environment 31.74s, prepare 3.23s)
```

`f=.docs/qa/roteiro-demo.md; for t in "docker compose down -v" "docker compose up -d postgres" "spring-boot:run` - exit 0

```
(no output)
```
