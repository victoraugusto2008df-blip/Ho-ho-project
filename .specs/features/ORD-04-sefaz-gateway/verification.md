# ORD-04-sefaz-gateway verification

**Verdict**: PASS
**Profile**: light
**Diff range**: develop..fa4194a
**Round**: 1 - full
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | `ConsultaNotaFiscalGateway` and `DadosNotaFiscalSefaz` reside in `fiscal.domain` without dependencies on `fiscal.gateway` or web packages | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`domainContractIsIsolatedFromGatewayImplementation`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:36-46` — `assertThat(ConsultaNotaFiscalGateway.class.getPackageName()).isEqualTo("com.hoho.shoppinghub.fiscal.domain")`, `assertThat(DadosNotaFiscalSefaz.class.getPackageName()).isEqualTo("com.hoho.shoppinghub.fiscal.domain")`, `assertThat(method.getReturnType()).isEqualTo(Optional.class)`, `assertThat(ConsultaNotaFiscalGateway.class.isAssignableFrom(MockSefazGateway.class)).isTrue()` | PASS |
| C2 | Null, blank, or non-44-digit numeric access keys are rejected with `IllegalArgumentException` | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`invalidChaveAcessoThrowsIllegalArgumentException`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:51-58` — `assertThatThrownBy(() -> gateway.consultarPorChave(...)).isInstanceOf(IllegalArgumentException.class)` for `null`, `"   "`, `"1234567890"`, and `"3526111111111100010165001000000101000000010A"` | PASS |
| C3 | Accredited store receipt key returns `DadosNotaFiscalSefaz` with seeded store CNPJ, positive `valorTotal`, and `dataEmissao` within 72 hours of `Clock` | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`accreditedStoreReceiptReturnsValidDataWithinWindow`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:67-69` — `assertThat(SEEDED_SHOPPING_CNPJS).contains(nota.cnpjEmitente())`, `assertThat(nota.valorTotal()).isEqualByComparingTo("65.00")`, `assertThat(Duration.between(nota.dataEmissao(), FIXED_NOW)).isLessThan(Duration.ofHours(72))` | PASS |
| C4 | Designated demo receipt pairs sum to exact `150.00` (`65.00 + 85.00` and `55.00 + 95.00`) for voucher accumulation flow | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`demoKeyPairsSumExactlyToVoucherThreshold`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:80-81` — `assertThat(par1).isEqualByComparingTo("150.00")`, `assertThat(par2).isEqualByComparingTo("150.00")` | PASS |
| C5 | Expired receipt key returns `dataEmissao` older than 72 hours relative to `Clock` for ReN02 validation | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`expiredReceiptReturnsTimestampOlderThan72Hours`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:89-90` — `assertThat(SEEDED_SHOPPING_CNPJS).contains(notaExpirada.cnpjEmitente())`, `assertThat(Duration.between(notaExpirada.dataEmissao(), FIXED_NOW)).isGreaterThan(Duration.ofHours(72))` | PASS |
| C6 | External store receipt key returns unaccredited CNPJ not present in shopping seed for RF03 validation | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`unaccreditedStoreReceiptReturnsExternalCnpj`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:98-100` — `assertThat(SEEDED_SHOPPING_CNPJS).doesNotContain(notaExterna.cnpjEmitente())`, `assertThat(notaExterna.cnpjEmitente()).isEqualTo("99999999000199")`, `assertThat(notaExterna.valorTotal()).isPositive()` | PASS |
| C7 | Unmapped valid 44-digit numeric key returns `Optional.empty()` | `Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` (`unknownValidKeyReturnsEmpty`, exit 0) | `backend/src/test/java/com/hoho/shoppinghub/fiscal/MockSefazGatewayTest.java:108` — `assertThat(resultado).isEmpty()` | PASS |

## Swept existing

- `validation` (`C2`): verified at `backend/src/main/java/com/hoho/shoppinghub/fiscal/gateway/MockSefazGateway.java:38,62-65` (`Pattern.compile("^\\d{44}$")` and `IllegalArgumentException` on null or non-matching key).
- `failure modes` (`C2, C5, C6, C7`): verified invalid input throws `IllegalArgumentException` (`MockSefazGateway.java:62-65`), expired receipt uses `Duration.ofHours(96)` (`MockSefazGateway.java:45`), external store uses `99999999000199` (`MockSefazGateway.java:46`), and unmapped valid key returns `Optional.empty()` (`MockSefazGateway.java:67`).
- `idempotency` (`C3, C4`) & `concurrency` (`C3`): verified `CATALOGO` is an immutable `Map.of(...)` (`MockSefazGateway.java:40-47`) and `clock` is `private final Clock` (`MockSefazGateway.java:49`), with pure read-only lookup (`MockSefazGateway.java:67-72`).
- `Coverage` rows (`demo scenarios (5)`, `input validation cases (4)`, `threshold pairs (2)`, `one-way doors (3)`): all members match `MockSefazGateway.java`, `ConsultaNotaFiscalGateway.java`, `DadosNotaFiscalSefaz.java`, `demo-keys.md`, and `V2__seed_demo_data.sql:12-16` with 0 unproven members.

## Gate

`Set-Location backend; .\mvnw.cmd -B test -Dtest=MockSefazGatewayTest` - 7 passed, 0 failed, 0 errors, 0 skipped
