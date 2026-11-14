# ORD-06-estacionamento verification

**Verdict**: PASS
**Profile**: light
**Diff range**: fa7052b..0c7a893 (`develop..HEAD`)
**Round**: 1 - full
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | Two `APROVADA` receipts of R$ 80.00 on the same day accumulate R$ 160.00 and generate exactly 1 `VoucherEstacionamento` with status `LIBERADO` | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#twoReceiptsOf80EmitExactlyOneVoucher`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:78-81` - `assertThat(vouchers).hasSize(1);` / `assertThat(vouchers.getFirst().getStatus()).isEqualTo("LIBERADO");` / `assertThat(vouchers.getFirst().getValorAcumulado()).isEqualByComparingTo("160.00");` | PASS |
| C2 | A third `APROVADA` receipt on the same day adds to the daily sum without generating a second voucher (ReN04) | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#thirdReceiptSameDayDoesNotEmitSecondVoucher`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:95` - `assertThat(voucherCount).isEqualTo(1);` | PASS |
| C3 | Historical receipts from previous days and non-`APROVADA` receipts are ignored in today's accumulation (ReN03) | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#onlyApprovedReceiptsFromTodayAreSummed`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:121-126` - `.andExpect(status().isOk()).andExpect(jsonPath("$.valorAcumulado").value(50.00))` | PASS |
| C4 | Database unique constraint `uk_voucher_cliente_data` rejects duplicate `(cliente_id, data_referencia)` voucher insertion | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#duplicateVoucherSameDayIsRejectedByDatabaseConstraint`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:143-153` - `assertThatThrownBy(() -> jdbcTemplate.update(...)).isInstanceOf(DataIntegrityViolationException.class);` | PASS |
| C5 | Authenticated `CONSUMIDOR` with no receipts today receives HTTP 200 with `0.00` accumulated, `0%`, `150.00` remaining, `voucherLiberado: false`, and `voucher: null` | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#getHojeReturnsZeroProgressWhenNoReceiptsToday`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:160-166` - `.andExpect(status().isOk()).andExpect(jsonPath("$.valorAcumulado").value(0.00)).andExpect(jsonPath("$.meta").value(150.00)).andExpect(jsonPath("$.percentual").value(0)).andExpect(jsonPath("$.valorFaltante").value(150.00)).andExpect(jsonPath("$.voucherLiberado").value(false)).andExpect(jsonPath("$.voucher").isEmpty());` | PASS |
| C6 | Authenticated `CONSUMIDOR` with R$ 65.00 today receives HTTP 200 with `valorAcumulado: 65.00`, `percentual: 43`, `valorFaltante: 85.00`, `voucherLiberado: false`, and `voucher: null` | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#getHojeReturnsPartialProgress`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:175-181` - `.andExpect(status().isOk()).andExpect(jsonPath("$.valorAcumulado").value(65.00)).andExpect(jsonPath("$.percentual").value(43)).andExpect(jsonPath("$.valorFaltante").value(85.00)).andExpect(jsonPath("$.voucherLiberado").value(false)).andExpect(jsonPath("$.voucher").isEmpty());` | PASS |
| C7 | Authenticated `CONSUMIDOR` reaching R$ 160.00 today receives HTTP 200 with `valorAcumulado: 160.00`, `percentual: 100`, `valorFaltante: 0.00`, `voucherLiberado: true`, and `voucher` with `codigoQr` and `status: "LIBERADO"` | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#getHojeReturnsLiberatedVoucherAndQrCode`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:191-200` - `.andExpect(status().isOk()).andExpect(jsonPath("$.valorAcumulado").value(160.00)).andExpect(jsonPath("$.percentual").value(100)).andExpect(jsonPath("$.valorFaltante").value(0.00)).andExpect(jsonPath("$.voucherLiberado").value(true)).andExpect(jsonPath("$.voucher.codigoQr").isNotEmpty()).andExpect(jsonPath("$.voucher.status").value("LIBERADO"))` | PASS |
| C8 | `GET /api/v1/beneficios/estacionamento/hoje` returns HTTP 401 when unauthenticated and HTTP 403 for `LOJISTA` and `ADMIN_SHOPPING` | `Set-Location backend; .\mvnw.cmd -B test` (`EstacionamentoIntegrationTest#getHojeEnforcesConsumidorAuthorization`) exit 0 | `backend/src/test/java/com/hoho/shoppinghub/EstacionamentoIntegrationTest.java:205-214` - `status().isUnauthorized()` (line 206), `status().isForbidden()` (line 210), `status().isForbidden()` (line 214) | PASS |

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| parking motor rules (4) | accumulate >= 150 emits 1 voucher `C1` · 3rd receipt blocked from 2nd voucher `C2` · only APROVADA today summed `C3` · DB constraint `uk_voucher_cliente_data` `C4` | - |
| endpoint progress states (3) | 0% (`0.00`) `C5` · partial (`65.00` -> `43%`) `C6` · liberated (`160.00` -> `100%` + QR) `C7` | - |
| authorization roles (4) | unauthenticated -> `401` `C8` · `CONSUMIDOR` -> `200` `C5, C6, C7` · `LOJISTA` -> `403` `C8` · `ADMIN_SHOPPING` -> `403` `C8` | - |
| one-way doors (3) | DB unique constraint `(cliente_id, data_referencia)` `C4` · live SQL sum over today's approved receipts `C3` · JSON contract with nullable `voucher` `C5, C7` | - |

## Swept

- `validation` (`C3`, `C8`): confirmed in `NotaFiscalRepository.java:18-20` (`n.status = 'APROVADA'` and `[inicioDia, fimDia)`) and `EstacionamentoController.java:24` (`@PreAuthorize("hasRole('CONSUMIDOR')")`).
- `failure modes` (`C2`, `C4`, `C8`): confirmed in `EstacionamentoService.java:57-59,67-71` (exists check + `DataIntegrityViolationException` catch) and `V1__create_domain_tables.sql:64` (`uk_voucher_cliente_data`).
- `idempotency` (`C2`, `C4`): confirmed in `EstacionamentoService.java:57-71` and `VoucherEstacionamento.java:17-19`.
- `authorization` (`C8`): confirmed in `EstacionamentoController.java:24` (`@PreAuthorize("hasRole('CONSUMIDOR')")`).
- `concurrency` (`C4`): confirmed via `uk_voucher_cliente_data` (`V1__create_domain_tables.sql:64`) and `saveAndFlush` + `DataIntegrityViolationException` handling (`EstacionamentoService.java:67-71`).
- `data lifecycle` (`C1`, `C2`, `C3`): confirmed in `EstacionamentoService.java:50-106` and `NotaFiscalRepository.java:14-25`.
- `dependency failure`: `n/a` (approved in `checks.md`).
- `state transitions` (`C1`, `C7`): confirmed in `VoucherEstacionamento.java:53` (`this.status = "LIBERADO"`).
- `observability`: `n/a` (approved in `checks.md`).

## Gate

`Set-Location backend; .\mvnw.cmd -B test` - 52 passed, 0 failed, 0 errors, 0 skipped (including `EstacionamentoIntegrationTest`: 8 passed, 0 failed, 0 errors, 0 skipped).
