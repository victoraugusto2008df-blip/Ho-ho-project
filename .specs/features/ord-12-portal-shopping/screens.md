# ORD-12 - Tela 3: Portal da Administração do Shopping screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: 0b71182

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/portal-shopping.running.png` | `captures/portal-shopping.png` | matches | 0 rows differ: o selo `Protótipo · dados fictícios`, que divergia no round 1, agora é `same`; nenhuma regressão |

### `captures/portal-shopping.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| página, arranjo: barra lateral à esquerda com borda direita; à direita, cabeçalho com fio inferior, faixa de 4 KPIs, linha 2 (segmento estreito à esquerda, volume largo à direita), linha 3 (mapa horário largo à esquerda, estacionamento estreito à direita), cartão de ROI em largura total, rodapé centralizado | same | nota: fundo da página cinza-azulado em vez de cinza neutro |
| render: 1373 × 1600, nada sobreposto, cortado nem fora da janela, texto na escala da captura | same | nota: larguras de 10 linhas de texto medidas iguais às da captura com diferença de até 3 px; não é imagem de janela larga redimensionada |
| barra lateral, bloco da marca: ladrilho índigo `SA`, `Shopping Analytics & Loyalty Hub` em duas linhas, `Equipe 22 — Ho-Ho` abaixo, fio divisório sob o bloco | same | nota: ladrilho quadrado de 34 × 34 px, onde a captura desenha 27 × 34 px; nome em face mais geométrica |
| barra lateral, rótulo de grupo `PORTAL DO SHOPPING` em caixa alta | same | nota: cinza mais escuro e mais pesado |
| barra lateral, item ativo `Visão executiva`: pílula lilás na largura da barra, texto índigo | same | |
| barra lateral, itens `Faturamento por segmento`, `Volume de notas`, `Estacionamento`, `ROI de campanhas`, nessa ordem | same | |
| barra lateral, rótulo de grupo `TELAS DO PROTÓTIPO` em caixa alta | same | nota: cinza mais escuro e mais pesado |
| barra lateral, itens `1 · Consumidor`, `2 · Lojista`, `3 · Shopping`, este último em negrito | same | |
| barra lateral, pé: fio divisório, avatar circular `CD`, `Administração Capim Dourado` em duas linhas, `Perfil: ADMIN_SHOPPING` | same | |
| cabeçalho, arranjo: trilha, título e linha `Exibindo:` empilhados à esquerda; seletor de período e selo à direita, na altura do título; fio inferior em toda a largura do conteúdo | same | |
| cabeçalho, trilha `Portal do Shopping · Visão executiva · Palmas – TO` | same | |
| cabeçalho, título `Capim Dourado Shopping` | same | nota: face mais geométrica, mesmo tamanho e posição |
| cabeçalho, `Exibindo: Últimos 7 dias (07/11 a 13/11)` | same | |
| seletor de período: grupo segmentado `Hoje`, `7 dias`, `30 dias` sobre fundo cinza | same | nota: fundo cinza-azulado |
| seletor de período, estado: `7 dias` ativo em pílula branca com sombra, texto em negrito | same | |
| selo `Protótipo · dados fictícios` à direita do seletor: pílula de fundo creme claro com contorno âmbar de 1 px e texto marrom | same | round 2: pílula de fundo creme (`#FFFBEB`) com contorno âmbar de 1 px, 160 × 25 px contra 162 × 26 px na captura, texto marrom-âmbar; nota: o texto é um pouco mais claro e mais alaranjado que o marrom da captura |
| faixa de KPIs, arranjo: 4 cartões de largura igual, na ordem faturamento, notas, ticket, vouchers; cada um com rótulo, valor grande e nota abaixo | same | nota: valores na face geométrica; rótulos cinza-azulados |
| KPI `Faturamento identificado`, `R$ 1,39 mi`, `soma das NFC-e validadas` | same | |
| KPI `Notas cadastradas`, `13.265`, `média de 1.895/dia` | same | |
| KPI `Ticket médio do shopping`, `R$ 104,90`, `por nota fiscal` | same | |
| KPI `Vouchers de estacionamento`, `1.612`, `10,8% das saídas de veículos` | same | |
| cartões (KPIs e painéis): fundo branco, borda clara, cantos arredondados, sombra suave | same | nota: borda e sombra um pouco mais azuladas |
| painel de segmento, arranjo: título e subtítulo, lista de 7 linhas, caixa de destaque no pé | same | |
| painel de segmento, título `Faturamento consolidado por segmento` e subtítulo `Valor das NFC-e cadastradas no programa` | same | nota: título na face geométrica |
| painel de segmento, linhas rótulo · barra · valor: `Vestuário` `R$ 421,4 mil`, `Alimentação` `R$ 282,0 mil`, `Eletrônicos` `R$ 239,6 mil`, `Calçados` `R$ 164,9 mil`, `Esportes` `R$ 128,7 mil`, `Serviços` `R$ 86,1 mil`, `Lazer` `R$ 68,8 mil`, valores em negrito alinhados à direita | same | |
| painel de segmento, barras: horizontais, azuis, pontas arredondadas sobre trilho cinza claro, comprimento proporcional com `Vestuário` cheia, sem eixo | same | nota: azul mais saturado; comprimentos iguais aos da captura |
| painel de segmento, caixa de destaque lilás: `Vestuário lidera com 30,3% do faturamento; Lazer é o segmento com menor participação (4,9%) — insumo para o tenant mix.`, com `Vestuário` e `Lazer` em negrito | same | |
| painel de volume, arranjo: título e subtítulo, gráfico, controle de tabela abaixo do gráfico | same | |
| painel de volume, título `Volume de notas cadastradas` e subtítulo `Notas por dia · últimos 7 dias` | same | |
| gráfico, eixo Y `3.200`, `2.400`, `1.600`, `800`, `0` com fios de grade horizontais claros | same | |
| gráfico, eixo X `Sáb`, `Dom`, `Seg`, `Ter`, `Qua`, `Qui`, `Sex` | same | nota: rótulos um pouco mais próximos da linha de base |
| gráfico, linha azul com área azul-clara abaixo: alta em `Sáb`, queda até `Seg`, platô até `Qui`, subida em `Sex` | same | nota: valores lidos da linha coincidem com os da captura nos 7 pontos (diferença de até 20 notas); área de plotagem cerca de 10 px mais estreita à direita; azul mais saturado |
| gráfico, marca de estado: ponto no primeiro dia com rótulo `2.879` em negrito | same | |
| controle `▶ Ver dados em tabela`, fechado, sob o gráfico | same | |
| painel do mapa horário, arranjo: título e subtítulo à esquerda, legenda à direita na linha do subtítulo, cabeçalhos de hora acima da grade, rótulos de dia à esquerda | same | |
| painel do mapa horário, título `Notas por dia da semana e horário` e subtítulo `Média por dia da semana · últimos 7 dias` | same | |
| legenda `Menos`, 7 amostras do claro ao escuro, `Mais` | same | nota: rampa puxada para o índigo |
| mapa horário, cabeçalhos de coluna `10h` a `21h` (12) | same | |
| mapa horário, rótulos de linha `Seg`, `Ter`, `Qua`, `Qui`, `Sex`, `Sáb`, `Dom` | same | |
| mapa horário, valores das 84 células (de `32` em Seg 10h a `388` em Sáb 18h e 19h) | same | nota: 84 de 84 valores iguais aos da captura |
| mapa horário, cor das células: rampa azul de 7 passos, cada célula no passo da legenda que corresponde ao valor, texto claro nos passos escuros | same | nota: 84 de 84 células no mesmo passo da legenda que na captura; tom índigo em vez de azul-céu a marinho |
| mapa horário, desenho da grade: retângulos arredondados separados por fio branco, coluna `10h` mais estreita, grade na largura do painel | same | nota: a captura corta a coluna `21h` na borda do conteúdo (39 px, canto direito reto); a imagem a desenha inteira (46 px), sem reproduzir o corte; linhas cerca de 1 px mais baixas |
| painel de estacionamento, arranjo: título e subtítulo, dois números lado a lado, rótulo de status, barra empilhada, legenda em lista, caixa de nota no pé | same | |
| painel de estacionamento, título `Adesão ao estacionamento grátis` e subtítulo `Meta de R$ 150,00/dia por CPF · 1 isenção por dia · 967 vagas`, com `vagas` na segunda linha | same | |
| painel de estacionamento, números: `Vouchers emitidos` `1.612` à esquerda; `Adesão` `10,8%` com `das 14.980 saídas de veículos` à direita | same | |
| painel de estacionamento, rótulo `Status dos vouchers` e barra empilhada em três segmentos (azul ~83%, laranja ~14%, verde ~3%) com separadores brancos e pontas arredondadas | same | nota: segmento laranja em âmbar, onde a captura usa laranja-avermelhado; proporções iguais |
| painel de estacionamento, legenda da barra: marcador quadrado e `Utilizados` `1.336 · 82,9%`, `Expirados` `224 · 13,9%`, `Pendentes` `52 · 3,2%`, contagem em negrito e percentual em cinza | same | |
| painel de estacionamento, caixa de nota cinza: `9.870 CPFs distintos cadastraram notas no período. Pendentes = vouchers de hoje ainda não usados; expiram no fechamento (seg. a sáb. 22h; dom. 20h).` | same | |
| painel de ROI, arranjo: título e subtítulo, tabela, nota da fórmula no pé | same | |
| painel de ROI, título `ROI das campanhas ativas` e subtítulo `Cupons disparados pelos lojistas via app do shopping` | same | |
| tabela de ROI, cabeçalho `Campanha`, `Enviados`, `Convertidos`, `Receita gerada`, `ROI`, `Taxa p/ shopping`, colunas numéricas à direita, fio sob o cabeçalho | same | |
| tabela de ROI, linha `Volta às compras 15%` / `Passo Firme Calçados · Calçados`: `253`, `24 (9,5%)`, `R$ 2.902,92`, `407%`, `R$ 60,00` | same | |
| tabela de ROI, linha `Café + bolo 10%` / `Sabor da Serra Café · Alimentação`: `768`, `131 (17,1%)`, `R$ 3.831,75`, `409%`, `R$ 327,50` | same | |
| tabela de ROI, linha `Coleção verão 20%` / `Moda Cerrado · Vestuário`: `454`, `41 (9,0%)`, `R$ 6.228,72`, `275%`, `R$ 102,50` | same | |
| tabela de ROI, linha `Acessórios 12%` / `TecnoPonto Eletrônicos · Eletrônicos`: `208`, `13 (6,3%)`, `R$ 1.098,24`, `503%`, `R$ 32,50` | same | |
| tabela de ROI, desenho das células: nome da campanha com loja · segmento em cinza abaixo; percentual de convertidos menor e em cinza; ROI em negrito; fio entre as linhas | same | nota: fios um pouco mais visíveis |
| tabela de ROI, linha `Total` em negrito: `1.683`, `209`, `R$ 14.061,63`, ROI vazio, `R$ 522,50` | same | |
| painel de ROI, nota `ROI = (receita gerada − custo da campanha) ÷ custo da campanha. Custo = desconto concedido + taxa de sucesso de R$ 2,50 por cupom convertido (receita do shopping).` | same | |
| rodapé centralizado `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` | same | |
