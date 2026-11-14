# Ingestão Fiscal (ORD-05)

## Problem

A consumer can open the app and send a NFC-e, but nothing accepts it. There is no endpoint that ingests a 44-digit access key, and the rules that make a note eligible — it was not already processed (ReN01), it was issued within 72 hours (ReN02), and its emitter is an active store in the shopping (RF03) — live nowhere in code. A duplicated or stale or foreign note would be counted toward the parking voucher, which the consumer then "redeems" on top of data that should never have been accepted, and the store-side analytics would inherit the same tainted rows.

When this ships, `POST /api/v1/notas` accepts a 44-digit key, consults the SEFAZ gateway, rejects duplicates, stale and foreign-store notes with a machine-readable error, and — for a valid note — persists it as `APROVADA` and publishes `NotaFiscalValidadaEvent` so the parking engine (ORD-06) can react.

## Flow

This reuses ORD-04's `ConsultaNotaFiscalGateway` (DIP port) and `DadosNotaFiscalSefaz`, ORD-02's JWT authentication (the principal carries `clienteId`), and ORD-01's `notas_fiscais`/`lojas` schema with its `UNIQUE(chave_acesso)` — no new table, column or external service is introduced.

1. `POST /api/v1/notas` with `{chaveAcesso}` -> `NotaController` (new, no door - placement per conventions) - requires `ROLE_CONSUMIDOR` and reads `clienteId` from `authentication.principal.clienteId`
2. `NotaController` -> `FiscalService` (new, no door) - orchestrates validation and persistence
3. `FiscalService` -> `ConsultaNotaFiscalGateway` (exists) - `consultarPorChave` returns `Optional<DadosNotaFiscalSefaz>`; empty -> `404`, malformed key -> `400`
4. `FiscalService` (new, no door) - rejects `dataEmissao` older than 72 hours -> `422`
5. `FiscalService` -> `LojaRepository` (new, no door) - resolves `Loja` by `cnpjEmitente`; missing or `ativa=false` -> `422`
6. `FiscalService` -> `NotaFiscalRepository` (new, no door) - persists `NotaFiscal` with `status=APROVADA`; duplicate `chave_acesso` -> `409`
7. `FiscalService` -> `ApplicationEventPublisher` (exists) - publishes `NotaFiscalValidadaEvent` (door 2)
8. out: `201` with the persisted representation, and the `beneficios` module (ORD-06) reads the event on the next request

## Impact

| Front | What changes |
| --- | --- |
| domain | new terms: `NotaFiscal`, `Loja`, `NotaFiscalValidadaEvent`, `FiscalService`, `NotaController` - all live in the `fiscal` module |
| domain | existing term: `notas_fiscais.status` - ORD-05 is the first writer and persists `APROVADA`; the `beneficios` module (ORD-06) sums only `APROVADA` notes |
| stored data | nothing to migrate - `notas_fiscais` and `lojas` already exist from ORD-01; this feature only writes new rows |

## Relations

None - no stored-data shape change. `notas_fiscais` (with `UNIQUE(chave_acesso)`, the ReN01 mechanism) and `lojas` were created in ORD-01; this feature adds only the JPA entities and repositories that read and write them.

## Surface

Only routes this adds or whose signature changes.

| Route | In | Out | Status |
| --- | --- | --- | --- |
| `POST /api/v1/notas` | `chaveAcesso` | `chaveAcesso` · `valorTotal` · `dataEmissao` · `status` · `clienteId` · `lojaId` | `201`, `400`, `404`, `409`, `422` |

## Landing

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| Business error contract | every rejection returns JSON `{ "code": <stable-code>, "message": <pt-BR text> }`: `NOTA_DUPLICADA` -> `409`, `NOTA_EXPIRADA_72H` -> `422`, `LOJA_NAO_CREDENCIADA` -> `422`, `CHAVE_NAO_ENCONTRADA` -> `404`, `CHAVE_INVALIDA` -> `400` | bare 4xx with no `code` - the front (ORD-07) could not distinguish the two `422` causes or map a duplicate, so it would parse free text |
| `NotaFiscalValidadaEvent` payload | record `NotaFiscalValidadaEvent(notaFiscalId, chaveAcesso, clienteId, lojaId, valorTotal, dataEmissao)` published synchronously after persist | publishing the `NotaFiscal` entity - couples the parking listener (ORD-06) to a JPA entity and its lifecycle |

- Nothing else in this change is hard to reverse

## Criteria

### S1: Ingestão, persistência e evento (P1)

A valid note is persisted and the domain event is published; a duplicate is refused.

**Acceptance Criteria**

1. WHEN a `POST /api/v1/notas` request carries a 44-digit `chaveAcesso` that resolves to a note whose emitente is an active loja and whose emission is within 72 hours THEN the system SHALL respond `201` with the persisted representation including `chaveAcesso`, `valorTotal`, `dataEmissao`, `status=APROVADA`, `clienteId` and `lojaId`
2. WHEN a valid note is persisted THEN the system SHALL publish a `NotaFiscalValidadaEvent` carrying `chaveAcesso`, `clienteId`, `lojaId`, `valorTotal` and `dataEmissao`
3. IF a `POST /api/v1/notas` request carries a `chaveAcesso` that is already persisted THEN the system SHALL respond `409` with `{ "code": "NOTA_DUPLICADA" }`

**Independent test:** `POST /api/v1/notas` with a valid deterministic key as `CONSUMIDOR` -> `201`, note persisted with `APROVADA`, event captured; posting the same key again -> `409`.

### S2: Rejeições de negócio e contrato de erro (P1)

Stale, foreign-store, unknown and malformed keys are rejected with a machine-readable error.

**Acceptance Criteria**

4. IF the resolved note's `dataEmissao` is more than 72 hours before now THEN the system SHALL respond `422` with `{ "code": "NOTA_EXPIRADA_72H" }` and SHALL NOT persist or publish
5. IF the resolved note's `cnpjEmitente` matches no active loja THEN the system SHALL respond `422` with `{ "code": "LOJA_NAO_CREDENCIADA" }` and SHALL NOT persist or publish
6. IF the `chaveAcesso` does not resolve to any note in the gateway THEN the system SHALL respond `404` with `{ "code": "CHAVE_NAO_ENCONTRADA" }`
7. IF the `chaveAcesso` is not exactly 44 numeric digits THEN the system SHALL respond `400` with `{ "code": "CHAVE_INVALIDA" }`
8. The system SHALL return every rejection as a JSON body with a stable `code` and a human-readable `message` in Portuguese

**Independent test:** the `>72h` key -> `422` `NOTA_EXPIRADA_72H`; the foreign-CNPJ key -> `422` `LOJA_NAO_CREDENCIADA`; an unknown 44-digit key -> `404`; a malformed key -> `400`.

## Out of scope

| Excluded | Why |
| --- | --- |
| `itens_nota` per-item granularity | ADR-03 (YAGNI) - the MVP screens operate on the note total only |
| Real SEFAZ integration | ADR-04 - the demo runs against `MockSefazGateway` behind the DIP port |
| Retry / outbox pattern for the event | MVP publishes synchronously in-process; delivery guarantees are deferred to v2 |
| Rate limiting on ingestion | RNF06 - deferred to v2 (Redis) |

## Assumptions

| Assumption | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| HTTP status for each rejection | `409` duplicate · `422` business rule (`>72h`, loja inválida) · `404` chave não encontrada · `400` chave mal formada | `409` is ReN01's canonical answer; `422` keeps the two business causes distinguishable by status while the `code` disambiguates them | n |
| Error body shape | `{ "code", "message" }` with stable codes, `message` in pt-BR | ORD-07 renders it directly; a stable `code` lets the front switch without string matching | n |
| Success status | `201 Created` | a new persisted resource is created | n |
| Rejected notes are not persisted | only valid notes persist, always as `APROVADA` | the schema's `REJEITADA` state stays unused in this slice; rejected keys return an error instead of a row | n |
| Event publication timing | synchronous `ApplicationEventPublisher` in the request thread | the MVP listener (ORD-06) reacts inline; no queue in scope | n |

**Open questions:** none - all resolved or logged above.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| API `POST /api/v1/notas` | response shape (success representation) | AC 1 |
| API `POST /api/v1/notas` | error shape and codes | AC 3, AC 4, AC 5, AC 6, AC 7, AC 8 |
| API `POST /api/v1/notas` | who may call it | existing - ORD-02 RBAC (`@PreAuthorize("hasRole('CONSUMIDOR')")`) |
| all new `/api/v1/notas` | versioning, rate limits | n/a - single MVP version; rate limiting is out of scope (RNF06 v2) |

## Sources

- GitHub Issue [#5](https://github.com/victoraugusto2008df-blip/Ho-ho-project/issues/5): `[ORD-05] BACK — Ingestão Fiscal (POST /api/v1/notas) + Evento de Domínio`
- ORD-04 gateway contract: `ConsultaNotaFiscalGateway`, `DadosNotaFiscalSefaz`, `MockSefazGateway` (branch `feat/ORD-04-sefaz-gateway`)
- Architecture & ADRs: `.docs/architecture/architecture-and-domain.md` (ADR-04, module `fiscal`)
- Requirements: `.docs/markdown/requirements.md` (ReN01, ReN02, RF03)
- Planning Kanban: `.docs/planning/mvp-sabado-kanban.md` (Card ORD-05)
