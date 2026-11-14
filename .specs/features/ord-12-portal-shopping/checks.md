# ORD-12 - Tela 3: Portal do Shopping - checks

Build: `cd frontend && npm run build`
Run analytics: `node --test --test-reporter=tap frontend/src/lib/analytics/`
Plan: `.specs/features/ord-12-portal-shopping/plan.md`

25 checks em 3 slices · 2 portas de mão única · 4 questões abertas, das quais 3 bloqueiam go-live

> **Estado de execução: nenhum dos 25 checks foi executado até agora.** O BUILD não foi autorizado,
> e os testes que as provas `run` selecionam ainda não existem. Em 2026-11-14 o comando da linha
> `Run analytics:` foi rodado uma vez, como evidência deste estado, e terminou com
> `Could not find 'frontend/src/lib/analytics/'`, exit code 1 e 0 testes executados.
>
> Os 25 checks se dividem em três tipos de prova, e nenhum deles tem execução registrada:
>
> - **13 testes automatizados planejados** (`run analytics`): C4 a C13, C23, C24 e C25. Serão
>   escritos durante o BUILD, a partir de cada check, e executados durante e após o BUILD.
> - **11 verificações manuais** (`walk`): C2, C3 e C14 a C22.
> - **1 comparação por imagem** (`browser`): C1, julgada pelo sub-agente de screens.

> As linhas após `|` nas provas `run` são o formato TAP esperado e precisam ser substituídas pela
> linha que a execução real imprimir, no primeiro commit que criar cada teste. A skill exige a linha
> copiada de uma execução de verdade (`references/checks.md`), e nenhum teste existe ainda.

> **Os 11 checks com prova `walk` são verificação MANUAL, não teste automatizado** - C2, C3, C14,
> C15, C16, C17, C18, C19, C20, C21 e C22. A evidência é o atestado do autor na linha `**Walked:**`
> do `## Handoff`: ele executa o gesto no navegador e registra o que a tela mostrou. `check_proofs.py`
> apenas verifica que essa linha existe, e não visita por visita. Nenhum relatório desta feature deve
> apresentá-los como execução automatizada. Somente os 13 checks com prova `run analytics` terão
> execução por máquina, e só depois que o BUILD criar os testes.

## Checks

### S1 - A tela contra o mockup

**C1** - A visão executiva carregada no período `7 dias` corresponde a `.specs/features/ord-12-portal-shopping/captures/portal-shopping.png` (AC 1)
Proof: browser - entrar com perfil `ADMIN_SHOPPING`, abrir a Tela 3 no período `7 dias`, salvar `captures/portal-shopping.running.png` em viewport de 1373 x 1600

**C2** - O selo `Protótipo · dados fictícios` está no cabeçalho nos estados carregado, vazio e erro (AC 2)
Proof: walk - abrir a Tela 3 carregada, no período sem notas e com o backend fora do ar, e ler o cabeçalho em cada um

**C3** - O rodapé `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` está presente (AC 3)
Proof: walk - abrir a Tela 3 carregada e ler o rodapé

### S2 - Os números que a tela calcula

**C4** - `250000000` centavos viram `R$ 2,50 mi`, `9990` vira `R$ 99,90` e `100000000` vira `R$ 1,00 mi` (AC 4)
Proof: run analytics | ok 1 - formata faturamento em pt-BR com sufixo mi acima de um milhao

**C5** - Os percentuais por setor são `valorCentavos` sobre `faturamentoCentavos` com uma casa e somam `100,0%` (AC 5)
Proof: run analytics | ok 2 - percentuais por setor somam 100,0

**C6** - O mapa horário tem 84 células, 7 dias por 12 faixas de `10h` a `21h`, ordenadas de `Seg` a `Dom` (AC 6)
Proof: run analytics | ok 3 - mapa horario cobre as 84 celulas de Seg a Dom

**C7** - A adesão é `emitidos` sobre `saidasVeiculos` com uma casa: `300` sobre `1200` vira `25,0%` (AC 7)
Proof: run analytics | ok 4 - adesao de vouchers com uma casa decimal

**C8** - A barra de status traz `utilizados`, `expirados` e `pendentes` com valor absoluto e percentual sobre `emitidos` com uma casa (AC 8)
Proof: run analytics | ok 5 - status dos vouchers com absoluto e percentual

**C9** - A linha de total da tabela soma `enviados`, `convertidos`, `receitaCentavos` e `taxaShoppingCentavos` apenas das campanhas com `ativa` verdadeiro (AC 9)
Proof: run analytics | ok 6 - total de campanhas ignora as inativas

**C10** - Faturamento `0` ou lista de setores vazia devolve `0,0%` por setor, sem divisão por zero (AC 10)
Proof: run analytics | ok 7 - faturamento zero nao divide por zero

**C11** - `saidasVeiculos` igual a `0` devolve adesão `0,0%` (AC 11)
Proof: run analytics | ok 8 - saidas de veiculos zero devolve adesao zero

**C12** - Dois setores de igual valor devolvem `50,0%` cada, e nenhum arredondamento faz a soma passar de `100,0%` (AC 5)
Proof: run analytics | ok 9 - arredondamento preserva a soma em 100,0

**C13** - Um valor sem campo correspondente no DTO vem da fixture local e é devolvido pelo mapper com a marca de dado fictício (AC 12)
Proof: run analytics | ok 10 - valor sem campo no DTO vem marcado como ficticio

**C23** - O ticket médio exibido é `faturamentoCentavos` dividido por `notasCadastradas` arredondado ao centavo: `100000` em `8` notas vira `R$ 125,00` e `100000` em `3` notas vira `R$ 333,33` (AC 21)
Proof: run analytics | ok 11 - ticket medio e derivado de faturamento por notas

**C24** - `notasCadastradas` igual a `0` devolve ticket médio `R$ 0,00`, sem divisão por zero (AC 22)
Proof: run analytics | ok 12 - notas zero devolve ticket medio zero

**C25** - O rodapé do KPI de notas é `até o momento` em `Hoje`, e `média de <N>/dia` em `7 dias` e `30 dias`, com `N` igual às notas divididas pelos dias do período: `7000` em `7 dias` vira `média de 1.000/dia` e `7500` em `30 dias` vira `média de 250/dia` (AC 23)
Proof: run analytics | ok 13 - rodape do KPI de notas por periodo

**C14** - A interface identifica visualmente todo valor que o mapper marcou como fictício (AC 12)
Proof: walk - abrir a Tela 3 carregada e conferir a marca em cada painel sem respaldo no DER: status dos vouchers, saídas de veículos, CPFs distintos e as colunas de ROI

### S3 - Os estados da tela

**C15** - Enquanto a consulta não responde, a tela mostra esqueleto no lugar dos KPIs e dos painéis, sem área em branco (AC 13)
Proof: walk - abrir a Tela 3 com a rede estrangulada e observar antes da resposta

**C16** - Com faturamento `0` e nenhuma nota, a tela mostra `Sem notas cadastradas no período` e o seletor de período continua utilizável (AC 14)
Proof: walk - abrir a Tela 3 em um período sem notas e usar o seletor

**C17** - Com `500` ou tempo esgotado, a tela mostra o erro e `Tentar novamente` refaz a mesma consulta (AC 15)
Proof: walk - derrubar a origem dos dados, abrir a Tela 3, usar `Tentar novamente` com a origem de volta

**C18** - Com `401` ou `403`, a tela mostra o estado sem permissão e não desenha número algum do dashboard (AC 16)
Proof: walk - responder `401` e depois `403` à consulta e ler a tela em cada caso

**C19** - `Hoje`, `7 dias` e `30 dias` refazem a consulta e atualizam a linha `Exibindo:` do cabeçalho (AC 17)
Proof: walk - usar os três controles de período em sequência e ler o cabeçalho a cada troca

**C20** - `Ver dados em tabela` abre a tabela com a mesma série que o gráfico desenha (AC 18)
Proof: walk - usar o controle e comparar a tabela com a série do gráfico

**C21** - Cada item da navegação lateral leva à sua seção e fica marcado como ativo (AC 19)
Proof: walk - usar os oito itens da barra lateral, um a um

**C22** - Trocando de período com uma consulta em voo, a tela mostra o último período escolhido, não a última resposta a chegar (AC 20)
Proof: walk - com a rede estrangulada, escolher `30 dias` e, antes da resposta, escolher `Hoje`, e ler o cabeçalho e os KPIs

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| KPIs que a captura desenha (4) | `Faturamento identificado` C1, C4 · `Notas cadastradas` C1, C25 · `Ticket médio do shopping` C1, C23 · `Vouchers de estacionamento` C1, C7 | - |
| painéis que a captura desenha (5) | faturamento por segmento C1, C5 · volume de notas C1 · mapa horário C1, C6 · adesão ao estacionamento C1, C8 · ROI das campanhas C1, C9 | - |
| estados da tela (5) | carregado C1 · carregando C15 · vazio C16 · erro C17 · sem permissão C18 | - |
| controles que a captura desenha (12) | `Visão executiva` C21 · `Faturamento por segmento` C21 · `Volume de notas` C21 · `Estacionamento` C21 · `ROI de campanhas` C21 · `1 · Consumidor` C21 · `2 · Lojista` C21 · `3 · Shopping` C21 · `Hoje` C19 · `7 dias` C19 · `30 dias` C19 · `Ver dados em tabela` C20 | - |
| statuses de `GET /api/v1/analytics/shopping/dashboard` (4) | 200 C1 · 401 C18 · 403 C18 · 500 C17 | - |
| células do mapa horário (84) | C6, table-driven sobre as 84 | - |
| exemplos do formato de faturamento, AC 4 (3 exemplos) | `250000000` C4 · `9990` C4 · `100000000` C4 | - |
| exemplos da regra de percentual, AC 5 (3 exemplos) | três setores C5 · setor único C5 · dois setores iguais C12 | - |
| divisões por zero (3) | faturamento `0` C10 · `saidasVeiculos` `0` C11 · `notasCadastradas` `0` C24 | - |
| rodapé do KPI de notas por período (3) | `Hoje` C25 · `7 dias` C25 · `30 dias` C25 | - |
| painéis sem respaldo no DER, marcados como fictícios (4) | status dos vouchers C13, C14 · saídas de veículos C13, C14 · CPFs distintos C13, C14 · colunas de ROI C13, C14 | - |

## Swept

- validation: C10, C11, C24
- failure modes: C17
- idempotency: n/a - a tela só emite `GET`; nenhum pedido altera estado no servidor, então não há efeito a repetir
- authorization: C18
- concurrency: C22
- data lifecycle: n/a - nada é persistido no cliente; o cache do TanStack Query é memória volátil e a tela não tem campo que o usuário salve, reabra e salve de novo
- dependency failure: C17 - a origem dos dados fora do ar, seja a fixture ou o endpoint do ORD-10, cai no mesmo estado de erro com `Tentar novamente`
- state transitions: C15, C19
- observability: n/a - o cartão não pede log nem métrica no cliente, e `frontend/package.json` não traz nenhuma biblioteca de telemetria

## Handoff

- **Settled mid-build:** <cada resposta do usuário, nas palavras dele, no turno em que chegar>
- **Dispatched:** <cada sub-agente antes de ser enviado: Verifier e screens, com o `HEAD`>
- **Boundary:** <nenhum check fechado - BUILD não autorizado>
- **Abandoned:** <nada ainda>
- **Walked:** <o que foi visitado, o que a tela mostrou, como se alcança cada estado, e cada visita que um `walk` nomeia>
