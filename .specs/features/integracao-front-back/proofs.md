# integracao-front-back proofs

**HEAD**: a2dfdf0
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 40 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run front / ✓ INT-01 login real usa o usuário do seed de cada perfil` | pass |
| C2 | `! ls frontend/src/features/consumidor/mockNotasApi.ts frontend/src/features/lojista/mockLojistaApi.ts frontend` | pass |
| C3 | `run front / ✓ INT-03 a Tela 1 chama o backend com o Bearer da sessão` | pass |
| C4 | `run front / ✓ INT-04 a Tela 2 chama o backend com o Bearer da sessão` | pass |
| C5 | `grep -q "API_PROXY_TARGET ?? 'http://localhost:8080'" frontend/vite.config.ts && docker compose --env-file .en` | pass |
| C6 | `run back / validNoteCarriesStoreAndCategoryNames -- Time elapsed` | pass |
| C7 | `run back / notasHojeListsOnlyTodaysApprovedNotesOfTheClientNewestFirst -- Time elapsed` | pass |
| C8 | `run back / notasHojeRequiresConsumidor -- Time elapsed` | pass |
| C9 | `run back / registeredKeyReturns409EvenWhenSefazDoesNotKnowIt -- Time elapsed` | pass |
| C10 | `run back / registeredKeyIsRejectedWithoutConsultingSefaz -- Time elapsed` | pass |
| C11 | `run front / ✓ INT-11 converte cada code do backend em erro de negócio e o resto em genérico` | pass |
| C12 | `run front / ✓ INT-12 cada recusa do backend mostra a mensagem própria` | pass |
| C13 | `run front / ✓ INT-13 traduz a nota do backend para a forma da tela` | pass |
| C14 | `run front / ✓ INT-14 nota aprovada pelo backend aparece na mensagem e na lista` | pass |
| C15 | `run back / beneficioCarriesMaskedCpfAndVoucherCreationTime -- Time elapsed` | pass |
| C16 | `run front / ✓ INT-16 traduz o benefício e o voucher do backend` | pass |
| C17 | `run front / ✓ INT-17 simular leitura percorre as chaves do catálogo do backend` | pass |
| C18 | `run front / ✓ INT-18 botões do painel enviam as chaves do backend` | pass |
| C19 | `run front / ✓ INT-19 a Tela 1 não tem reiniciar demonstração` | pass |
| C20 | `run front / ✓ INT-20 ordem de validação mostra a ordem real do backend` | pass |
| C34 | `run back / malformedChaveReturns400 -- Time elapsed` | pass |
| C35 | `run back / expiredNoteReturns422 -- Time elapsed` | pass |
| C36 | `run back / postNotasRequiresConsumidor -- Time elapsed` | pass |
| C37 | `run back / getHojeEnforcesConsumidorAuthorization -- Time elapsed` | pass |
| C21 | `run back / campaignIsSavedForTheTokenStoreAndReturns201 -- Time elapsed` | pass |
| C22 | `run back / publicoCountsOnlyClientsInactiveForMoreThan60DaysAtTheStore -- Time elapsed` | pass |
| C23 | `run back / invalidBodyReturns400AndSavesNothing -- Time elapsed` | pass |
| C24 | `run back / onlyLojistaMayDispatchACampaign -- Time elapsed` | pass |
| C25 | `run back / freshSeedGivesTheDemoStoreAPublicoOf2 -- Time elapsed` | pass |
| C26 | `run back / historicalReceiptsAreSeeded -- Time elapsed` | pass |
| C27 | `run front / ✓ INT-27 disparar campanha chama o backend e mostra o público devolvido` | pass |
| C28 | `run front / ✓ C32 cada portal mostra só a sua tela` | pass |
| C29 | `run back / apiDocsExposeTitleBearerSchemeAndRoutes -- Time elapsed` | pass |
| C30 | `run back / loginIsPublicAndTheOtherRoutesRequireBearer -- Time elapsed` | pass |
| C31 | `run back / swaggerUiIsServedWithoutToken -- Time elapsed` | pass |
| C32 | `run back / committedContractMatchesTheGeneratedOne -- Time elapsed` | pass |
| C33 | `cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true` | pass |
| C33 | `cd frontend && npx vitest run` | pass |
| Build | `cd backend && ./mvnw -B -q -DskipTests compile test-compile` | pass |
| Build | `cd frontend && npm run build` | pass |

## Output

`Run front` - exit 0

```
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > INT-14 nota aprovada pelo backend aparece na mensagem e na lista 202ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C21 falha técnica mostra a mensagem genérica e mantém a chave 496ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C22 editar a chave apaga a mensagem anterior 479ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C23 lista ordena da mais recente e soma no cabeçalho 45ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C24 lista vazia mostra o estado vazio 31ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C25 lista tem estado de carregando erro e tentar novamente 92ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-18 botões do painel enviam as chaves do backend 262ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-19 a Tela 1 não tem reiniciar demonstração 34ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > INT-20 ordem de validação mostra a ordem real do backend 7ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > montagem > INT-03 a Tela 1 chama o backend com o Bearer da sessão 40ms

 Test Files  11 passed (11)
      Tests  98 passed (98)
   Start at  13:32:01
   Duration  12.58s (transform 1.85s, setup 6.69s, collect 36.86s, tests 12.41s, environment 29.60s, prepare 3.13s)
```

`Run back` - exit 0

```
[INFO] com.hoho.shoppinghub.OpenApiDocsTest.committedContractMatchesTheGeneratedOne -- Time elapsed: 0.472 s
[INFO] com.hoho.shoppinghub.OpenApiDocsTest.loginIsPublicAndTheOtherRoutesRequireBearer -- Time elapsed: 0.013 s
[INFO] com.hoho.shoppinghub.OpenApiDocsTest.swaggerUiIsServedWithoutToken -- Time elapsed: 0.027 s
[INFO] com.hoho.shoppinghub.OpenApiDocsTest.apiDocsExposeTitleBearerSchemeAndRoutes -- Time elapsed: 0.010 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 47, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  31.998 s
[INFO] Finished at: 2026-11-14T13:32:50-03:00
[INFO] ------------------------------------------------------------------------
```

`! ls frontend/src/features/consumidor/mockNotasApi.ts frontend/src/features/lojista/mockLojistaApi.ts frontend` - exit 0

```
(no output)
```

`grep -q "API_PROXY_TARGET ?? 'http://localhost:8080'" frontend/vite.config.ts && docker compose --env-file .en` - exit 0

```
(no output)
```

`cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true` - exit 0

```
2026-11-14T13:33:30.086-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbValidate     : Successfully validated 3 migrations (execution time 00:00.016s)
2026-11-14T13:33:30.115-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.c.i.s.JdbcTableSchemaHistory         : Creating Schema History table "public"."flyway_schema_history" ...
2026-11-14T13:33:30.183-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbMigrate      : Current version of schema "public": << Empty Schema >>
2026-11-14T13:33:30.196-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "1 - create domain tables"
2026-11-14T13:33:30.289-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "2 - seed demo data"
2026-11-14T13:33:30.320-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "3 - seed clientes inativos"
2026-11-14T13:33:30.334-03:00  INFO 145548 --- [shopping-hub] [           main] o.f.core.internal.command.DbMigrate      : Successfully applied 3 migrations to schema "public", now at version v3 (execution time 00:00.103s)
2026-11-14T13:33:30.701-03:00  INFO 145548 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.SecurityIntegrationTest]: SecurityIntegrationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T13:33:30.718-03:00  INFO 145548 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.SecurityIntegrationTest
2026-11-14T13:33:30.770-03:00  INFO 145548 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.ShoppingDashboardIntegrationTest]: ShoppingDashboardIntegrationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T13:33:30.778-03:00  INFO 145548 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.ShoppingDashboardIntegrationTest
2026-11-14T13:33:30.928-03:00  INFO 145548 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.ShoppingHubApplicationTests]: ShoppingHubApplicationTests does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T13:33:30.936-03:00  INFO 145548 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.ShoppingHubApplicationTests
2026-11-14T13:33:30.942-03:00  INFO 145548 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.TenantIsolationTest]: TenantIsolationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T13:33:30.950-03:00  INFO 145548 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.TenantIsolationTest
```

`cd frontend && npx vitest run` - exit 0

```
 ✓ src/app/acesso.test.tsx (9 tests) 1076ms
 ✓ src/app/shell.test.tsx (9 tests) 2228ms
   ✓ troca de perfil no shell > C26 aba de perfil troca de perfil em 1 clique  896ms
 ✓ src/features/lojista/PortalLojista.test.tsx (23 tests) 2224ms
   ✓ Montagem > C23 cabeçalho mostra título e selos  440ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx (24 tests) 4900ms
   ✓ S3 - cadastrar nota > C16 CPF com dígito verificador inválido é recusado sem requisição  402ms
   ✓ S3 - cadastrar nota > INT-12 cada recusa do backend mostra a mensagem própria  818ms
   ✓ S3 - cadastrar nota > C21 falha técnica mostra a mensagem genérica e mantém a chave  467ms
   ✓ S3 - cadastrar nota > C22 editar a chave apaga a mensagem anterior  478ms

 Test Files  11 passed (11)
      Tests  98 passed (98)
   Start at  13:33:35
   Duration  13.87s (transform 1.61s, setup 6.50s, collect 42.88s, tests 13.25s, environment 33.25s, prepare 3.65s)
```
