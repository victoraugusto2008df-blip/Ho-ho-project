# ORD-07 Portal do Consumidor screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: d7bd68b

Round 2: nenhuma linha estava `differs` no round 1. As duas figuras refeitas em `d7bd68b` foram reabertas e nenhuma linha `same` foi quebrada visivelmente, então nenhuma virou `differs - regression`. Só os dados de amostra mudaram (hora, código do voucher). A linha nova de `## Differences from the source` (AD-015: autorização LGPD desmarcada ao abrir) não muda nenhuma linha: as figuras mostram a caixa marcada, o mesmo estado da captura.

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/figura1-consumidor-desktop.running.png` | `captures/figura1-consumidor-desktop.png` | matches | 0 rows differ |
| `captures/figura2-consumidor-mobile.running.png` | `captures/figura2-consumidor-mobile.png` | matches | 0 rows differ |

### `captures/figura1-consumidor-desktop.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo (logo "SA", "Shopping Analytics & Loyalty Hub", abas, selo "Protótipo · dados fictícios") | same | ausente, como `## Differences from the source` aprova (AD-010) |
| rodapé "Protótipo acadêmico da Equipe 22 — Ho-Ho…" | same | ausente, aprovado (AD-010) |
| arranjo geral: quadro de celular à esquerda; à direita, "Painel do protótipo" e, abaixo dele, "Ordem de validação (mock do backend)", alinhados ao topo do quadro | same | nota: o conjunto sobe ~60px por não haver a barra do topo |
| quadro de celular: moldura escura arredondada com sombra, conteúdo de fundo cinza-claro | same | |
| barra de status: hora à esquerda, "●●● 4G" e bateria à direita, sobre o roxo | same | |
| cabeçalho roxo: "Capim Dourado Shopping · Palmas – TO · Programa de Benefícios" à esquerda, pílula "Perfil: CONSUMIDOR" à direita | same | nota: a linha quebra em 3 em vez de 2 |
| título "Estacionamento grátis" e subtítulo "Some **R$ 150,00** em notas de hoje e saia sem pagar." | same | |
| card "Seu progresso hoje": título com "CPF ***.982.247-**" à direita | same | |
| valor acumulado grande + "de R$ 150,00" | same | |
| barra de progresso verde, cheia | same | |
| linha "✓ **Meta atingida!** Seu estacionamento de hoje está liberado." em verde/cinza | same | |
| card do voucher com borda verde tracejada | same | |
| "Voucher de estacionamento grátis" + "Apresente o QR Code na cancela de saída." | same | |
| pílula "● Pendente · pronto para uso" (âmbar) | same | |
| QR Code à esquerda em caixa com borda; à direita "Código" (mono), "Emitido às", "Válido até" "Hoje, 22:00 (fechamento)" | same | |
| "Economia de **R$ 15,00** no estacionamento (valor público da diária)" em verde | same | |
| caixa cinza "Limite de 1 isenção por CPF por dia. Válido para saída até o fechamento do shopping hoje (seg. a sáb. 22h; dom. 20h)." | same | |
| card "Cadastrar nota fiscal (NFC-e)" | same | |
| rótulo "CPF" e campo "529.982.247-25" | same | |
| linha "CPF fictício de teste: 529.982.247-25" com o CPF sublinhado em azul | same | |
| rótulo "Chave de acesso (44 dígitos)" com contador "0/44" à direita | same | |
| campo da chave em 2 linhas com o placeholder em grupos de 4 (mono) | same | nota: 6 grupos na primeira linha em vez de 7 |
| dica "Fica impressa abaixo do QR Code do cupom fiscal." | same | nota: quebra em 2 linhas |
| botão contornado "Simular leitura de QR Code" com ícone de QR à esquerda | same | |
| caixa cinza com checkbox marcado e o texto de autorização LGPD com "**LGPD**" em negrito | same | |
| botão roxo cheio "Enviar nota" na largura do card | same | |
| card "Notas de hoje" com "<n> notas · R$ <soma>" à direita | same | |
| cada nota: estabelecimento, "<categoria> · <HH:mm>", valor em negrito à direita, pílula verde "✓ Validada" abaixo do valor, divisória entre notas | same | |
| rodapé do quadro "Consulta fiscal simulada (MockSefazGateway)" | same | |
| card "Painel do protótipo" com "Controles para demonstrar as regras de negócio. Não fazem parte do app final." | same | |
| seção "SIMULAR ERROS DE VALIDAÇÃO" | same | |
| botão-card "Nota duplicada" + pílula "ReN01" + "Reenvia uma chave já cadastrada" | same | |
| botão-card "Nota com mais de 72h" + pílula "ReN02" + "Emitida há 4 dias" | same | |
| botão-card "CNPJ fora do shopping" + pílula "RF03" + "Loja emissora não é lojista ativo" | same | |
| seção "OUTROS CENÁRIOS" com seus 3 botões | same | ausente, aprovado (AD-011) |
| link sublinhado "Reiniciar demonstração" no fim do painel | same | |
| card "Ordem de validação (mock do backend)" | same | nota: o título quebra em 2 linhas |
| lista numerada dos 7 itens, mesmo texto e ordem (RN04, RF01, ReN01, RF02, RF03, ReN02, ReN03/ReN04) | same | |

### `captures/figura2-consumidor-mobile.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo (logo, título, abas, selo) | same | ausente, aprovado (AD-010) |
| rodapé "Protótipo acadêmico da Equipe 22…" | same | ausente, aprovado (AD-010) |
| arranjo: coluna única sem rolagem horizontal, na ordem cabeçalho, progresso, voucher, cadastro, notas de hoje, rodapé do mock, painel, ordem de validação | same | |
| bloco do app (cabeçalho roxo até "Consulta fiscal simulada") recuado das bordas, com os cards recuados dentro dele | same | nota: na captura o bloco do app tem fundo um tom mais claro que a página; na figura o fundo é uniforme |
| barra de status: hora, "●●● 4G" e bateria | same | |
| cabeçalho roxo: linha do shopping em 3 linhas, pílula "Perfil: CONSUMIDOR" à direita, "Estacionamento grátis", subtítulo com **R$ 150,00** | same | |
| card "Seu progresso hoje" com CPF mascarado à direita, valor + "de R$ 150,00", barra verde, "✓ Meta atingida! …" | same | |
| card do voucher tracejado verde: título, instrução, pílula âmbar, QR com Código/Emitido às/Válido até à direita, economia em verde, caixa cinza do limite | same | |
| card "Cadastrar nota fiscal (NFC-e)": CPF, linha do CPF fictício, chave com "0/44", campo em 2 linhas, dica, botão "Simular leitura de QR Code", caixa LGPD marcada, botão "Enviar nota" | same | nota: a dica quebra em 2 linhas |
| card "Notas de hoje" com contagem e soma; cada nota com loja, categoria · hora, valor e pílula "Validada" | same | |
| "Consulta fiscal simulada (MockSefazGateway)" centralizado abaixo das notas | same | |
| card "Painel do protótipo" com descrição e "SIMULAR ERROS DE VALIDAÇÃO" | same | |
| 3 botões-card de erro com pílulas ReN01, ReN02, RF03 e subtítulos | same | |
| seção "OUTROS CENÁRIOS" | same | ausente, aprovado (AD-011) |
| link "Reiniciar demonstração" | same | |
| card "Ordem de validação (mock do backend)" com os 7 itens numerados | same | |
