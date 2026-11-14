# ORD-07 Portal do Consumidor screens

**Verifier**: independent sub-agent (author != verifier)
**Round**: 2
**HEAD**: 9ba30d7

| Screen | Compared with | Verdict | Finding |
| --- | --- | --- | --- |
| `captures/figura1-consumidor-desktop.running.png` | `captures/figura1-consumidor-desktop.png` | matches | 0 rows differ (barra de status corrigida) |
| `captures/figura2-consumidor-mobile.running.png` | `captures/figura2-consumidor-mobile.png` | diverges | 1 row differs (container do app) |

### `captures/figura1-consumidor-desktop.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo (logo "SA", "Shopping Analytics & Loyalty Hub", abas, selo "Protótipo · dados fictícios") | same | ausente, como aprovado em `## Differences from the source` (AD-010) |
| rodapé "Protótipo acadêmico da Equipe 22 — Ho-Ho…" | same | ausente, como aprovado (AD-010) |
| arranjo: quadro de celular à esquerda, coluna com "Painel do protótipo" e "Ordem de validação" à direita, ambos alinhados no topo, conjunto centralizado na janela de 1280px | same | |
| quadro de celular: moldura escura arredondada com sombra, conteúdo rolando dentro dela até o rodapé "Consulta fiscal simulada" | same | |
| barra de status do celular: hora à esquerda; à direita três pontos de sinal, "4G" e bateria | same | round 2: três pontos `●●●`, "4G" e bateria cheia, como na captura |
| cabeçalho roxo: "Capim Dourado Shopping · Palmas – TO · Programa de Benefícios", pílula "Perfil: CONSUMIDOR" à direita, título "Estacionamento grátis", "Some **R$ 150,00** em notas de hoje e saia sem pagar." | same | nota: a linha da loja quebra em 3 linhas em vez de 2 (tipo um pouco maior) |
| card "Seu progresso hoje": título, "CPF ***.982.247-**" à direita, valor grande + "de R$ 150,00", barra verde cheia, ícone check + "**Meta atingida!** Seu estacionamento de hoje está liberado." | same | |
| card do voucher com borda tracejada verde: título "Voucher de estacionamento grátis", "Apresente o QR Code na cancela de saída." | same | |
| pílula âmbar com ponto "Pendente · pronto para uso" | same | |
| QR Code em caixa com borda à esquerda; à direita "Código" (monoespaçado), "Emitido às", "Válido até" "Hoje, 22:00 (fechamento)" | same | |
| "Economia de **R$ 15,00** no estacionamento (valor público da diária)" em verde | same | |
| caixa cinza "Limite de 1 isenção por CPF por dia. Válido para saída até o fechamento do shopping hoje (seg. a sáb. 22h; dom. 20h)." | same | |
| card "Cadastrar nota fiscal (NFC-e)": rótulo "CPF", campo com "529.982.247-25" | same | |
| linha "CPF fictício de teste: 529.982.247-25" com o CPF como link sublinhado | same | |
| "Chave de acesso (44 dígitos)" com contador "0/44" à direita; campo de duas linhas com placeholder em grupos de 4 dígitos monoespaçado | same | nota: placeholder quebra 6+5 grupos em vez de 7+4 |
| dica "Fica impressa abaixo do QR Code do cupom fiscal." | same | nota: quebra em 2 linhas |
| botão contornado de largura total com ícone de QR "Simular leitura de QR Code" | same | |
| caixa cinza com checkbox marcado e "Autorizo o uso dos dados das minhas notas fiscais para o programa de benefícios, conforme a **LGPD**. Lojistas só veem dados agregados e anonimizados; posso revogar a qualquer momento." | same | |
| botão roxo cheio de largura total "Enviar nota" | same | |
| card "Notas de hoje" com "<n> notas · R$ <soma>" à direita no cabeçalho | same | |
| linhas de nota: estabelecimento, "<categoria> · <HH:mm>" abaixo, valor em negrito à direita e pílula verde com check "Validada" abaixo do valor, separadores entre linhas | same | |
| rodapé "Consulta fiscal simulada (MockSefazGateway)" dentro do quadro | same | |
| card "Painel do protótipo" com "Controles para demonstrar as regras de negócio. Não fazem parte do app final." | same | |
| rótulo de seção "SIMULAR ERROS DE VALIDAÇÃO" | same | |
| botões contornados "Nota duplicada" + pílula "ReN01" / "Reenvia uma chave já cadastrada"; "Nota com mais de 72h" + "ReN02" / "Emitida há 4 dias"; "CNPJ fora do shopping" + "RF03" / "Loja emissora não é lojista ativo" | same | |
| seção "OUTROS CENÁRIOS" com 3 botões | same | ausente, como aprovado (AD-011) |
| link sublinhado "Reiniciar demonstração" | same | |
| card "Ordem de validação (mock do backend)" com os 7 itens numerados, texto da captura | same | nota: título quebra em 2 linhas e "(RN04)" desce para a segunda linha do item 1 |

### `captures/figura2-consumidor-mobile.running.png`

| Element | Result | Picture draws |
| --- | --- | --- |
| barra do topo (logo, título, abas, selo) | same | ausente, como aprovado (AD-010) |
| rodapé "Protótipo acadêmico da Equipe 22…" | same | ausente, como aprovado (AD-010) |
| arranjo em coluna única, sem rolagem horizontal, na ordem: cabeçalho, progresso, voucher, formulário, notas de hoje, "Consulta fiscal simulada", painel, ordem de validação | same | |
| container do app: bloco branco recuado das bordas da página, com margem cinza à esquerda e à direita, e o cabeçalho roxo dentro desse recuo | differs | round 2: ainda em largura total; o cabeçalho roxo e a barra de status encostam nas bordas da página, sem a margem cinza |
| barra de status: hora à esquerda; três pontos de sinal e "4G" à direita | same | round 2: três pontos `●●●` e "4G", como na captura |
| cabeçalho roxo: linha da loja, pílula "Perfil: CONSUMIDOR" à direita, "Estacionamento grátis", "Some **R$ 150,00** em notas de hoje e saia sem pagar." | same | nota: linha da loja em 2 linhas e subtítulo em 1 linha (na captura 3 e 2) |
| card "Seu progresso hoje": CPF mascarado à direita, valor + "de R$ 150,00", barra verde cheia, check + "Meta atingida! Seu estacionamento de hoje está liberado." | same | |
| card do voucher tracejado verde: título, instrução, pílula "Pendente · pronto para uso", QR à esquerda com "Código", "Emitido às", "Válido até" à direita, economia em verde, caixa cinza do limite | same | |
| card "Cadastrar nota fiscal (NFC-e)": "CPF", campo, linha do CPF fictício com link | same | |
| "Chave de acesso (44 dígitos)" + "0/44", campo de duas linhas com placeholder em grupos, dica abaixo | same | |
| botão contornado "Simular leitura de QR Code" com ícone | same | |
| caixa da autorização LGPD com checkbox marcado e texto da captura | same | |
| botão roxo "Enviar nota" de largura total | same | |
| card "Notas de hoje": contador e soma à direita, linhas com estabelecimento, "<categoria> · <HH:mm>", valor e pílula "Validada" | same | |
| "Consulta fiscal simulada (MockSefazGateway)" abaixo das notas | same | |
| card "Painel do protótipo": título, descrição, "SIMULAR ERROS DE VALIDAÇÃO", 3 botões com pílulas ReN01/ReN02/RF03 e subtítulos, link "Reiniciar demonstração" | same | |
| seção "OUTROS CENÁRIOS" | same | ausente, como aprovado (AD-011) |
| card "Ordem de validação (mock do backend)" com os 7 itens numerados | same | |
