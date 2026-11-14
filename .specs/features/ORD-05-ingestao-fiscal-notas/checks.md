# Ingestão Fiscal (ORD-05) checks

Profile: light
Plan: `.specs/features/ORD-05-ingestao-fiscal-notas/plan.md`

10 checks in 2 slices · 2 one-way doors · 0 open

## Checks

### S1 - Ingestão, persistência e evento · 10 files · ~20 KB · ~5k

**C1** - A `POST /api/v1/notas` with a valid 44-digit `chaveAcesso` (active loja, emission within 72h) responds `201` with a body carrying `chaveAcesso`, `valorTotal`, `dataEmissao`, `status=APROVADA`, `clienteId` and `lojaId` (AC 1)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#validNoteReturns201WithRepresentation`

**C2** - Persisting a valid note publishes a `NotaFiscalValidadaEvent` carrying `chaveAcesso`, `clienteId`, `lojaId`, `valorTotal` and `dataEmissao` (AC 2)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#validNotePublishesEvent`

**C3** - A `POST /api/v1/notas` with an already-persisted `chaveAcesso` responds `409` with `code=NOTA_DUPLICADA` (AC 3)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#duplicateChaveReturns409`

**C4** - `NotaFiscalValidadaEvent` is a record with exactly six fields: `notaFiscalId`, `chaveAcesso`, `clienteId`, `lojaId`, `valorTotal`, `dataEmissao` (Landing: event payload)
Proof: `./mvnw -B test -Dtest=NotaFiscalValidadaEventTest#eventCarriesContractFields`

### S2 - Rejeições de negócio e contrato de erro · 6 files · ~12 KB · ~3k

**C5** - A `POST /api/v1/notas` whose resolved `dataEmissao` is more than 72h before now responds `422` with `code=NOTA_EXPIRADA_72H` and persists nothing (AC 4)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#expiredNoteReturns422`

**C6** - A `POST /api/v1/notas` whose `cnpjEmitente` matches no active loja responds `422` with `code=LOJA_NAO_CREDENCIADA` and persists nothing (AC 5)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#foreignStoreNoteReturns422`

**C7** - A `POST /api/v1/notas` whose `chaveAcesso` does not resolve in the gateway responds `404` with `code=CHAVE_NAO_ENCONTRADA` (AC 6)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#unknownChaveReturns404`

**C8** - A `POST /api/v1/notas` whose `chaveAcesso` is not 44 numeric digits responds `400` with `code=CHAVE_INVALIDA` (AC 7)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#malformedChaveReturns400`

**C9** - Every rejection body carries a stable `code` and a non-empty `message` (AC 8)
Proof: `./mvnw -B test -Dtest=FiscalIngestionIntegrationTest#errorsCarryCodeAndNonEmptyMessage`

**C10** - The rejection `code` maps to its HTTP status exactly, table-driven over all five: `NOTA_DUPLICADA`→`409`, `NOTA_EXPIRADA_72H`→`422`, `LOJA_NAO_CREDENCIADA`→`422`, `CHAVE_NAO_ENCONTRADA`→`404`, `CHAVE_INVALIDA`→`400` (Landing: error contract)
Proof: `./mvnw -B test -Dtest=FiscalErrorContractTest#mapsEachRejectionToStatusAndCode`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `POST /api/v1/notas` statuses (5) | `201` C1 · `400` C8 · `404` C7 · `409` C3 · `422` C5, C6 | - |
| error code -> status (5) | `NOTA_DUPLICADA` C3 · `NOTA_EXPIRADA_72H` C5 · `LOJA_NAO_CREDENCIADA` C6 · `CHAVE_NAO_ENCONTRADA` C7 · `CHAVE_INVALIDA` C8 | - |
| `NotaFiscalValidadaEvent` fields (6) | C4, table-driven over all 6 | - |

- Claims naming a status code: C1, C3, C5, C6, C7, C8 - each has a proof that crosses the boundary (MockMvc).
- No other check claims more than the single case its proof exercises.

## Swept

- validation: C8
- failure modes: C5, C6, C7
- idempotency: C3
- authorization: existing - ORD-02 SecurityConfig (`anyRequest().authenticated()` + `@PreAuthorize("hasRole('CONSUMIDOR')")`)
- concurrency: existing - `notas_fiscais.chave_acesso` UNIQUE constraint (ORD-01) rejects the concurrent duplicate
- data lifecycle: n/a - no TTL/archival/deletion; notes persist indefinitely for the MVP
- dependency failure: n/a - `MockSefazGateway` is in-process and deterministic (ADR-04); no real external call to fail
- state transitions: C1
- observability: n/a - no logging or metrics requirement in this slice

## Handoff

Size, with the arithmetic, written after the checks exist and before any code. Estimate is
`wc -c` of the files each slice touches, divided by four.

- S1 = ~20 KB (`NotaFiscal`, `Loja`, `NotaFiscalValidadaEvent`, `NotaFiscalRepository`, `LojaRepository`, `FiscalService`, `NotaController`, DTOs + `FiscalIngestionIntegrationTest`, `NotaFiscalValidadaEventTest`) ≈ 5k
- S2 = ~12 KB (error handling/exception mapping + `FiscalErrorContractTest`, rejection cases in `FiscalIngestionIntegrationTest`) ≈ 3k
- Total ≈ 32 KB ≈ 8k tokens, under the 150k budget — one builder, no ask.
- Build dependency: the three ORD-04 gateway files (`ConsultaNotaFiscalGateway`, `DadosNotaFiscalSefaz`, `MockSefazGateway`) live on `feat/ORD-04-sefaz-gateway`, not yet in `develop`; materialize them into this worktree before building.

<Appended by each builder as it finishes, three lines each:>
