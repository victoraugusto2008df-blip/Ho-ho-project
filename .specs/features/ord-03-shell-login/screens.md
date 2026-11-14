# ORD-03 Shell & Login screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: 91eba26

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/figura1-consumidor-desktop.running.png` | `captures/figura1-consumidor-desktop.png` | matches | a linha que divergia na rodada 1 (rodapé "Protótipo acadêmico…") agora é `same` |
| `captures/figura2-consumidor-mobile.running.png` | `captures/figura2-consumidor-mobile.png` | matches | imagem refeita em 232×1600 (layout de 390px na escala 232/390); a linha que divergia na rodada 1 (rodapé "Protótipo acadêmico…") agora é `same`; nenhuma regressão |
| `captures/figura3-portal-lojista.running.png` | `captures/figura3-portal-lojista.png` | matches | as 4 linhas que divergiam na rodada 1 agora são `same`; nenhuma regressão |
| `captures/figura4-portal-shopping.running.png` | `captures/figura4-portal-shopping.png` | matches | as 6 linhas que divergiam na rodada 1 agora são `same` (iniciais `AC` aprovadas por AD-009); nenhuma regressão |

Rodada 2: foram reabertas só as linhas `differs` da rodada 1, aplicando a nova linha AD-009 de `## Differences from the source` e a nota AD-008 de `## Out of scope`. As imagens novas foram tiradas sem rede, então a fonte web (Inter) foi trocada pela fonte do sistema. Isso muda só a forma das letras: não é desenho do app e não foi marcado como regressão. Nenhuma linha `same` foi visivelmente quebrada.

Observação sobre o rodapé "Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios": as 4 figuras o desenham, idêntico, no fim da página, fora do conteúdo próprio de cada portal. Por isso foi tratado como parte do shell.

### `captures/figura1-consumidor-desktop.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo: fundo branco, largura total, linha fina embaixo | same | |
| barra: logo quadrado índigo `SA` à esquerda | same | |
| barra: título `Shopping Analytics & Loyalty Hub` com subtítulo `Equipe 22 — Ho-Ho`, ao lado do logo | same | nota: o bloco começa um pouco mais à esquerda (container mais largo) |
| barra: abas `1 · Consumidor`, `2 · Lojista`, `3 · Shopping` agrupadas à direita | same | |
| barra: aba ativa `1 · Consumidor` com fundo índigo claro e texto índigo | same | |
| barra: selo `Protótipo · dados fictícios` âmbar, à direita das abas | same | nota: o selo da imagem tem fundo âmbar preenchido; o da captura tem fundo mais claro com borda âmbar - tom |
| barra: nenhum botão de sair | same | ícone de sair no fim da barra - aprovado (`## Differences from the source`, AD-006) |
| área abaixo da barra: fundo cinza-claro | same | |
| área abaixo da barra: frame do celular com o app do Consumidor, "Painel do protótipo" e "Ordem de validação" | same | placeholder `Portal do Consumidor` `ORD-07` - aprovado (AD-001) |
| rodapé da página centralizado: `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` | same | rodada 2: rodapé centralizado no fim da página, com o texto exato |

### `captures/figura2-consumidor-mobile.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo empilhada: linha 1 com logo `SA` + `Shopping Analytics & Loyalty Hub` / `Equipe 22 — Ho-Ho` | same | |
| barra: linha 2 com as abas `1 · Consumidor`, `2 · Lojista`, `3 · Shopping`, alinhadas à esquerda | same | |
| barra: aba ativa `1 · Consumidor` com fundo índigo claro | same | |
| barra: linha 3 com o selo `Protótipo · dados fictícios` à esquerda | same | ícone de sair ao lado do selo - aprovado (AD-006) |
| barra: linha fina separando a barra do conteúdo | same | |
| área abaixo da barra: app do Consumidor, "Painel do protótipo" e "Ordem de validação" empilhados | same | placeholder `Portal do Consumidor` `ORD-07` - aprovado (AD-001) |
| rodapé da página: `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` | same | rodada 2: rodapé centralizado em 2 linhas no fim da página, com o texto exato; nota: na imagem refeita, a redução deixa franjas coloridas no texto pequeno, que continua legível |
| render: nada sobreposto nem cortado na barra | same | rodada 2 (imagem refeita em 232×1600): os rótulos que a captura também desenha (título, abas, selo) aparecem no mesmo tamanho da captura, e a barra tem o mesmo empilhamento em 3 linhas, então não é `differs - resized`; nada sobreposto nem cortado |

### `captures/figura3-portal-lojista.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| arranjo: sidebar fixa à esquerda, altura total, borda à direita; conteúdo à direita | same | nota: sidebar um pouco mais larga (~255px contra ~233px) |
| sidebar, topo: logo `SA` + `Shopping Analytics &` / `Loyalty Hub` em 2 linhas + `Equipe 22 — Ho-Ho` | same | |
| sidebar, topo: linha separando o bloco do logo da navegação | same | |
| selo `Protótipo · dados fictícios` no canto superior direito da área de conteúdo, na linha do cabeçalho | same | rodada 2: selo numa faixa fina no topo do conteúdo, alinhado à direita (AD-008); saiu da sidebar |
| seção `PORTAL DO LOJISTA` com `Visão geral` (ativo), `Benchmarking`, `Horários de pico`, `Compras cruzadas`, `Campanhas` | same | seção omitida sem `handle.nav` - aprovado (AD-001; critério 25) |
| seção `TELAS DO PROTÓTIPO`: rótulo em caixa alta cinza | same | |
| seção `TELAS DO PROTÓTIPO`: itens `1 · Consumidor`, `2 · Lojista`, `3 · Shopping` | same | |
| item do perfil ativo `2 · Lojista` destacado em negrito, texto escuro, sem fundo | same | rodada 2: `2 · Lojista` em negrito, texto escuro, sem pílula |
| rodapé da sidebar: linha acima, avatar redondo `PF` | same | |
| rodapé da sidebar: nome `Passo Firme Calçados` inteiro | same | rodada 2: `Passo Firme Calçados` inteiro, sem corte |
| rodapé da sidebar: `Perfil: LOJISTA` | same | |
| rodapé da sidebar: nenhum botão de sair | same | ícone de sair ao lado do rodapé - aprovado (AD-006) |
| cabeçalho da área (breadcrumb, `Passo Firme Calçados`, período, selo `Somente dados agregados da sua loja`) | same | ausente - fora do escopo (ORD-11) |
| conteúdo: KPIs, benchmarking, afinidade, horários de pico, campanhas | same | placeholder `Portal do Lojista` `ORD-11` - aprovado (AD-001) |
| rodapé da área de conteúdo: `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` | same | rodada 2: rodapé centralizado no fim da área de conteúdo, com o texto exato |

### `captures/figura4-portal-shopping.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| arranjo: sidebar fixa à esquerda, altura total, borda à direita; conteúdo à direita | same | nota: sidebar um pouco mais larga (~255px contra ~243px) |
| sidebar, topo: logo `SA` + `Shopping Analytics &` / `Loyalty Hub` em 2 linhas + `Equipe 22 — Ho-Ho` | same | |
| sidebar, topo: linha separando o bloco do logo da navegação | same | |
| selo `Protótipo · dados fictícios` no canto superior direito da área de conteúdo, ao lado do filtro de período | same | rodada 2: selo numa faixa fina no topo do conteúdo, alinhado à direita (AD-008); saiu da sidebar. O filtro é do ORD-12 |
| seção `PORTAL DO SHOPPING` com `Visão executiva` (ativo), `Faturamento por segmento`, `Volume de notas`, `Estacionamento`, `ROI de campanhas` | same | seção omitida sem `handle.nav` - aprovado (AD-001; critério 25) |
| seção `TELAS DO PROTÓTIPO`: rótulo em caixa alta cinza | same | |
| seção `TELAS DO PROTÓTIPO`: itens `1 · Consumidor`, `2 · Lojista`, `3 · Shopping` | same | |
| item do perfil ativo `3 · Shopping` destacado em negrito, texto escuro, sem fundo | same | rodada 2: `3 · Shopping` em negrito, texto escuro, sem pílula |
| rodapé da sidebar: linha acima, avatar redondo com iniciais `CD` | same | rodada 2: iniciais `AC` - aprovado (`## Differences from the source`, AD-009) |
| rodapé da sidebar: nome `Administração Capim Dourado` inteiro, quebrando em 2 linhas | same | rodada 2: `Administração Capim` / `Dourado` em 2 linhas, sem corte |
| rodapé da sidebar: `Perfil: ADMIN_SHOPPING` | same | rodada 2: `Perfil: ADMIN_SHOPPING` inteiro |
| rodapé da sidebar: nenhum botão de sair | same | ícone de sair ao lado do rodapé - aprovado (AD-006) |
| cabeçalho da área (breadcrumb, `Capim Dourado Shopping`, `Exibindo: Últimos 7 dias`, filtro `Hoje / 7 dias / 30 dias`) | same | ausente - fora do escopo (ORD-12) |
| conteúdo: KPIs, faturamento por segmento, volume de notas, mapa de calor, estacionamento, ROI | same | placeholder `Portal do Shopping` `ORD-12` - aprovado (AD-001) |
| rodapé da área de conteúdo: `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios` | same | rodada 2: rodapé centralizado no fim da área de conteúdo, com o texto exato |
