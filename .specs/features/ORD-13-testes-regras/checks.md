# ORD-13 - Testes unitários das regras de negócio (ReN01-ReN05) checks

Build: `cd backend && ./mvnw -B -q -DskipTests compile test-compile`
Run regras: `cd backend && ./mvnw -B test -DargLine=-Dnet.bytebuddy.experimental=true -Dsurefire.reportFormat=plain -Dsurefire.useFile=false -Dtest='FiscalServiceRegrasTest*,EstacionamentoServiceRegrasTest*,KAnonymityRegraTest*'`

## Intent

As cinco regras de negócio do MVP (ReN01 a ReN05) só são exercitadas por testes de integração que
sobem o Spring e um Postgres, e a regra das 72 horas lê a hora real (`Instant.now()`), então não há
como provar o limite exato dela. Quem paga é a equipe diante da banca: não há uma suíte rápida que
mostre, regra por regra, um caso aceito e um caso rejeitado.

Quando isto entra, cada regra tem ao menos um teste unitário (JUnit 5 + Mockito) de caso feliz e um
de rejeição, com o relógio controlado pelo teste, e a suíte completa passa com `./mvnw test`.

14 checks in 6 slices · 0 one-way doors · 0 open, of which 0 block

## Checks

### S1 - ReN01: chave de acesso duplicada

**C1** - Uma chave que o banco recusa por duplicidade é rejeitada com `NOTA_DUPLICADA`, cujo status é `409 CONFLICT`, e nenhum evento é publicado (issue AC 1)
Proof: run regras | duplicateKeyIsRejectedWith409AndPublishesNothing -- Time elapsed

**C2** - Uma chave inédita é gravada com chave, cliente, loja, valor e emissão vindos da SEFAZ e publica exatamente um `NotaFiscalValidadaEvent` com os mesmos valores (issue DoD: caso feliz)
Proof: run regras | uniqueKeyIsPersistedAndPublishesOneEvent -- Time elapsed

### S2 - ReN02: nota emitida há mais de 72h

**C3** - Uma nota emitida há 72h e 1 segundo, ou há 96h, é rejeitada com `NOTA_EXPIRADA_72H` (`422`), sem gravar e sem publicar evento (issue AC 2)
Proof: run regras | noteOlderThan72hIsRejectedAndNotSaved -- Time elapsed

**C4** - Uma nota emitida há exatamente 72h, ou há 71h59min, é aceita e gravada (issue DoD: caso feliz)
Proof: run regras | noteWithin72hIsAccepted -- Time elapsed

### S3 - ReN03: meta de R$ 150,00 no mesmo dia

**C5** - Com a soma do dia em R$ 150,00 ou R$ 160,00, o motor grava um voucher `LIBERADO` do cliente, com `dataReferencia` igual ao dia do relógio e `valorAcumulado` igual à soma (issue AC 3)
Proof: run regras | reachingTheGoalEmitsVoucherWithTheDailySum -- Time elapsed

**C6** - Com a soma do dia em R$ 149,99 ou R$ 0,00, nenhum voucher é gravado (issue DoD: rejeição)
Proof: run regras | belowTheGoalEmitsNoVoucher -- Time elapsed

**C7** - A soma é pedida só para o cliente do evento e para a janela que vai da meia-noite do dia do relógio à meia-noite seguinte, no fuso do relógio; só notas `APROVADA` dentro da janela entram (issue AC 3)
Proof: run regras | sumIsRequestedForTheClientAndTheClockDayOnly -- Time elapsed
Proof: `cd backend && ./mvnw -B -q test -Dtest=EstacionamentoIntegrationTest#onlyApprovedReceiptsFromTodayAreSummed`

**C14** - Uma nota `APROVADA` do mesmo cliente emitida amanhã (R$ 300,00) e uma nota `APROVADA` de hoje de outro cliente (R$ 400,00) não entram na soma: com uma nota de hoje de R$ 50,00, `valorAcumulado` é 50,00 e nenhum voucher é emitido (achado do Verificador sobre C7)
Proof: `cd backend && ./mvnw -B -q test -Dtest=EstacionamentoIntegrationTest#receiptsOfTomorrowOrOfAnotherClientAreNotSummed`

### S4 - ReN04: máximo de 1 voucher por CPF por dia

**C8** - Com um voucher já emitido para o cliente no dia, uma nova nota que leva a soma a R$ 230,00 não grava outro voucher (issue AC 4)
Proof: run regras | secondAttemptSameDayEmitsNoVoucher -- Time elapsed

**C9** - Sem voucher no dia, atingir a meta grava exatamente um voucher; se o banco recusar a gravação por duplicidade (duas notas ao mesmo tempo), o motor termina sem erro (issue DoD: caso feliz)
Proof: run regras | firstAttemptEmitsExactlyOneVoucherAndToleratesARace -- Time elapsed

### S5 - ReN05: k < 3 lojas ativas oculta a média

**C10** - Com 0, 1 ou 2 lojas ativas na categoria, `benchmarkingDisponivel` é `false`, `mediaCategoria` é nula e os valores da categoria nem são consultados (issue AC 5)
Proof: run regras | belowThreeActiveStoresHidesTheCategoryAverage -- Time elapsed

**C11** - Com 3 ou 4 lojas ativas, `benchmarkingDisponivel` é `true` e `mediaCategoria` é a média dos valores da categoria com 2 casas (100,00 e 200,01 → 150,01) (issue DoD: caso feliz)
Proof: run regras | fromThreeActiveStoresShowsTheCategoryAverage -- Time elapsed

### S6 - a suíte

**C12** - A suíte completa do backend passa (issue AC 6)
Proof: `cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true`

**C13** - Nenhum teste do backend está desativado com `@Disabled` (issue DoD)
Proof: `! grep -rn "@Disabled" backend/src/test`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| regras × caso feliz e rejeição (10) | ReN01 rejeição C1 · ReN01 feliz C2 · ReN02 rejeição C3 · ReN02 feliz C4 · ReN03 feliz C5 · ReN03 rejeição C6 · ReN04 rejeição C8 · ReN04 feliz C9 · ReN05 rejeição C10 · ReN05 feliz C11 | - |
| ReN02, limite de 72h (4 exemplos) | 96h C3 · 72h + 1s C3 · 72h exatas C4 · 71h59 C4 | - |
| ReN03, limite de R$ 150,00 (4 exemplos) | 0,00 C6 · 149,99 C6 · 150,00 C5 · 160,00 C5 | - |
| ReN03, filtros da soma (4 membros) | status `APROVADA` C7 · início do dia C7 · fim do dia C14 · cliente C14 | - |
| ReN05, limite k = 3 (5 exemplos) | k=0 C10 · k=1 C10 · k=2 C10 · k=3 C11 · k=4 C11 | - |
| critérios de aceite da issue (6) | AC1 C1 · AC2 C3 · AC3 C5, C7 · AC4 C8 · AC5 C10 · AC6 C12 | - |

## Swept

- validation: C3, C4, C6, C10 - os limites de cada regra
- failure modes: C1 - a rejeição não deixa evento publicado; C3 - a rejeição não grava
- idempotency: C8, C9
- authorization: existing - `SecurityIntegrationTest` e `EstacionamentoIntegrationTest#getHojeEnforcesConsumidorAuthorization`
- concurrency: C9 - a recusa do banco em uma corrida é tolerada; a constraint em si é `EstacionamentoIntegrationTest#duplicateVoucherSameDayIsRejectedByDatabaseConstraint`
- data lifecycle: n/a - só testes; nenhum dado novo
- dependency failure: n/a - a SEFAZ é o `MockSefazGateway` em memória
- state transitions: n/a - nenhuma regra desta issue muda um estado existente
- observability: n/a - a issue não pede log

## Out of scope

| Excluded | Why |
| --- | --- |
| Mudar o `pom.xml` para o Byte Buddy aceitar o JDK 26 | o projeto e o CI usam o JDK 21, onde `./mvnw test` passa sem flag; nesta máquina só há JDK 26, então as provas levam `-DargLine=-Dnet.bytebuddy.experimental=true` |
| Revisão e aprovação em PR, merge e apresentação à banca | são da equipe |
| Regras fora de ReN01-ReN05 (RF03, autorização) | fora da issue; já têm testes de integração |

## Handoff

- **Settled mid-build:** none
- **Dispatched:** Verifier at `c92ad7c` - returned
- **Boundary:** C1-C13 closed at `04c3970`
- **Abandoned:** none
