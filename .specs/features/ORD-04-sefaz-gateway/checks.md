# ConsultaNotaFiscalGateway and MockSefazGateway (DIP) - Checks

Profile: light
Plan: .specs/features/ORD-04-sefaz-gateway/plan.md

## Intent

7 checks in 2 slices · 3 one-way doors · 0 open

## Checks

### S1 - Abstração de Domínio (DIP) e Contrato de Retorno

**C1** - `ConsultaNotaFiscalGateway` and `DadosNotaFiscalSefaz` reside in `fiscal.domain` without dependencies on `fiscal.gateway` or web packages (ORD-04, AC 1)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#domainContractIsIsolatedFromGatewayImplementation`

**C2** - Null, blank, or non-44-digit numeric access keys are rejected with `IllegalArgumentException` (ORD-04, AC 2)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#invalidChaveAcessoThrowsIllegalArgumentException`

### S2 - Adaptador Determinístico `MockSefazGateway`

**C3** - Accredited store receipt key returns `DadosNotaFiscalSefaz` with seeded store CNPJ, positive `valorTotal`, and `dataEmissao` within 72 hours of `Clock` (ORD-04, AC 3)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#accreditedStoreReceiptReturnsValidDataWithinWindow`

**C4** - Designated demo receipt pairs sum to exact `150.00` (`65.00 + 85.00` and `55.00 + 95.00`) for voucher accumulation flow (ORD-04, AC 4)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#demoKeyPairsSumExactlyToVoucherThreshold`

**C5** - Expired receipt key returns `dataEmissao` older than 72 hours relative to `Clock` for ReN02 validation (ORD-04, AC 5)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#expiredReceiptReturnsTimestampOlderThan72Hours`

**C6** - External store receipt key returns unaccredited CNPJ not present in shopping seed for RF03 validation (ORD-04, AC 6)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#unaccreditedStoreReceiptReturnsExternalCnpj`

**C7** - Unmapped valid 44-digit numeric key returns `Optional.empty()` (ORD-04, AC 7)
Proof: `cd backend && ./mvnw test -Dtest=MockSefazGatewayTest#unknownValidKeyReturnsEmpty`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| demo scenarios (5) | valid accredited `C3` · threshold sum 150 `C4` · expired > 72h `C5` · external CNPJ `C6` · unknown 44-digit key `C7` | - |
| input validation cases (4) | null `C2` · blank `C2` · length != 44 `C2` · non-numeric 44 chars `C2` | - |
| threshold pairs (2) | `65.00 + 85.00` `C4` · `55.00 + 95.00` `C4` | - |
| one-way doors (3) | DIP package isolation `C1` · pure `Optional<DadosNotaFiscalSefaz>` contract `C1` · seeded store CNPJs `C3, C4` | - |

## Swept

- validation: C2
- failure modes: C2, C5, C6, C7
- idempotency: C3, C4
- authorization: n/a - gateway adapter is an internal Spring bean with no user or role context
- concurrency: C3
- data lifecycle: n/a - in-memory deterministic catalog without persistence
- dependency failure: n/a - MockSefazGateway is an in-memory deterministic adapter with no external network I/O
- state transitions: n/a - pure read-only lookup
- observability: n/a - internal lookup adapter; audit logging belongs to ORD-05 fiscal service

## Handoff

- S1 = ~6k tokens, S2 = ~10k tokens; total estimate ~16k tokens, well under the 150k budget - one builder
- Build status: C1-C7 implemented in `MockSefazGatewayTest` and passing (`./mvnw -B test -Dtest=MockSefazGatewayTest`: 7/7 tests pass, 0 failures, 0 errors, 0 skipped)
