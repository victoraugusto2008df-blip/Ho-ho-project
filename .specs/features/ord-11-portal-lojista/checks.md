# ORD-11 - Tela 2: Portal do Lojista - checks

Build: `cd frontend && npm run build`
Run unit: `cd frontend && NO_COLOR=1 npx vitest run --reporter=verbose`
Plan: `.specs/features/ord-11-portal-lojista/plan.md`

30 checks em 4 slices + mock, design system e montagem · 2 one-way doors · 1 open, que blocks go-live (contrato do `POST /api/v1/campanhas` com o Lucas)

## Checks

### S1 - Benchmarking com a trava ReN05

**C1** - A Tela 2 com o mock, em janela de 1317px, bate com `.specs/features/ord-11-portal-lojista/captures/figura3-portal-lojista.png`, menos o que `## Differences from the source` lista (AC 1)
Proof: browser - abrir `/?tela=lojista` com o mock, esperar o dashboard, sem disparar a campanha, em janela de 1317 de largura, salvar a página inteira em `.specs/features/ord-11-portal-lojista/captures/figura3-portal-lojista.running.png`

**C2** - Renderizar `App` com a URL `/` mostra a Tela 1 ("Cadastrar nota fiscal (NFC-e)") e não "Portal do Lojista"; com `/?tela=lojista` mostra "Portal do Lojista" e não a Tela 1; com `/?tela=shopping` mostra a Tela 1; table-driven nos 3 (AC 2)
Proof: run unit | ✓ C2 App escolhe a Tela 2 só com tela=lojista

**C3** - Com o dashboard simulado, o card "Ticket médio" mostra o `ticketMedio` em reais pt-BR; table-driven: `142.3` → "R$ 142,30"; `1234.5` → "R$ 1.234,50"; `0` → "R$ 0,00" (AC 3)
Proof: run unit | ✓ C3 card de ticket médio mostra o valor em reais

**C4** - `gapDoTicket` dá -32,2 para 142,30 vs 210,00, +8,3 para 227,52 vs 210,00, 0,0 para 210,00 vs 210,00 e `null` com média 0; na tela, com `benchmarkingDisponivel: true` e `mediaCategoria: 210`, "Sua loja" com "R$ 142,30", "Média da categoria" com "R$ 210,00" e "Gap do ticket médio" com "-32,2%" aparecem; com 227,52 o gap aparece como "+8,3%" e com 210,00 como "0,0%" (AC 4)
Proof: run unit | ✓ C4 benchmarking liberado mostra as duas barras e o gap com sinal

**C31** - O arredondamento do gap não depende do sinal: `gapDoTicket(183.5, 200)` dá -8,3 e `gapDoTicket(216.5, 200)` dá +8,3; na tela, 183,50 vs 200,00 mostra "-8,3%" (AC 4 - achado do Verifier em `789fed0`)
Proof: run unit | ✓ C31 gap arredonda a magnitude igual nos dois sinais

**C5** - Com `benchmarkingDisponivel: false`, o card "Benchmarking setorial" mostra "Benchmarking Temporariamente Indisponível", "Para proteger o sigilo concorrencial, as médias setoriais só são exibidas quando houver 3 ou mais lojistas ativos no seu segmento (ReN05).", o ícone `Lock` do `lucide-react` e um contêiner com `border-dashed` no tom `--color-warning`; "Sua loja" com o ticket continua; "Média da categoria" e "Gap do ticket médio" não aparecem (AC 5)
Proof: run unit | ✓ C5 benchmarking bloqueado mostra cadeado e explicação da ReN05

**C6** - Nenhum valor da média vaza no bloqueio; table-driven: `{ benchmarkingDisponivel: false, mediaCategoria: 210 }` → o texto "210" não aparece em lugar nenhum de `document.body`; `{ benchmarkingDisponivel: true, mediaCategoria: null }` → o bloco bloqueado de C5 aparece (AC 6)
Proof: run unit | ✓ C6 média da categoria nunca aparece com o benchmarking bloqueado

**C7** - Com o benchmarking liberado aparece "Privacidade (K-Anonymity, ReN05): segmento com o mínimo exigido de 3 lojistas ativos. Os valores individuais de concorrentes nunca são exibidos, apenas a média do grupo." (AC 7)
Proof: run unit | ✓ C7 aviso de K-Anonymity aparece com o benchmarking liberado

### S2 - Horários de pico e compras cruzadas

**C8** - `preencherHoras([{hora:10,total:5},{hora:13,total:2}])` dá 10h=5, 11h=0, 12h=0, 13h=2, com rótulos "10h"…"13h"; `[]` dá `[]`; uma entrada fora de ordem (`13` antes de `10`) dá o mesmo resultado; na tela, com horas 10 a 21, o gráfico Recharts desenha 12 barras (AC 8)
Proof: run unit | ✓ C8 horas do pico são preenchidas de ponta a ponta com zero
Proof: run unit | ✓ C8 gráfico de pico desenha uma barra por hora

**C9** - `resumoDoPico` escolhe a hora de maior `total`, empate na mais cedo, e o texto sai "Pico às 19h–20h com 175 vendas (13,6% do total de 1.284)." para 175 de 1.284 às 19h; pico às 23h sai "23h–0h"; com 9h e 15h empatadas o pico é 9h; na tela, a barra de pico tem a cor escura do pico, as outras a cor `CHART_PALETTE.primary`, e o valor do pico aparece acima dela (AC 9)
Proof: run unit | ✓ C9 resumo do pico usa a maior hora com desempate pela mais cedo
Proof: run unit | ✓ C9 barra de pico destacada e legenda do pico na tela

**C10** - Clicar em "Ver dados em tabela" mostra uma tabela com os cabeçalhos "Horário" e "Vendas" e uma linha por barra (12 com as horas 10 a 21, cada uma com "<h>h" e o total) (AC 10)
Proof: run unit | ✓ C10 ver dados em tabela abre a tabela de horários e vendas

**C11** - Com 8 categorias no `crossShopping`, "Afinidade de compras cruzadas" lista as 6 de maior `total`, por `total` decrescente e empate por nome, cada uma com "<n> compras"; `total` 1 sai "1 compra"; a barra da maior tem 100% da largura e a de metade do total 50%; o subtítulo "Compras dos seus clientes em outras categorias" e o rodapé "Mostramos apenas categorias, nunca lojas específicas ou clientes individuais." aparecem (AC 11)
Proof: run unit | ✓ C11 afinidade lista as 6 maiores categorias com contagem de compras

**C12** - Com `horariosPico: []` aparece "Ainda não há vendas identificadas para calcular os horários de pico." e nenhum gráfico de pico; com `crossShopping: []` aparece "Ainda não há compras cruzadas dos seus clientes em outras categorias." (AC 12)
Proof: run unit | ✓ C12 pico e afinidade vazios mostram o estado vazio

### S3 - Campanha em 1 clique

**C13** - O card "Nova campanha em 1 clique" mostra "Cupom enviado pelo app do shopping a um segmento pré-qualificado.", o `Badge` "Sem acesso a CPFs ou contatos", "Clientes da sua loja inativos há 60 dias", "15%" e o botão "Disparar Cupom 15% OFF" (AC 13)
Proof: run unit | ✓ C13 card de campanha mostra segmento desconto e botão fixos

**C14** - Clicar em "Disparar Cupom 15% OFF" chama `dispararCampanha` uma vez com `{ titulo: "Cupom 15% OFF", descontoPercentual: 15, criterioAlvo: "INATIVOS_60_DIAS" }`; table-driven no `publicoAtingido` da resposta: 312 → "Campanha disparada! Cupom de 15% OFF enviado a 312 clientes."; 1 → "Campanha disparada! Cupom de 15% OFF enviado a 1 cliente."; 0 → "Campanha registrada, mas nenhum cliente está no segmento agora." (AC 14)
Proof: run unit | ✓ C14 disparar campanha envia o corpo fixo e mostra o público atingido

**C15** - Com `dispararCampanha` pendente, o botão fica `disabled` com "Disparando…", e um segundo clique não chama `dispararCampanha` de novo; resolvido, o botão volta a "Disparar Cupom 15% OFF" habilitado (AC 15)
Proof: run unit | ✓ C15 botão de campanha fica desabilitado durante o disparo

**C16** - Com `dispararCampanha` rejeitado aparece "Não foi possível disparar a campanha. Tente novamente." e o botão volta habilitado; clicar de novo chama `dispararCampanha` outra vez (AC 16)
Proof: run unit | ✓ C16 falha no disparo mostra o erro e reabilita o botão

**C17** - A implementação real chama o `fetcher` injetado com `GET /analytics/lojista/dashboard` e devolve o corpo do ORD-08 como `DashboardLojista`, e com `POST /campanhas`, `Content-Type: application/json` e corpo `{"titulo":"Cupom 15% OFF","descontoPercentual":15,"criterioAlvo":"INATIVOS_60_DIAS"}`, devolvendo o `publicoAtingido` da resposta da door 1; com o `fetcher` rejeitando `{ status: 500 }`, `dispararCampanha` rejeita (AC 17, door 1)
Proof: run unit | ✓ C17 backend real chama o dashboard e a campanha pelo fetcher

**C18** - `criarLojistaApi` devolve o mock com `VITE_BACKEND_LOJISTA` ausente, `"false"` e `"TRUE"`, e a implementação real com `"true"`; com `VITE_BACKEND_CONSUMIDOR="true"` e `VITE_BACKEND_LOJISTA` ausente devolve o mock; table-driven nos 5 (AC 17, door 2)
Proof: run unit | ✓ C18 só VITE_BACKEND_LOJISTA true liga o backend real da Tela 2

**C19** - O pacote de `npm run build:demo` não contém `/api/v1`, `/campanhas` nem `/analytics/lojista`, e o de `npm run build:integrado` contém `/campanhas` e `/analytics/lojista` (AC 17, door 2)
Proof: `cd frontend && npm run build:demo >/dev/null 2>&1 && { cat dist/assets/*.js | grep -qE '/api/v1|/campanhas|/analytics/lojista'; test $? -eq 1; } && npm run build:integrado >/dev/null 2>&1 && cat dist/assets/*.js | grep -q '/campanhas' && cat dist/assets/*.js | grep -q '/analytics/lojista'`

### S4 - Só a loja do token, com estados de carga e erro

**C20** - Na Tela 2 renderizada não há `combobox`, `listbox` nem `select`; e nas chamadas que a implementação real faz ao `fetcher` (dashboard e campanha), nem o caminho nem o corpo contêm `lojaId` ou `loja_id` (AC 18)
Proof: run unit | ✓ C20 nenhum seletor de loja e nenhum lojaId nas requisições

**C21** - Com `dashboard` pendente, os cards "Ticket médio", "Benchmarking setorial", "Horários de pico" e "Afinidade de compras cruzadas" mostram cada um um elemento `role="status"` com nome "Carregando…" e nenhum "R$" (AC 19)
Proof: run unit | ✓ C21 os quatro cards de dados mostram carregando

**C22** - Com `dashboard` rejeitado, os quatro cards de dados mostram "Não foi possível carregar os dados da sua loja." e "Tentar novamente"; clicar em um "Tentar novamente" chama `dashboard` de novo e, resolvido, mostra "R$ 142,30"; durante o erro, "Disparar Cupom 15% OFF" continua habilitado (AC 20)
Proof: run unit | ✓ C22 erro do dashboard mostra tentar novamente e mantém a campanha

**C23** - O cabeçalho mostra "Portal do Lojista", "Somente dados agregados da sua loja" e "Protótipo · dados fictícios" (AC 21)
Proof: run unit | ✓ C23 cabeçalho mostra título e selos

### Mock da demonstração (plan, Assumptions)

**C24** - O mock devolve `benchmarkingDisponivel: true` com `mediaCategoria` numérica, horas de 10 a 21 com pico às 19h e 6 categorias; com `?benchmarking=bloqueado` na URL devolve `benchmarkingDisponivel: false` e `mediaCategoria: null`; `dispararCampanha` devolve `publicoAtingido` 312 com `id`, `titulo`, `descontoPercentual`, `criterioAlvo` e `criadoEm` ISO (plan, Assumptions; door 1)
Proof: run unit | ✓ C24 mock devolve o dashboard e a campanha na forma do contrato

### Design system e montagem

**C25** - Os arquivos que o card cria ou altera em `frontend/src/` não têm cor hexadecimal literal fora de `src/features/lojista/chartPalette.ts`, nem emoji, e nenhum importa ícone de biblioteca que não seja `lucide-react` (guia de design system §1)
Proof: `cd frontend && F="src/features/lojista src/App.tsx" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' $F | grep -v 'src/features/lojista/chartPalette.ts'; test $? -eq 1; } && { LC_ALL=C.UTF-8 grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' $F; test $? -eq 1; } && { grep -rhoE "from '[^']+'" $F | sort -u | grep -vE "^from '(react|react-dom|@tanstack/react-query|recharts|lucide-react|vitest|@testing-library/[a-z-]+|\./[^']+|\.\./[^']+|@/[^']+)'$"; test $? -eq 1; }`

**C26** - `CHART_PALETTE` em `chartPalette.ts` tem `primary` `#2563EB`, `brand` `#4F46E5`, `success` `#10B981`, `accent` `#F59E0B`, `secondary` `#64748B` e `hairline` `#E2E8F0`, como no guia (§3 Exemplo 5) (plan, Assumptions - cores dos gráficos)
Proof: run unit | ✓ C26 paleta dos gráficos é a do guia de design system

**C27** - Com o dashboard liberado renderizado, todo texto que mostra valor em reais ("R$ …"), percentual ("…%") ou contagem ("<n> compras", "<n> vendas") está num elemento com a classe `tabular-nums` ou dentro de um (guia de design system §1)
Proof: run unit | ✓ C27 valores percentuais e contagens da Tela 2 usam tabular-nums

**C28** - Com os módulos espionados, "Disparar Cupom 15% OFF" e "Tentar novamente" são `children` do `Button`; "Somente dados agregados da sua loja", "Protótipo · dados fictícios" e "Sem acesso a CPFs ou contatos" são `children` do `Badge`; "Ticket médio", "Benchmarking setorial", "Afinidade de compras cruzadas", "Horários de pico" e "Nova campanha em 1 clique" ficam dentro de um `Card` (guia de design system §1)
Proof: run unit | ✓ C28 controles selos e blocos da Tela 2 usam Button Badge e Card

**C29** - Percorrer a Tela 2 no navegador com o mock não registra erro nem warning no console (DoD)
Proof: walk - com o DevTools aberto: abrir `/?tela=lojista` → esperar o dashboard → "Ver dados em tabela" → "Disparar Cupom 15% OFF" até o sucesso → abrir `/?tela=lojista&benchmarking=bloqueado` e ver o bloco bloqueado; console sem erro nem warning

**C30** - Em janela de 375px, `/?tela=lojista` não tem rolagem horizontal da página e os cards ficam em uma coluna (plan, Assumptions - larguras)
Proof: walk - em 375px, `document.documentElement.scrollWidth` é igual a `clientWidth`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| captures (1) | figura3 C1 | - |
| source controls: figura3 menos Differences (2) | "Ver dados em tabela" C10 · botão de campanha "Disparar Cupom 15% OFF" C14 C15 C16 | - |
| controles acrescentados fora da captura (1) | "Tentar novamente" C22 | - |
| URL → tela, AC 2 (3 exemplos) | `/` C2 · `?tela=lojista` C2 · `?tela=shopping` C2 | - |
| ticket em reais, AC 3 (3 exemplos) | 142.3 C3 · 1234.5 C3 · 0 C3 | - |
| gap, AC 4 (6) | -32,2 C4 · +8,3 C4 · 0,0 C4 · média 0 C4 · -8,25 → -8,3 C31 · +8,25 → +8,3 C31 | - |
| combinações da trava ReN05, AC 4-6 (3) | `true` + número C4 · `false` + número C6 · `true` + `null` C6 · `false` + `null` C5 | - |
| horas, AC 8 (3 exemplos) | lacunas 11h/12h C8 · vazio C8 · fora de ordem C8 | - |
| pico, AC 9 (3 exemplos) | 175 de 1.284 C9 · 23h–0h C9 · empate C9 | - |
| cross-shopping, AC 11 (4 exemplos) | 8 → 6 C11 · ordem e empate C11 · "1 compra" C11 · largura proporcional C11 | - |
| estados vazios, AC 12 (2) | pico C12 · afinidade C12 | - |
| mensagens da campanha, AC 14 (3) | 312 C14 · 1 C14 · 0 C14 | - |
| estados da campanha (4) | Pronta C13 · Enviando C15 · Disparada C14 · Falhou C16 | - |
| estados do dashboard por card, AC 19-20 (8) | ticket carregando C21 · ticket erro C22 · benchmarking carregando C21 · benchmarking erro C22 · pico carregando C21 · pico erro C22 · afinidade carregando C21 · afinidade erro C22 | - |
| flag `VITE_BACKEND_LOJISTA` (5 valores) | ausente C18 · `"false"` C18 · `"TRUE"` C18 · `"true"` C18 · só a flag da Tela 1 C18 | - |
| rotas consumidas (2) | `GET /analytics/lojista/dashboard` C17 · `POST /campanhas` C17 | - |
| statuses de `POST /campanhas`, door 1 (2) | `201` C17 · não-2xx C17 C16 | - |
| one-way doors (2) | 1 contrato da campanha C17 C24 · 2 flag e modos de build C18 C19 | - |
| modos de build (2) | `demo` C19 · `integrado` C19 | - |
| transições do dashboard (4) | Carregando→Erro C22 · Erro→Carregando C22 · Carregando→BenchmarkLiberado C4 · Carregando→BenchmarkBloqueado C5 C6 | - |
| regras de ouro do guia (4) | hex C25 C26 · emoji C25 · ícones `lucide-react` C25 · `tabular-nums` C27 | - |
| primitivos do guia (3) | `Button` C28 · `Badge` C28 · `Card` C28 | - |
| startup config: `QueryClientProvider` + `LojistaApi` (2 assemblies) | `main.tsx` → `App` C2 C29 · harness de teste com `QueryClient` novo e `LojistaApi` simulado C3 | - |

- C1, C29 e C30 dependem de largura real e do console do navegador, que o jsdom não reproduz: por isso levam `browser`/`walk`
- C8 e C9 na tela precisam que o `ResponsiveContainer` do Recharts tenha tamanho no jsdom; o teste fixa a dimensão (ex.: `initialDimension` ou mock do `ResizeObserver`), não troca o componente
- C24 roda o mock de verdade; os demais testes de tela injetam uma `LojistaApi` simulada para controlar pendência e rejeição

## Swept

- validation: n/a - a Tela 2 não tem entrada do usuário; o corpo da campanha é fixo (C14, C17)
- failure modes: C16, C22
- idempotency: C15 - clique duplo durante o disparo não faz segunda chamada; disparar de novo depois do sucesso cria outra campanha, e isso é o esperado (C16, plan estado `Disparada → Enviando`)
- authorization: C20 - nenhum `lojaId` sai do front; o isolamento real é do backend (`@PreAuthorize("hasRole('LOJISTA')")` e `lojaId` do JWT, ORD-02/ORD-08); 401/403 com redirecionamento são do ORD-03
- concurrency: C15 - botão desabilitado durante o disparo
- data lifecycle: n/a - o front não persiste nada; as campanhas do mock vivem na memória e somem no F5
- dependency failure: C16, C22, C17
- state transitions: C4, C5, C13, C14, C15, C16, C21, C22
- observability: n/a - SPA sem requisito de log ou métrica; o console limpo é C29

## Handoff

- **Settled mid-build:** texto do gap sem o nome da categoria - usuário: "Sem o nome (Recomendado)" (AD-023, linha nova em Differences)
- **Dispatched:** builder (Sonnet 5.5, pedido do usuário) em `4a7d178` + árvore de trabalho com plan/checks - returned (`789fed0`); Verifier em `789fed0` - returned (FAIL, 3 findings); screens round 1 em `789fed0` - returned (diverges, 9 rows); builder fix pass - returned (`bde6a0e`, `ecf3ca3`); screens round 2 em `ecf3ca3` - returned (matches)
- **Boundary:** C1-C31 closed at ecf3ca3
- **Abandoned:** none
- **Walked:** vite `--host 127.0.0.1` com o mock (sem `VITE_BACKEND_LOJISTA`), Chrome headless via puppeteer-core. C1: janela 1317x1600, escala 1, `/?tela=lojista`, esperei "R$ 142,30" e as barras, sem disparar a campanha, e, depois de existirem 12 `.recharts-bar-rectangle` mais 1 s de folga, salvei a página inteira (1317x1600, no HEAD ecf3ca3) em `captures/figura3-portal-lojista.running.png`: cabeçalho com título e dois selos, card "Ticket médio" R$ 142,30, benchmarking com as barras Sua loja e Média da categoria (R$ 210,00), gap "-32,2%" e aviso de K-Anonymity, afinidade com 6 categorias e "<n> compras", gráfico 10h-21h com pico escuro às 19h e "175" acima, legenda "Pico às 19h–20h com 175 vendas (13,6% do total de 1.284).", "Ver dados em tabela" e o card da campanha com o botão. C29 (1317px, console error/warning e pageerror coletados): visita 1 `/?tela=lojista` até o dashboard; "Ver dados em tabela" abriu a tabela com 12 linhas; "Disparar Cupom 15% OFF" mostrou "Campanha disparada! Cupom de 15% OFF enviado a 312 clientes."; visita 2 `/?tela=lojista&benchmarking=bloqueado` mostrou "Benchmarking Temporariamente Indisponível" e nenhum "210" no texto da página; console vazio. Uma rodada anterior registrou 2 `net::ERR_NAME_NOT_RESOLVED` do Google Fonts de `index.html` (DNS da máquina, sem relação com a tela); repetida, o console ficou vazio. C30 (375px): visita 1 `/?tela=lojista` com a tabela aberta, `scrollWidth` 375 = `clientWidth` 375; visita 2 `/?tela=lojista&benchmarking=bloqueado`, 375 = 375; console vazio nas duas. Os estados de erro e de carregamento do dashboard e a falha do disparo não se alcançam pelo mock no navegador; ficam provados por C21, C22 e C16 no Vitest.
