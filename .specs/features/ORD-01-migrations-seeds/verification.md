# ORD-01-migrations-seeds verification

**Verdict**: PASS
**Profile**: light
**Diff range**: develop..HEAD (20d261b..ae11493; Round 2 fix diff e3cfa1a..ae11493)
**Round**: 2 - full
**Verifier**: independent sub-agent (author != verifier)

## Binding sources

Verified at `ae11493`: Not required under `Profile: light` (`plan.md` `Surface` is `None - database schema and initial seed only, no HTTP surface consumed outside`).

Cross-check note against `.docs/architecture/architecture-and-domain.md` (Section 2 DER, lines 23-103): all 7 tables, column types, foreign keys, and unique/check constraints in `backend/src/main/resources/db/migration/V1__create_domain_tables.sql` align with the DER (`usuarios.criado_em` at `V1__create_domain_tables.sql:36` is an extra audit timestamp column not drawn in the DER diagram).

## Checks

Verified at `ae11493`:

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | Application bootstrap executes Flyway and creates all 7 domain tables (ORD-01, AC 1) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#allTablesCreatedSuccessfully`, exit 0, 0.028s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:47-54,65-72` - `assertThat(tables).contains("categorias", "lojas", "clientes", "usuarios", "notas_fiscais", "vouchers_estacionamento", "campanhas")` and `assertThat(foreignKeys).containsExactlyInAnyOrder("lojas->categorias", "usuarios->clientes", "usuarios->lojas", "notas_fiscais->clientes", "notas_fiscais->lojas", "vouchers_estacionamento->clientes", "campanhas->lojas")` | PASS |
| C2 | Insertion of duplicate 44-character chave_acesso is rejected by unique constraint (ORD-01, AC 2) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#duplicateChaveAcessoIsRejected`, exit 0, 0.015s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:110-121` - `assertThatThrownBy(() -> jdbcTemplate.update(..., SEEDED_CHAVE_ACESSO, ...)).isInstanceOf(DataIntegrityViolationException.class)` | PASS |
| C3 | Insertion of second voucher for same cliente_id and data_referencia is rejected by composite unique constraint (ORD-01, AC 3) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#duplicateVoucherPerDayIsRejected`, exit 0, 0.010s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:142-152` - `assertThatThrownBy(() -> jdbcTemplate.update(..., SEEDED_CLIENTE_ID, Date.valueOf(dataReferencia), new BigDecimal("250.00"), codigoQr2, "LIBERADO")).isInstanceOf(DataIntegrityViolationException.class)` (after initial insert at `:131-140`) | PASS |
| C4 | Insertion of campaign discount percentage outside 1 to 100 range is rejected by check constraint (ORD-01, AC 4) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#invalidDiscountPercentageIsRejected`, exit 0, 0.010s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:163-183` - `assertThatThrownBy(... 0 ...).isInstanceOf(DataIntegrityViolationException.class)` (`:163-172`) and `assertThatThrownBy(... 101 ...).isInstanceOf(DataIntegrityViolationException.class)` (`:174-183`) | PASS |
| C5 | Insertion of receipt with total value less than or equal to 0.00 is rejected by check constraint (ORD-01, AC 5) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#negativeOrZeroReceiptValueIsRejected`, exit 0, 0.008s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:188-212` - `assertThatThrownBy(... new BigDecimal("0.00") ...).isInstanceOf(DataIntegrityViolationException.class)` (`:188-199`) and `assertThatThrownBy(... new BigDecimal("-10.00") ...).isInstanceOf(DataIntegrityViolationException.class)` (`:201-212`) | PASS |
| C6 | Flyway seed migration loads exactly 4 predefined categories (ORD-01, AC 6) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#allCategoriesSeeded`, exit 0, 0.004s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:221-225` - `assertThat(categorias).containsExactlyInAnyOrder("Vestuário", "Alimentação", "Eletrônicos", "Farmácia & Beleza")` | PASS |
| C7 | Seed data contains at least 3 active stores in the Vestuário category satisfying K-Anonymity (ORD-01, AC 7) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#kAnonymityStoreConditionSatisfied`, exit 0, 0.007s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:230-241` - `assertThat(activeClothingStores).isGreaterThanOrEqualTo(3)` (querying `l.ativa = TRUE` for `c.nome = 'Vestuário'`) | PASS |
| C8 | Seed data contains 3 demo users with BCrypt password hashes representing CONSUMIDOR, LOJISTA, and ADMIN_SHOPPING (ORD-01, AC 8) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#demoUsersWithBcryptPasswordExist`, exit 0, 0.194s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:253,258,261-266,272,278` - `assertThat(users).hasSize(3)`, `assertThat(encoder.matches("demo123", senhaHash)).isTrue()`, `containsExactlyInAnyOrder("consumidor@shopping.com:CONSUMIDOR", "lojista@shopping.com:LOJISTA", "admin@shopping.com:ADMIN_SHOPPING")`, and non-null `cliente_id`/`loja_id` | PASS |
| C9 | Seed data contains 15 historical receipts populating charts across stores and categories (ORD-01, AC 9) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#historicalReceiptsAreSeeded`, exit 0, 0.630s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:307-311` - `assertThat(totalReceipts).isEqualTo(15)`, `assertThat(validKeyLengthCount).isEqualTo(15)`, `assertThat(distinctStores).isEqualTo(5)`, `assertThat(distinctCategories).isEqualTo(3)`, and `assertThat(historicalBeforeToday).isEqualTo(15)` | PASS |
| C10 | Duplicate clientes.cpf_hash, lojas.cnpj, and usuarios.email are rejected by unique constraints (ORD-01, AC 1) | `.\mvnw.cmd -B verify` (`DatabaseMigrationTests#uniqueNaturalIdentifiersAreRejected`, exit 0, 0.027s) | `backend/src/test/java/com/hoho/shoppinghub/DatabaseMigrationTests.java:77-105` - `assertThatThrownBy(... clientes cpf_hash ...).isInstanceOf(DataIntegrityViolationException.class)` (`:77-85`), `assertThatThrownBy(... lojas cnpj ...).isInstanceOf(DataIntegrityViolationException.class)` (`:87-95`), and `assertThatThrownBy(... usuarios email ...).isInstanceOf(DataIntegrityViolationException.class)` (`:97-105`) | PASS |

## Coverage

Verified at `ae11493`:

| Set (size) | Source / Authority | Member -> proof | Unproven |
| --- | --- | --- | --- |
| domain tables (7) | `checks.md:50`, `V1__create_domain_tables.sql` | `categorias` C1 · `lojas` C1 · `clientes` C1 · `usuarios` C1 · `notas_fiscais` C1 · `vouchers_estacionamento` C1 · `campanhas` C1 (`DatabaseMigrationTests.java:47-54`) | - |
| one-way constraints (8) | `checks.md:51`, `plan.md:37-42`, `V1__create_domain_tables.sql` | `unique chave_acesso` C2 (`:110-121`) · `composite unique voucher` C3 (`:142-152`) · `check desconto` C4 (`:163-183`) · `check valor` C5 (`:188-212`) · `unique cpf_hash` C10 (`:77-85`) · `unique cnpj` C10 (`:87-95`) · `unique email` C10 (`:97-105`) · `foreign keys` C1 (`:56-72`) | - |
| demo categories (4) | `checks.md:52`, `V2__seed_demo_data.sql:4-8` | `Vestuário` C6 · `Alimentação` C6 · `Eletrônicos` C6 · `Farmácia & Beleza` C6 (`DatabaseMigrationTests.java:221-225`) | - |
| demo user roles (3) | `checks.md:53`, `V2__seed_demo_data.sql:25-28` | `CONSUMIDOR` C8 · `LOJISTA` C8 · `ADMIN_SHOPPING` C8 (`DatabaseMigrationTests.java:261-266`) | - |

## Swept

Verified at `ae11493`:

| Category | `checks.md` claim | Code / config evidence | Status |
| --- | --- | --- | --- |
| validation | `C2, C3, C4, C5, C10` | Unique & check constraints present in `V1__create_domain_tables.sql:16,26,37,50,51,64,77` and tested via `DataIntegrityViolationException` in `DatabaseMigrationTests.java:76-213` | verified |
| failure modes | `C2, C3, C10` | Duplicate receipt key (`:109-122`), duplicate daily voucher (`:125-159`), and duplicate natural identifiers (`:76-106`) rejection asserted in `DatabaseMigrationTests.java` | verified |
| idempotency | `C1, C6` | `flyway.enabled: true` (`application.yml:16`) ensures `V1`/`V2` execute once per database via `flyway_schema_history`; `C1` and `C6` verify post-migration state (`DatabaseMigrationTests.java:37-73,216-226`) | verified |
| authorization | `n/a - database migrations execute during application startup using datasource credentials` | Policy approved (`n/a`) | n/a |
| concurrency | `C2, C3` | DB-level atomic unique constraints exist (`V1__create_domain_tables.sql:50,64`) and sequential enforcement is tested in `DatabaseMigrationTests.java:109-159` | verified (DB constraint present) |
| data lifecycle | `C6, C7, C8, C9` | Seeded categories (`:216-226`), active stores (`:229-242`), demo users (`:245-279`), and 15 historical receipts across 5 stores and 3 categories prior to today (`:282-312`) verified in `DatabaseMigrationTests.java` | verified |
| dependency failure | `n/a - datasource unavailability or migration checksum mismatch halts Spring Boot startup fail-fast via Flyway` | Policy approved (`n/a`) | n/a |
| state transitions | `n/a - DDL schema creation and seed insertion only` | Policy approved (`n/a`) | n/a |
| observability | `C1` | Flyway logs migration execution to stdout on boot (observed in `.\mvnw.cmd -B verify` output: `Successfully applied 2 migrations to schema "public", now at version v2 (execution time 00:00.071s)`) | verified |

## Faults injected

Not run (`Profile: light`; fault injection in step 4 applies only to `standard` and `ui` profiles).

## Gate

`Set-Location backend; .\mvnw.cmd -B verify` (retried with `BypassSandbox: true` after sandboxed run failed with `java.nio.file.AccessDeniedException: \\.\pipe\docker_engine`) — `11 passed, 0 failed, 0 errors, 0 skipped` (`com.hoho.shoppinghub.DatabaseMigrationTests`: 10/10 passed; `com.hoho.shoppinghub.ShoppingHubApplicationTests`: 1/1 passed), `BUILD SUCCESS`.

## Round 1 findings resolution

1. **Foreign keys assertion missing in C1**: Resolved at `ae11493` — `DatabaseMigrationTests.java:56-72` queries `pg_constraint` (`contype = 'f'`) and asserts all 7 foreign keys via `containsExactlyInAnyOrder`.
2. **C9 precision gap (missing store/category spread and historical date assertions)**: Resolved at `ae11493` — `DatabaseMigrationTests.java:289-311` asserts `distinctStores == 5`, `distinctCategories == 3`, and `historicalBeforeToday == 15` (`data_emissao < DATE_TRUNC('day', CURRENT_TIMESTAMP)`).
3. **Omitted plan one-way unique constraints (`clientes.cpf_hash`, `lojas.cnpj`, `usuarios.email`)**: Resolved at `ae11493` — added C10 in `checks.md:29-30,51` and `DatabaseMigrationTests.java:75-106` (`uniqueNaturalIdentifiersAreRejected`).
4. **Swept `dependency failure` cited happy-path C1**: Resolved at `ae11493` — updated `checks.md:63` to `n/a - datasource unavailability or migration checksum mismatch halts Spring Boot startup fail-fast via Flyway`.
