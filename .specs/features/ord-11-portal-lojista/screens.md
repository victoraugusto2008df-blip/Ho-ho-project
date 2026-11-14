# ORD-11 Portal do Lojista screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: ecf3ca3

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/figura3-portal-lojista.running.png` | `captures/figura3-portal-lojista.png` | matches | round 2: as 9 linhas que diferiam no round 1 (789fed0) agora batem; nenhuma regressão |

Round 2: reabertas só as 9 linhas `differs` do round 1 na imagem refeita em ecf3ca3. Ambas as imagens têm 1317×1600. O texto da imagem do autor ("Ticket médio", "Sua loja", rótulos das categorias) sai no mesmo tamanho que na captura, então não é um screenshot redimensionado.

### `captures/figura3-portal-lojista.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| **Shell** | | |
| sidebar esquerda: logo "SA", "Shopping Analytics & Loyalty Hub", "Equipe 22 — Ho-Ho" | same | ausente (Difference AD-018) |
| sidebar: seção "PORTAL DO LOJISTA" com "Visão geral" (ativo), "Benchmarking", "Horários de pico", "Compras cruzadas", "Campanhas" | same | ausente (AD-018) |
| sidebar: seção "TELAS DO PROTÓTIPO" com "1 · Consumidor", "2 · Lojista", "3 · Shopping" | same | ausente (AD-018) |
| sidebar: rodapé do perfil "PF", "Passo Firme Calçados", "Perfil: LOJISTA" | same | ausente (AD-018) |
| rodapé da página "Protótipo acadêmico da Equipe 22 — Ho-Ho, …" | same | ausente (AD-018) |
| arranjo da página: sidebar à esquerda, conteúdo à direita | same | só a coluna de conteúdo, centralizada (AD-018). Nota: fundo da página em cinza bem claro |
| **Cabeçalho** | | |
| breadcrumb "Portal do Lojista · Capim Dourado Shopping · Palmas – TO" | same | ausente (AD-021) |
| título "Passo Firme Calçados" | same | título "Portal do Lojista" (AD-021) |
| subtítulo "Categoria Calçados · Piso único · últimos 30 dias (15/10 a 13/11)" | same | ausente (AD-021) |
| selo "Somente dados agregados da sua loja" com cadeado, contornado, à direita | same | cadeado em ícone de linha em vez de emoji (nota) |
| selo "Protótipo · dados fictícios" em tom âmbar, à direita do primeiro | same | |
| arranjo: título à esquerda, selos à direita, filete abaixo do cabeçalho | same | selos alinhados à linha do título (nota) |
| **Linha de KPIs** | | |
| card "Ticket médio" com "R$ 142,30" na primeira coluna | same | |
| variação "▲ 4,1% vs. 30 dias anteriores" no ticket | same | ausente (AD-016) |
| cards "Nº de vendas identificadas" 1.284, "Taxa de recompra (90 dias)" 31,5%, "Faturamento identificado" R$ 182,7 mil | same | ausentes (AD-016) |
| **Card Benchmarking setorial** | | |
| arranjo: card à esquerda (~60%), card de afinidade à direita, na mesma linha | same | |
| título "Benchmarking setorial" | same | |
| subtítulo "Ticket médio da sua loja vs. mediana do segmento" | same | "… vs. média do segmento" (AD-019) |
| abas "Calçados" / "Calçados infantis" | same | ausentes (AD-016) |
| linha "Sua loja": rótulo, barra azul sobre trilho cinza claro, "R$ 142,30" em negrito à direita | same | |
| linha "Mediana Calçados": barra cinza, "R$ 210,00" | same | "Média da categoria" (AD-019); barra em cinza-ardósia ocupando todo o trilho, onde a captura deixa uma folga no fim (nota) |
| formato das barras do benchmarking: retângulo de ponta esquerda reta e canto direito levemente arredondado | same | round 2: retângulos de ponta esquerda reta e canto direito levemente arredondado (round 1: pílulas) |
| card interno "Gap do ticket médio", meia largura, à esquerda | same | ocupa a largura toda do card, porque o card "Taxa de recompra" ao lado saiu (AD-016) (nota) |
| valor "-32,2%" grande no gap | same | |
| texto "Seu ticket médio é R$ 142,30 vs. R$ 210,00 da mediana do setor de Calçados." | same | round 2: "Seu ticket médio é R$ 142,30 vs. R$ 210,00 da média do setor." - aprovado pela nova Difference AD-023 |
| card interno "Taxa de recompra" 31,5% vs. 27% (mediana) | same | ausente (AD-016) |
| aviso de privacidade em caixa azul clara com ícone "i": "Privacidade (K-Anonymity, ReN05):" em negrito + texto | same | texto "segmento com o mínimo exigido de 3 lojistas ativos. Os valores individuais de concorrentes nunca são exibidos, apenas a média do grupo." (AD-021, AD-019); ícone "i" dentro de um círculo (nota) |
| **Card Afinidade de compras cruzadas** | | |
| título "Afinidade de compras cruzadas" | same | |
| subtítulo "% dos seus clientes que também compraram nestas categorias na mesma visita" | same | "Compras dos seus clientes em outras categorias" (AD-020) |
| 6 linhas: Alimentação, Vestuário, Esportes, Eletrônicos, Lazer, Serviços, em ordem decrescente | same | |
| cada linha: rótulo, barra azul sobre trilho, valor em negrito à direita (62%…9%) | same | "796 compras" … "116 compras" (AD-020); barras proporcionais à maior (critério 11) |
| formato das barras da afinidade: retângulo de ponta esquerda reta, canto direito levemente arredondado, altura igual à do texto | same | round 2: retângulos de ponta esquerda reta e canto direito levemente arredondado; um pouco mais baixas que as da captura (nota) |
| caixa "Insight: 62% dos seus clientes também compram em Alimentação…" | same | ausente (AD-016) |
| rodapé "Mostramos apenas categorias, nunca lojas específicas ou clientes individuais." | same | numa linha só (nota) |
| **Card Horários de pico** | | |
| arranjo: card de largura total abaixo dos dois cards | same | |
| título "Horários de pico" | same | |
| subtítulo "Vendas identificadas por faixa horária · últimos 30 dias" | same | "Vendas identificadas por faixa horária" (AD-016 tira "· últimos 30 dias") |
| abas "Todos os dias" / "Seg–Sex" / "Sáb–Dom" | same | ausentes (AD-016) |
| gráfico de barras: área do gráfico entre o subtítulo e a legenda | same | round 2: gráfico desenhado na área (round 1: em branco) |
| eixo Y com 0, 50, 100, 150, 200 | same | round 2: 0, 50, 100, 150, 200 |
| grade horizontal em filetes claros | same | round 2: filetes horizontais claros |
| 12 barras verticais azuis, uma por hora de 10h a 21h | same | round 2: 12 barras azuis, 10h a 21h |
| barra de pico (19h) em azul mais escuro com "175" acima | same | round 2: barra das 19h em azul mais escuro com "175" acima |
| rótulos do eixo X "10h" … "21h" | same | round 2: "10h" … "21h" |
| legenda "Pico às 19h–20h com 175 vendas (13,6% do total de 1.284)." | same | "19h–20h" sem negrito (nota) |
| disclosure "▶ Ver dados em tabela" | same | chevron ">" em vez de triângulo, texto menor (nota) |
| **Card Nova campanha em 1 clique** | | |
| arranjo: card à esquerda (~60%), card "Campanhas recentes" à direita | same | card à esquerda; à direita vazio (AD-016) |
| título "Nova campanha em 1 clique" | same | |
| subtítulo "Cupom enviado pelo app do shopping a um segmento pré-qualificado." | same | |
| selo "Sem acesso a CPFs ou contatos" | same | pílula contornada com ícone de escudo, onde a captura tem fundo cinza sem ícone (nota) |
| campo "Segmento" com "Clientes da sua loja inativos há 60 dias" em select | same | campo fixo sem seta de select (AD-017) |
| "Desconto do cupom (%)" com "15", dica "Entre 5% e 50%." | same | "Desconto do cupom" com "15%" fixo, sem dica (AD-017) |
| "Validade do cupom" "15 dias" | same | ausente (AD-017) |
| caixa de audiência estimada / conversão / receita potencial e "Prévia no app" | same | ausente (AD-017) |
| arranjo do formulário: segmento em largura total, desconto e validade numa segunda linha | same | segmento e desconto na mesma linha (o formulário é trocado pela AD-017) (nota) |
| botão preenchido roxo "Disparar campanha" abaixo do formulário | same | "Disparar Cupom 15% OFF" (AD-017) |
| **Card Campanhas recentes** | | |
| título, "Volta às aulas · 10%", "Dia dos Pais · 15%" com selos "Concluída", nota sobre cupons | same | ausente (AD-016) |
| **Render** | | |
| nada sobreposto, cortado ou fora da janela | same | |
