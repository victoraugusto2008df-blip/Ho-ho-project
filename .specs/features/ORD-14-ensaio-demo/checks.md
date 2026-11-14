# ORD-14 - Ensaio ponta a ponta da demonstração checks

Build: `cd backend && ./mvnw -B -q -DskipTests compile test-compile`; `cd frontend && npm run build`
Run back: `cd backend && ./mvnw -B test -DargLine=-Dnet.bytebuddy.experimental=true -Dsurefire.reportFormat=plain -Dsurefire.useFile=false -Dtest='ShoppingDashboardIntegrationTest,RoteiroDemoE2ETest'`
Run front: `cd frontend && npx vitest run --reporter=verbose`
Plan: `.specs/features/ORD-14-ensaio-demo/plan.md`

18 checks in 3 slices · 2 one-way doors · 0 open, of which 0 block

## Checks

### S1 - dashboard do shopping

**C1** - `faturamentoTotal` é a soma de `valor_total` das notas `APROVADA`: uma nota `REJEITADA` de R$ 500,00 não muda o total e notas aprovadas de R$ 65,00 e R$ 85,00 somam 150,00 ao total anterior (AC 1)
Proof: run back | faturamentoSumsOnlyApprovedReceipts -- Time elapsed

**C2** - Sem nenhuma nota, voucher ou campanha, a resposta traz `faturamentoTotal` `0.00` (2 casas), `vouchersLiberados` 0, `campanhasAtivas` 0 e `faturamentoPorCategoria` vazio (AC 1, AC 2, AC 3)
Proof: run back | emptyDatabaseYieldsZerosAndNoCategories -- Time elapsed

**C3** - `vouchersLiberados` é o número de linhas de `vouchers_estacionamento` e `campanhasAtivas` o de `campanhas`: um voucher e uma campanha a mais somam 1 a cada um (AC 2)
Proof: run back | countsEveryVoucherAndEveryCampaign -- Time elapsed

**C4** - `faturamentoPorCategoria` traz uma linha por categoria com nota `APROVADA`, com o nome e a soma, da maior para a menor; a soma das linhas é igual a `faturamentoTotal` e "Farmácia & Beleza", sem nota aprovada, fica fora (AC 3)
Proof: run back | faturamentoPorCategoriaIsSortedAndAddsUpToTheTotal -- Time elapsed

**C5** - `GET /api/v1/analytics/shopping/dashboard` responde `200` para ADMIN_SHOPPING, `403` para CONSUMIDOR e LOJISTA e `401` sem token (AC 4)
Proof: run back | onlyAdminShoppingMaySeeTheDashboard -- Time elapsed

### S2 - Tela 3

**C6** - A Tela 3 em `/shopping` é a de `.specs/features/ORD-14-ensaio-demo/captures/figura4-portal-shopping.png`, menos o que `Differences from the source` lista (AC 5)
Proof: browser - entrar como Admin Shopping com o roteiro executado, salvar `captures/figura4-portal-shopping.running.png`

**C7** - Com sessão de Admin Shopping, `/shopping` monta a Tela 3 dentro do shell, sem o texto "ORD-12", e chama `/api/v1/analytics/shopping/dashboard` com `Authorization: Bearer <token da sessão>` (AC 5)
Proof: run front | ✓ SHOP-07 a rota do shopping monta a Tela 3 e chama o backend com o Bearer

**C8** - Os indicadores mostram "Faturamento identificado" com `faturamentoTotal` em reais (3150.4 → "R$ 3.150,40"; 0 → "R$ 0,00") e a legenda "soma das NFC-e validadas", "Vouchers de estacionamento" com `vouchersLiberados` e "Campanhas ativas" com `campanhasAtivas` (AC 6)
Proof: run front | ✓ SHOP-08 indicadores mostram faturamento vouchers e campanhas

**C9** - O card "Faturamento consolidado por segmento", com a legenda "Valor das NFC-e cadastradas no programa", mostra na ordem recebida o nome, o valor em reais e uma barra de largura proporcional ao maior valor para cada categoria (AC 7)
Proof: run front | ✓ SHOP-09 faturamento por segmento lista as categorias com barra proporcional

**C10** - Com `faturamentoPorCategoria` vazio, o card mostra "Nenhuma nota cadastrada ainda." e nenhuma barra (AC 8)
Proof: run front | ✓ SHOP-10 sem categorias mostra o estado vazio

**C11** - Enquanto o dashboard carrega, os 3 indicadores e o card mostram o estado "Carregando…" (AC 9)
Proof: run front | ✓ SHOP-11 indicadores e card mostram carregando

**C12** - Com o dashboard em falha, a Tela 3 mostra o alerta "Não foi possível carregar os dados do shopping." e "Tentar novamente", que refaz a chamada e mostra os dados quando ela responde (AC 10)
Proof: run front | ✓ SHOP-12 erro do dashboard mostra tentar novamente e recupera

### S3 - o roteiro

**C13** - Passo 1, banco recém-migrado: a chave de 96h responde `422`, `code` `NOTA_EXPIRADA_72H`, `message` "Nota emitida há mais de 72 horas.", e nenhuma nota é gravada (AC 11)
Proof: run back | roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed

**C14** - Passo 2: as chaves de R$ 65,00 e R$ 85,00 respondem `201` e o benefício traz `valorAcumulado` 150.00, `percentual` 100, `valorFaltante` 0.00, `voucherLiberado` true e `voucher.codigoQr` começando por `HOHO-PARK-` (AC 12)
Proof: run back | roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed

**C15** - Passo 3: o `ticketMedio` do lojista passa a (soma anterior + 65,00) / (quantidade anterior + 1), com 2 casas, e a campanha de 15% responde `201` com `publicoAtingido` 2 (AC 13)
Proof: run back | roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed

**C16** - Passo 4: o dashboard do shopping traz `faturamentoTotal` igual ao do banco recém-migrado + 150,00, `vouchersLiberados` 1 e `campanhasAtivas` 1 (AC 14)
Proof: run back | roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed

**C17** - O roteiro passa 2 vezes seguidas, cada uma sobre um banco recriado pelas migrations, com login real dos 3 usuários de demonstração e sem tocar no banco entre os passos; com o relógio da aplicação fixado em amanhã ao meio-dia, a nota, a meta do dia e a lista de hoje usam esse mesmo relógio (AC 15, door 2)
Proof: run back | roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo -- Time elapsed

**C18** - `.docs/qa/roteiro-demo.md` traz a subida do zero, os 4 passos com perfil, controle e chave, o resultado esperado, um plano B por passo, as limitações conhecidas e o campo do responsável (AC 16)
Proof: `f=.docs/qa/roteiro-demo.md; for t in "docker compose down -v" "docker compose up -d postgres" "spring-boot:run" "npm run dev" 35261111111111000101650010000001050000000105 35261111111111000101650010000001010000000101 35261122222222000102650010000001020000000102 "Passo 1" "Passo 2" "Passo 3" "Passo 4" "Plano B" "Limitações conhecidas" "Responsável pela condução"; do grep -qF -- "$t" "$f" || { echo "falta: $t"; exit 1; }; done; test "$(grep -c 'Plano B' "$f")" -ge 4`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /api/v1/analytics/shopping/dashboard` statuses (3) | 200 C5 · 401 C5 · 403 C5 | - |
| door 1: campos do dashboard (4) | `faturamentoTotal` C1 · `vouchersLiberados` C3 · `campanhasAtivas` C3 · `faturamentoPorCategoria` C4 | - |
| door 2: relógio único (3 serviços) | `MockSefazGateway` C17 · `FiscalService` C17 · `EstacionamentoService` C17 | - |
| AC 1, faturamento (3 exemplos) | sem notas C2 · rejeitada C1 · +150,00 C1 | - |
| AC 2, contagens (2 exemplos) | recém-migrado 0 e 0 C17 · +1 e +1 C3 | - |
| AC 3, categorias (2 exemplos) | soma igual ao total C4 · categoria sem nota ausente C4 | - |
| passos do roteiro (4) | passo 1 C13 · passo 2 C14 · passo 3 C15 · passo 4 C16 | - |
| usuários de demonstração no roteiro (3) | consumidor C17 · lojista C17 · admin C17 | - |
| source controls: Tela 3 (1) | "Tentar novamente" C12 | - |
| estados da Tela 3 (4) | dados C8 · vazio C10 · carregando C11 · erro C12 | - |
| startup config: relógio (2 montagens) | aplicação (`ClockConfig`) C17 · teste E2E (relógio fixo) C17 | - |

## Swept

- validation: n/a - a rota nova não recebe entrada
- failure modes: C12 (falha do dashboard na tela)
- idempotency: n/a - só leitura
- authorization: C5, C7
- concurrency: n/a - só leitura; o roteiro é sequencial
- data lifecycle: C17 - o banco é recriado do zero a cada rodada; C2 - banco vazio
- dependency failure: C12
- state transitions: n/a - nenhuma entidade muda de estado
- observability: n/a - a issue não pede log

## Handoff

- **Settled mid-build:** none
- **Dispatched:** none
- **Boundary:** none
- **Abandoned:** none
- **Walked:** none
