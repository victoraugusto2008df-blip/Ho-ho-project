# ORD-07 - Tela 1: Portal do Consumidor verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at a239bbd
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | browser - `captures/figura1-consumidor-desktop.running.png` | yes - quadro de celular à esquerda com cabeçalho, progresso, voucher, formulário e notas de hoje; "Painel do protótipo" e "Ordem de validação (mock do backend)" à direita; faltam só a barra do topo, o rodapé do shell e "OUTROS CENÁRIOS" (Differences, Confirmed y) |
| C2 | browser - `captures/figura2-consumidor-mobile.running.png` + walk (`scrollWidth` = `clientWidth` = 390, ordem dos 7 blocos) | yes - coluna única na ordem da captura (cabeçalho, progresso, voucher, formulário, notas, painel, ordem de validação); a divergência de pixel que `proofs.md` marca é do screens sub-agent |
| C3 | shell - `grep` de hex e de emoji (confirmado que o `grep -P` acha "✓" num arquivo descartável) e lista branca de `from '…'` sobre `src/features/consumidor`, `App.tsx`, `src/test/setup.ts` | yes - só olha imports com aspas simples (`from "react-icons"` passaria), o que hoje o estilo do repositório cobre |
| C4 | `PortalConsumidor.test.tsx` `C4 todo valor em reais, percentual e contador usa tabular-nums` | yes - junta os nós de texto de cada elemento, exige "0/44" e ≥ 8 ocorrências |
| C5 | `primitivos.test.tsx` `C5 controles pílulas e blocos usam Button Badge e Card` | yes |
| C6 | walk - percurso S1 a S5 em 1280px com puppeteer, console sem erro nem warning | yes - o percurso descrito no Walked cobre os 3 envios, os 3 erros do painel, CPF inválido, LGPD desmarcada e "Reiniciar demonstração" |
| C7 | `PortalConsumidor.test.tsx` `C7 progresso mostra acumulado CPF e barra limitada a 0-100` | yes - `valorAcumulado` e `percentual` diferentes em cada caso, então a barra só passa se vier do `percentual` |
| C8 | `PortalConsumidor.test.tsx` `C8 mostra o faltante abaixo da meta e meta atingida em 100` | yes |
| C9 | `PortalConsumidor.test.tsx` `C9 voucher liberado mostra QR do qrPayload código horários e regras` | yes |
| C10 | `consumidor.test.ts` `C10 validoAte de hoje e de outro dia saem no formato do voucher` | yes |
| C11 | `PortalConsumidor.test.tsx` `C11 sem voucher o card do voucher não aparece` | yes |
| C12 | `PortalConsumidor.test.tsx` `C12 progresso tem estado de carregando erro e tentar novamente` | yes |
| C13 | `PortalConsumidor.test.tsx` `C13 campo da chave aceita só 44 dígitos em grupos de 4 com contador` | yes |
| C14 | `PortalConsumidor.test.tsx` `C14 simular leitura percorre o ciclo de chaves válidas sem enviar` | yes |
| C15 | `PortalConsumidor.test.tsx` `C15 CPF abre com o fictício e o link o preenche` | yes |
| C16 | `PortalConsumidor.test.tsx` `C16 CPF com dígito verificador inválido é recusado sem requisição` | yes |
| C17 | `PortalConsumidor.test.tsx` `C17 sem autorização LGPD nada é enviado` | yes |
| C18 | `PortalConsumidor.test.tsx` `C18 chave incompleta é recusada sem requisição` | yes |
| C19 | `PortalConsumidor.test.tsx` `C19 envio aprovado limpa a chave e atualiza lista e progresso` | yes - a lista e o benefício só mudam por refetch, então a invalidação é exercida |
| C20 | `PortalConsumidor.test.tsx` `C20 cada recusa de negócio mostra a regra e a mensagem própria` | yes - agora espera `isFetching() + isMutating() === 0` (o `onSettled` segura a mutation até o refetch) antes de conferir lista e acumulado |
| C21 | `PortalConsumidor.test.tsx` `C21 falha técnica mostra a mensagem genérica e mantém a chave` | yes |
| C22 | `PortalConsumidor.test.tsx` `C22 editar a chave apaga a mensagem anterior` | yes |
| C23 | `PortalConsumidor.test.tsx` `C23 lista ordena da mais recente e soma no cabeçalho` | yes - a entrada vem na ordem inversa da esperada |
| C24 | `PortalConsumidor.test.tsx` `C24 lista vazia mostra o estado vazio` | yes |
| C25 | `PortalConsumidor.test.tsx` `C25 lista tem estado de carregando erro e tentar novamente` | yes |
| C26 | `PortalConsumidor.test.tsx` `C26 botões do painel enviam a chave de cada erro` | yes - `toHaveBeenLastCalledWith(chave)` reprova um clique perdido em botão desabilitado |
| C27 | `PortalConsumidor.test.tsx` `C27 reiniciar zera a demonstração e o ciclo de chaves` | yes - o ciclo estava no índice 2 antes de reiniciar |
| C28 | `PortalConsumidor.test.tsx` `C28 ordem de validação mostra os 7 itens da captura` | yes |
| C29 | `PortalConsumidor.test.tsx` `C29 backend real esconde reiniciar e o rodapé do mock` | yes - usa o `mockNotasApi` (que tem `reiniciar`), então isola a flag |
| C30 | `consumidor.test.ts` `C30 backend real chama as 3 rotas do contrato pelo fetcher` | yes |
| C31 | `consumidor.test.ts` `C31 backend real converte 409 e 422 em erro de negócio e o resto em genérico` | yes |
| C32 | `consumidor.test.ts` `C32 só a flag exata true liga o backend real` | yes |
| C33 | `consumidor.test.ts` `C33 percentual e faltante da meta respeitam os limites` | no - os 5 exemplos passam, mas nenhum fica entre 149,25 e 149,99, onde `percentualDaMeta` arredonda para 100 com a meta não atingida (ver Findings) |
| C34 | `consumidor.test.ts` `C34 chaves de demonstração têm 44 dígitos e são distintas` | yes |
| C35 | `consumidor.test.ts` `C35 mock recusa cada caso de negócio sem tocar no acumulado` | yes |
| C36 | `consumidor.test.ts` `C36 mock libera um único voucher ao atingir a meta` | yes |
| C37 | `consumidor.test.ts` `C37 mock devolve notas e benefício na forma do contrato` | yes |
| C38 | `consumidor.test.ts` `C38 valores em reais saem no formato brasileiro` | yes |
| C39 | shell - `node -e` sobre `frontend/package.json` | yes - igualdade exata de cada versão e do script |
| C41 | shell - `npm run build` e `npm run build:demo` sem `/api/v1`/`chaveAcesso`, `npm run build:integrado` com os dois (proof revisto em `d7bd68b`) | yes - cada pacote é conferido logo depois do seu build (o Vite limpa `dist`), e um `/api/v1` no build padrão faria o `test $? -eq 1` falhar |
| C40 | `PortalConsumidor.test.tsx` `C40 App renderiza a Tela 1 no lugar da vitrine` | yes |
| C42 | `consumidor.test.ts` `C42 abaixo da meta o percentual nunca chega a 100` | yes - 149,25 é o primeiro valor que `Math.round` levava a 100 (99,5), então o código de `a239bbd` reprova; 149,99 → 99 e 150 / 150,01 → 100 fixam os dois lados da meta |

Exemplos próprios, rodados em `a239bbd` num teste descartável (`zzverif.test.tsx`, apagado, não commitado):
- AC 6/7 e C33: `percentualDaMeta(149.99)` → 100 com `faltanteDaMeta` 0.01; `149.25` → 100 com 0.75; `149.24` → 99. Com esse par na tela, "Seu progresso hoje" mostra "R$ 149,99" e "Meta atingida! Seu estacionamento de hoje está liberado.", sem voucher - **quebra**.
- AC 14: `cpfValido(' 529 982 247 25 ')` true, `'529.982.247-250'` false, `'529.982.247-2'` false, `'000.000.001-91'` true, `''` false - ok.
- AC 21: datas com fusos diferentes (`14:15-03:00` contra `16:00Z`) ordenadas pelo instante, 0,10 + 0,20 → "2 notas · R$ 0,30" - ok.
- AC 11: `normalizarChave('12a3-4.5')` → `12345`, 60 dígitos → 44 - ok.
- AC 29: `400` + `CHAVE_INVALIDA`, `422` sem corpo e `409` + `nota_duplicada` (minúsculo) → erro genérico - coerente com a door 1.
- Voucher `UTILIZADO` não mostra o card (fora de escopo, sem check) - ok.
- `npm run build` (modo `production`): 0 ocorrências de `/api/v1`/`chaveAcesso` - ok hoje.

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| No mock, `percentualDaMeta` arredonda para 100 abaixo da meta: de R$ 149,25 a R$ 149,99 a tela diz "Meta atingida!" com faltante > 0 e sem voucher, contra o AC 7 e o estado `MetaAtingida` do plano ("percentual = 100 e voucher LIBERADO"); C33 passa porque nenhum exemplo cai nessa faixa (com os valores atuais do mock, 60/90/40, ela não é alcançada na demo) | `regras.ts:6` `Math.min(100, Math.round((valorAcumulado / meta) * 100))`; teste descartável: `percentualDaMeta(149.99)` = 100, `faltanteDaMeta(149.99)` = 0.01, e a tela renderiza "R$ 149,99 … Meta atingida!" | só devolver 100 quando `valorAcumulado >= meta` (ex.: `Math.floor`, ou arredondar e limitar a 99 abaixo da meta) e acrescentar 149,99 → 99 a C33 | `d7bd68b` - abaixo da meta o percentual é truncado; C42 prova 149,25 → 99, 149,99 → 99, 150 → 100 |
| A captura que vincula desenha a autorização LGPD marcada; o plano abre a caixa desmarcada (Assumptions, `Confirmed? n`) e C17 afirma isso, mas a diferença não está em `## Differences from the source` | `captures/figura1-consumidor-desktop.png` e `figura2-consumidor-mobile.png` (caixa marcada com o campo vazio "0/44"); `plan.md` Assumptions "Autorização LGPD ao abrir - desmarcada - n"; C17 `expect(checked).toBe(false)` | confirmar com o usuário e registrar a linha em `## Differences from the source` com `Confirmed: y` (ou abrir marcada, se o usuário preferir a captura) | `d7bd68b` - usuário escolheu "Desmarcada": AD-015 em `.specs/STATE.md` e linha em `## Differences from the source` com `Confirmed: y - AD-015` |
| C41 é mais estreito que o AC 31: o critério diz "`npm run build:demo` (ou `npm run build`)", mas nenhum proof inspeciona o pacote de `npm run build`; uma mudança no `define` que só tratasse `mode === 'demo'` deixaria o backend real no build padrão sem nenhum check vermelho | proof de C41 em `checks.md` só roda `build:demo` e `build:integrado`; o `Build` de `proofs.md` roda `npm run build` sem grep; rodado à mão em `a239bbd`: 0 ocorrências (hoje correto) | acrescentar ao proof de C41 `npm run build` + o mesmo `grep` com `test $? -eq 1` | `d7bd68b` - proof de C41 agora também empacota com `npm run build` e exige zero `/api/v1` e `chaveAcesso`; verde em `proofs.md` |
