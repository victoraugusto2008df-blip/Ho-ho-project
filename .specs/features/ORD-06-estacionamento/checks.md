# Motor de Estacionamento Grátis (módulo beneficios) - Checks

Profile: light
Plan: .specs/features/ORD-06-estacionamento/plan.md

## Intent

8 checks in 2 slices · 3 one-way doors · 0 open

## Checks

### S1 - Motor de Acúmulo Diário e Emissão Idempotente de Voucher

**C1** - Two `APROVADA` receipts of R$ 80.00 on the same day accumulate R$ 160.00 and generate exactly 1 `VoucherEstacionamento` with status `LIBERADO` (ORD-06, AC 1)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#twoReceiptsOf80EmitExactlyOneVoucher`

**C2** - A third `APROVADA` receipt on the same day adds to the daily sum without generating a second voucher (ReN04) (ORD-06, AC 2)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#thirdReceiptSameDayDoesNotEmitSecondVoucher`

**C3** - Historical receipts from previous days and non-`APROVADA` receipts are ignored in today's accumulation (ReN03) (ORD-06, AC 3)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#onlyApprovedReceiptsFromTodayAreSummed`

**C4** - Database unique constraint `uk_voucher_cliente_data` rejects duplicate `(cliente_id, data_referencia)` voucher insertion (ORD-06, AC 4)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#duplicateVoucherSameDayIsRejectedByDatabaseConstraint`

### S2 - Endpoint `GET /api/v1/beneficios/estacionamento/hoje` e Segurança

**C5** - Authenticated `CONSUMIDOR` with no receipts today receives HTTP 200 with `0.00` accumulated, `0%`, `150.00` remaining, `voucherLiberado: false`, and `voucher: null` (ORD-06, AC 5)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#getHojeReturnsZeroProgressWhenNoReceiptsToday`

**C6** - Authenticated `CONSUMIDOR` with R$ 65.00 today receives HTTP 200 with `valorAcumulado: 65.00`, `percentual: 43`, `valorFaltante: 85.00`, `voucherLiberado: false`, and `voucher: null` (ORD-06, AC 6)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#getHojeReturnsPartialProgress`

**C7** - Authenticated `CONSUMIDOR` reaching R$ 160.00 today receives HTTP 200 with `valorAcumulado: 160.00`, `percentual: 100`, `valorFaltante: 0.00`, `voucherLiberado: true`, and `voucher` with `codigoQr` and `status: "LIBERADO"` (ORD-06, AC 7)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#getHojeReturnsLiberatedVoucherAndQrCode`

**C8** - `GET /api/v1/beneficios/estacionamento/hoje` returns HTTP 401 when unauthenticated and HTTP 403 for `LOJISTA` and `ADMIN_SHOPPING` (ORD-06, AC 8)
Proof: `cd backend && ./mvnw test -Dtest=EstacionamentoIntegrationTest#getHojeEnforcesConsumidorAuthorization`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| parking motor rules (4) | accumulate >= 150 emits 1 voucher `C1` · 3rd receipt blocked from 2nd voucher `C2` · only APROVADA today summed `C3` · DB constraint `uk_voucher_cliente_data` `C4` | - |
| endpoint progress states (3) | 0% (`0.00`) `C5` · partial (`65.00` -> `43%`) `C6` · liberated (`160.00` -> `100%` + QR) `C7` | - |
| authorization roles (4) | unauthenticated -> `401` `C8` · `CONSUMIDOR` -> `200` `C5, C6, C7` · `LOJISTA` -> `403` `C8` · `ADMIN_SHOPPING` -> `403` `C8` | - |
| one-way doors (3) | DB unique constraint `(cliente_id, data_referencia)` `C4` · live SQL sum over today's approved receipts `C3` · JSON contract with nullable `voucher` `C5, C7` | - |

## Swept

- validation: C3, C8
- failure modes: C2, C4, C8
- idempotency: C2, C4
- authorization: C8
- concurrency: C4
- data lifecycle: C1, C2, C3
- dependency failure: n/a - PostgreSQL/Flyway startup failure halts Spring Boot fail-fast
- state transitions: C1, C7
- observability: n/a - domain event and endpoint tested end-to-end; structured logging not specified in ORD-06

## Handoff

- S1 = ~15k tokens, S2 = ~12k tokens; total estimate ~27k tokens, well under the 150k budget - one builder
- Build status: C1-C8 implemented in `EstacionamentoIntegrationTest` and passing (`./mvnw -B test`: 52/52 tests pass, 0 failures, 0 errors, 0 skipped)
