# Domain Migrations and Demo Seeds - Checks

Profile: light
Plan: .specs/features/ORD-01-migrations-seeds/plan.md

## Intent

9 checks in 2 slices · 4 one-way doors · 0 open

## Checks

### S1 - Domain Schema & Constraints

**C1** - Application bootstrap executes Flyway and creates all 7 domain tables (ORD-01, AC 1)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#allTablesCreatedSuccessfully`

**C2** - Insertion of duplicate 44-character chave_acesso is rejected by unique constraint (ORD-01, AC 2)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#duplicateChaveAcessoIsRejected`

**C3** - Insertion of second voucher for same cliente_id and data_referencia is rejected by composite unique constraint (ORD-01, AC 3)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#duplicateVoucherPerDayIsRejected`

**C4** - Insertion of campaign discount percentage outside 1 to 100 range is rejected by check constraint (ORD-01, AC 4)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#invalidDiscountPercentageIsRejected`

**C5** - Insertion of receipt with total value less than or equal to 0.00 is rejected by check constraint (ORD-01, AC 5)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#negativeOrZeroReceiptValueIsRejected`

### S2 - Demo Seed Data Insertion

**C6** - Flyway seed migration loads exactly 4 predefined categories (ORD-01, AC 6)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#allCategoriesSeeded`

**C7** - Seed data contains at least 3 active stores in the Vestuário category satisfying K-Anonymity (ORD-01, AC 7)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#kAnonymityStoreConditionSatisfied`

**C8** - Seed data contains 3 demo users with BCrypt password hashes representing CONSUMIDOR, LOJISTA, and ADMIN_SHOPPING (ORD-01, AC 8)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#demoUsersWithBcryptPasswordExist`

**C9** - Seed data contains 15 historical receipts populating charts across stores and categories (ORD-01, AC 9)
Proof: `cd backend && ./mvnw test -Dtest=DatabaseMigrationTests#historicalReceiptsAreSeeded`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| domain tables (7) | `categorias` C1 · `lojas` C1 · `clientes` C1 · `usuarios` C1 · `notas_fiscais` C1 · `vouchers_estacionamento` C1 · `campanhas` C1 | - |
| one-way constraints (5) | unique chave_acesso C2 · composite unique voucher C3 · check desconto C4 · check valor C5 · foreign keys C1 | - |
| demo categories (4) | `Vestuário` C6 · `Alimentação` C6 · `Eletrônicos` C6 · `Farmácia & Beleza` C6 | - |
| demo user roles (3) | `CONSUMIDOR` C8 · `LOJISTA` C8 · `ADMIN_SHOPPING` C8 | - |

## Swept

- validation: C2, C3, C4, C5
- failure modes: C2, C3
- idempotency: C1, C6
- authorization: n/a - database migrations execute during application startup using datasource credentials
- concurrency: C2, C3
- data lifecycle: C6, C7, C8, C9
- dependency failure: C1
- state transitions: n/a - DDL schema creation and seed insertion only
- observability: C1

## Handoff

- S1 = ~12k tokens, S2 = ~15k tokens; total estimate ~27k tokens, well under the 150k budget - one builder
- Build status: C1-C9 implemented in `DatabaseMigrationTests` and passing (`./mvnw -B verify`: 10/10 tests pass, 0 failures, 0 errors, 0 skipped)

