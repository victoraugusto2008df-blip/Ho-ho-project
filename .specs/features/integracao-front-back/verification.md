# Integração front-back, campanhas e Swagger verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at a2dfdf0
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `frontend/src/app/acesso.test.tsx` `INT-01 login real usa o usuário do seed de cada perfil` | yes |
| C2 | command proof: `! ls` of the 4 mock files and `! grep -rnE` of the flags over `frontend/src`, `vite.config.ts`, `.env.example`, `package.json`, `docker-compose.yml` | yes |
| C3 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-03 a Tela 1 chama o backend com o Bearer da sessão` | yes |
| C4 | `frontend/src/features/lojista/PortalLojista.test.tsx` `INT-04 a Tela 2 chama o backend com o Bearer da sessão` | yes |
| C5 | command proof: `grep` of the default in `frontend/vite.config.ts` and `docker compose --profile front config` showing `API_PROXY_TARGET: http://host.docker.internal:8080` | yes |
| C6 | `NotasHojeIntegrationTest.java` `validNoteCarriesStoreAndCategoryNames` | yes |
| C7 | `NotasHojeIntegrationTest.java` `notasHojeListsOnlyTodaysApprovedNotesOfTheClientNewestFirst` | no - the "ontem" note is emitted exactly 24h ago, so a rolling 24h window passes too; the day boundary is not asserted |
| C8 | `NotasHojeIntegrationTest.java` `notasHojeRequiresConsumidor` | yes |
| C9 | `NotasHojeIntegrationTest.java` `registeredKeyReturns409EvenWhenSefazDoesNotKnowIt` | yes |
| C10 | `fiscal/service/FiscalServiceRegrasTest.java` `registeredKeyIsRejectedWithoutConsultingSefaz` | yes |
| C11 | `frontend/src/features/consumidor/consumidor.test.ts` `INT-11 converte cada code do backend em erro de negócio e o resto em genérico` | yes |
| C12 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-12 cada recusa do backend mostra a mensagem própria` | no - asserts the 5 messages; the generic message for a non-business error is asserted only by the sibling `C21 falha técnica mostra a mensagem genérica e mantém a chave` |
| C13 | `frontend/src/features/consumidor/consumidor.test.ts` `INT-13 traduz a nota do backend para a forma da tela` | yes |
| C14 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-14 nota aprovada pelo backend aparece na mensagem e na lista` | yes |
| C15 | `NotasHojeIntegrationTest.java` `beneficioCarriesMaskedCpfAndVoucherCreationTime` | yes |
| C16 | `frontend/src/features/consumidor/consumidor.test.ts` `INT-16 traduz o benefício e o voucher do backend` | yes |
| C17 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-17 simular leitura percorre as chaves do catálogo do backend` | yes |
| C18 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-18 botões do painel enviam as chaves do backend` | yes |
| C19 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-19 a Tela 1 não tem reiniciar demonstração` | yes |
| C20 | `frontend/src/features/consumidor/PortalConsumidor.test.tsx` `INT-20 ordem de validação mostra a ordem real do backend` | yes |
| C21 | `CampanhaIntegrationTest.java` `campaignIsSavedForTheTokenStoreAndReturns201` | yes |
| C22 | `CampanhaIntegrationTest.java` `publicoCountsOnlyClientsInactiveForMoreThan60DaysAtTheStore` | yes |
| C23 | `CampanhaIntegrationTest.java` `invalidBodyReturns400AndSavesNothing` | yes |
| C24 | `CampanhaIntegrationTest.java` `onlyLojistaMayDispatchACampaign` | yes |
| C25 | `CampanhaIntegrationTest.java` `freshSeedGivesTheDemoStoreAPublicoOf2` | yes |
| C26 | `DatabaseMigrationTests.java` `historicalReceiptsAreSeeded` | yes |
| C27 | `frontend/src/features/lojista/PortalLojista.test.tsx` `INT-27 disparar campanha chama o backend e mostra o público devolvido` | yes |
| C28 | `frontend/src/app/mock-and-routes.test.tsx` `C32 cada portal mostra só a sua tela` | yes |
| C29 | `OpenApiDocsTest.java` `apiDocsExposeTitleBearerSchemeAndRoutes` | yes |
| C30 | `OpenApiDocsTest.java` `loginIsPublicAndTheOtherRoutesRequireBearer` | yes |
| C31 | `OpenApiDocsTest.java` `swaggerUiIsServedWithoutToken` | yes |
| C32 | `OpenApiDocsTest.java` `committedContractMatchesTheGeneratedOne` | yes |
| C33 | command proofs: the full backend suite (`./mvnw -B -q test`) and the full frontend suite (`npx vitest run`) | yes |
| C34 | `FiscalIngestionIntegrationTest.java` `malformedChaveReturns400` | yes |
| C35 | `FiscalIngestionIntegrationTest.java` `expiredNoteReturns422` | yes |
| C36 | `NotasHojeIntegrationTest.java` `postNotasRequiresConsumidor` | yes |
| C37 | `EstacionamentoIntegrationTest.java` `getHojeEnforcesConsumidorAuthorization` | yes |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| `POST /api/v1/campanhas` accepts `descontoPercentual` 15.5 and "15" with `201` and saves 15; AC 18 fixes `400` with nothing saved for an invalid body, and no check names a non-integer | `backend/src/main/java/com/hoho/shoppinghub/campanhas/dto/CampanhaRequest.java:13` - `Integer` with Jackson's default coercion; throwaway request at a2dfdf0 returned `201 {"descontoPercentual":15}` for both bodies | reject a fractional or string `descontoPercentual` with `400` and add both bodies to `invalidBodyReturns400AndSavesNothing`, or record the coercion as accepted in the plan | ab3c3c3 - C38 |
| C7's "emitida ontem" case does not hold the day boundary: the note is emitted exactly 24h before now, so a filter of "last 24 hours" passes the test | `backend/src/test/java/com/hoho/shoppinghub/NotasHojeIntegrationTest.java:98-105` - `agora.minus(1, ChronoUnit.DAYS)`; the code itself is right (own example below) | emit the excluded note at local midnight minus 1s and add an included note at local midnight | ab3c3c3 - C7 |
| C12's proof selects a test that does not assert the generic message the claim names (500 sem corpo, 409 com `code` desconhecido) | `frontend/src/features/consumidor/PortalConsumidor.test.tsx:320-345` asserts only the 5 codes; the generic cases sit in `C21 falha técnica...` at `:375-394` | add the two generic cases to INT-12, or add `C21 falha técnica mostra a mensagem genérica e mantém a chave` as a second proof of C12 | ab3c3c3 - C12 |
| AC 24 says every other `/api/v1` route requires `bearerAuth`; the test checks 5 of the 10 protected operations (the 4 `/api/v1/auth/probe/*` routes and `/api/v1/analytics/shopping/dashboard` are not asserted) | `backend/src/test/java/com/hoho/shoppinghub/OpenApiDocsTest.java:32-37,78` - fixed list `ROTAS_PROTEGIDAS`; the live document does inherit the global requirement on all of them | iterate over every path of the document that starts with `/api/v1` except `/api/v1/auth/login` | ab3c3c3 - C30 |
| A LOJISTA token with no `lojaId` makes `POST /api/v1/campanhas` throw an unhandled `DataIntegrityViolationException` (not a 4xx); `usuarios.loja_id` is nullable for any role, and no check names it | `backend/src/main/java/com/hoho/shoppinghub/campanhas/controller/CampanhaController.java:39` passes `user.getLojaId()` unchecked to `CampanhaRepository.salvar`; throwaway request at a2dfdf0 failed with `null value in column "loja_id" of relation "campanhas"` | answer `403` when the token has no `lojaId` and add the case to `onlyLojistaMayDispatchACampaign` | ab3c3c3 - C39 |
