# ORD-14-ensaio-demo screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 1
**HEAD**: a2dfdf0

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/figura4-portal-shopping.running.png` | `captures/figura4-portal-shopping.png` | diverges | 4 rows differ |

### `captures/figura4-portal-shopping.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| render: picture at the capture's size (1373px wide), not resized, state fully in view | same | shared labels (brand title, card titles, footer) read at the capture's size or larger |
| layout: fixed sidebar on the left, content column on the right, vertical line between them | same | sidebar a few px wider (note) |
| sidebar brand: purple square `SA`, title `Shopping Analytics & Loyalty Hub` on two lines, `Equipe 22 — Ho-Ho` under it | same | |
| sidebar: horizontal line under the brand block | same | |
| sidebar section `PORTAL DO SHOPPING` with `Visão executiva` (highlighted) | same | absent; taken as covered by the approved row "o menu lateral do ORD-03, sem mudança" - the row names the other four items only, so this rests on the ORD-03 menu having no such section, which the picture alone cannot show (note) |
| sidebar items `Faturamento por segmento`, `Volume de notas`, `Estacionamento`, `ROI de campanhas` | same | absent - approved difference (AD-027) |
| sidebar section label `TELAS DO PROTÓTIPO`, uppercase, grey | same | |
| sidebar items `1 · Consumidor`, `2 · Lojista`, `3 · Shopping`, in that order, stacked | same | smaller type than the capture (note) |
| `3 · Shopping` marked as the current screen (darker / heavier than the other two) | same | |
| sidebar footer: line above, pinned to the bottom of the sidebar | same | |
| sidebar footer: round avatar `CD` and the name `Administração Capim Dourado` wrapped at a word boundary | differs | avatar `AS` and the e-mail `admin@shopping.com` in place of the name, broken mid-word into `admin@shopping.co` / `m` |
| sidebar footer: `Perfil: ADMIN_SHOPPING` under the name | same | |
| sidebar footer: no control beside the user block | differs | a logout icon button to the right of the user block, which the capture does not draw |
| header: breadcrumb `Portal do Shopping · Visão executiva · Palmas – TO`, title `Capim Dourado Shopping`, `Exibindo: Últimos 7 dias (07/11 a 13/11)` | same | title `Portal do Shopping` only - approved difference (AD-027) |
| header: tabs `Hoje`, `7 dias`, `30 dias` | same | absent - approved difference (AD-027) |
| header: badge `Protótipo · dados fictícios`, yellow pill, right-aligned at the top | same | the shell's badge, in a strip above the title row - approved difference (AD-027) |
| header: horizontal line under the header, full width of the content column | same | |
| content: light grey page background, white cards with thin border and rounded corners | same | |
| indicators: one row of equal-width cards across the content column, above the segment card | same | 3 cards instead of 4 - approved difference (AD-027) |
| indicator `Faturamento identificado`: label, large bold value in reais, legend `soma das NFC-e validadas` | same | value `R$ 3.544,90` (data; full reais per criterion 6); value in a heavier display face (note) |
| indicators `Notas cadastradas` and `Ticket médio do shopping` | same | replaced by `Campanhas ativas` with value `1` - approved difference (AD-027) |
| indicator `Vouchers de estacionamento`: label, large bold value | same | value `1` (data) |
| indicator vouchers: legend `10,8% das saídas de veículos` | same | absent - approved difference (AD-027) |
| card `Faturamento consolidado por segmento`: bold title, legend `Valor das NFC-e cadastradas no programa` under it | same | |
| segment card arrangement: occupies the left column of the row under the indicators (about 2/5 of the content width), bar track about 175px | differs | the card spans the full content width, with a bar track about 760px long; the removal of the `Volume de notas cadastradas` card beside it is approved, the stretch of this card is not listed |
| segment rows: one row per segment - name on the left, horizontal bar in the middle, bold value in reais right-aligned | same | 3 rows (Vestuário, Eletrônicos, Alimentação) instead of 7 (data) |
| segment bars: solid blue bar over a pale track, proportional to the largest value, largest row filling the track, rows from largest to smallest | same | bar slightly thinner (note) |
| segment values | same | `R$ 2.028,20`, `R$ 1.349,00`, `R$ 167,70` - full reais per criterion 7 instead of `R$ 421,4 mil` |
| highlight box `Vestuário lidera com 30,3% do faturamento…` | same | absent - approved difference (AD-027) |
| card `Volume de notas cadastradas` (line chart, `Ver dados em tabela`) | same | absent - approved difference (AD-027) |
| card `Notas por dia da semana e horário` (heatmap, legend `Menos`/`Mais`) | same | absent - approved difference (AD-027) |
| card `Adesão ao estacionamento grátis` (figures, status bar, legend, note) | same | absent - approved difference (AD-027) |
| card `ROI das campanhas ativas` (table, total row, formula note) | same | absent - approved difference (AD-027) |
| page footer: `Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping · dados fictícios`, centred, small grey, at the bottom of the content column | same | |
| render: nothing overlapping, cut off or scrolled off the window | same | apart from the e-mail break named in the user-block row |
