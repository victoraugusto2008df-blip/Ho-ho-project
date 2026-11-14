# ORD-13-testes-regras verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at d5be11a
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `FiscalServiceRegrasTest.java` `duplicateKeyIsRejectedWith409AndPublishesNothing` | yes |
| C2 | `FiscalServiceRegrasTest.java` `uniqueKeyIsPersistedAndPublishesOneEvent` | yes |
| C3 | `FiscalServiceRegrasTest.java` `noteOlderThan72hIsRejectedAndNotSaved` | yes |
| C4 | `FiscalServiceRegrasTest.java` `noteWithin72hIsAccepted` | yes |
| C5 | `EstacionamentoServiceRegrasTest.java` `reachingTheGoalEmitsVoucherWithTheDailySum` | yes |
| C6 | `EstacionamentoServiceRegrasTest.java` `belowTheGoalEmitsNoVoucher` | yes |
| C7 | `EstacionamentoServiceRegrasTest.java` `sumIsRequestedForTheClientAndTheClockDayOnly` + `EstacionamentoIntegrationTest.java` `onlyApprovedReceiptsFromTodayAreSummed` | no - client and window arguments are held by the unit test; in the query only the status filter and the lower bound are exercised, not the upper bound nor the client filter |
| C8 | `EstacionamentoServiceRegrasTest.java` `secondAttemptSameDayEmitsNoVoucher` | yes |
| C9 | `EstacionamentoServiceRegrasTest.java` `firstAttemptEmitsExactlyOneVoucherAndToleratesARace` | yes |
| C10 | `KAnonymityRegraTest.java` `belowThreeActiveStoresHidesTheCategoryAverage` | yes |
| C11 | `KAnonymityRegraTest.java` `fromThreeActiveStoresShowsTheCategoryAverage` | yes |
| C12 | full backend suite (`./mvnw -B -q test`), all test classes under `backend/src/test` | yes |
| C13 | `! grep -rn "@Disabled" backend/src/test` (no test method; also no `@Ignore`, `Assumptions`, `@EnabledIf`/`@DisabledIf` found) | yes |
| C14 | `EstacionamentoIntegrationTest.java` `receiptsOfTomorrowOrOfAnotherClientAreNotSummed` | yes - against the real query: dropping the upper bound gives 350.00, dropping the client filter gives 450.00, either also emits a voucher; the test asserts 50.00 and no voucher |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| C7 says only `APROVADA` receipts inside the window enter the sum, but the query's upper bound (`n.dataEmissao < :fimDia`) and its client filter (`n.clienteId = :clienteId`) can be removed with every test green | `backend/src/main/java/com/hoho/shoppinghub/fiscal/domain/NotaFiscalRepository.java:17-20` holds the four conditions; `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:99-127` seeds only a receipt 24h old, a `REJEITADA` one and one of today, all for the same client; `EstacionamentoServiceRegrasTest.java:106` only verifies the arguments passed to a mocked repository | in `onlyApprovedReceiptsFromTodayAreSummed` (or a sibling test) also seed an `APROVADA` receipt dated tomorrow and an `APROVADA` receipt of today for another client, and keep the `valorAcumulado` 50.00 assertion | 8df7ef9 - C14 |
