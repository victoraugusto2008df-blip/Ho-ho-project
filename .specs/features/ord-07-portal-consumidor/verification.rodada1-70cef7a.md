# ORD-07 - Tela 1: Portal do Consumidor verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 70cef7a
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | browser - `captures/figura1-consumidor-desktop.running.png` | yes - quadro de celular à esquerda, "Painel do protótipo" e "Ordem de validação (mock do backend)" à direita, voucher, formulário e notas de hoje como na captura; faltam só a barra do topo, o rodapé do shell e "OUTROS CENÁRIOS" (Differences, Confirmed y) |
| C2 | browser - `captures/figura2-consumidor-mobile.running.png` + walk (`scrollWidth` = `clientWidth` = 390, ordem dos 7 blocos) | yes - coluna única na ordem da captura: cabeçalho, progresso, voucher, formulário, notas, painel, ordem de validação |
| C3 | shell - `grep` de hex, `grep -P` de emoji e `grep` de imports de `react-icons`/`@heroicons/`/`@mui/icons-material`/`@fortawesome/` | parcial - hex e emoji valem para `src/features/consumidor` e `App.tsx`; ícones são uma lista negra de 4 bibliotecas, não "só `lucide-react`", e o card também cria `src/test/setup.ts`, fora do grep (hoje limpo) |
| C4 | `PortalConsumidor.test.tsx` `C4 todo valor em reais, percentual e contador usa tabular-nums` | no - o contador renderiza 3 nós de texto (`"0"`, `"/"`, `"44"`), nenhum casa com `\d+\/44`; tirar `tabular-nums` do contador não reprova o teste |
| C5 | `primitivos.test.tsx` `C5 controles pílulas e blocos usam Button Badge e Card` | yes |
| C6 | walk - percurso S1 a S5 com puppeteer em 1280px, console sem erro nem warning | yes - o percurso descrito passa pelos 3 envios, os 3 erros do painel, CPF inválido, LGPD desmarcada e "Reiniciar demonstração" |
| C7 | `PortalConsumidor.test.tsx` `C7 progresso mostra acumulado CPF e barra limitada a 0-100` | yes |
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
| C19 | `PortalConsumidor.test.tsx` `C19 envio aprovado limpa a chave e atualiza lista e progresso` | yes |
| C20 | `PortalConsumidor.test.tsx` `C20 cada recusa de negócio mostra a regra e a mensagem própria` | parcial - pílula, mensagem e chave mantida valem; "não altera lista nem acumulado" é afirmado logo após o alerta, antes do refetch do `onSettled`, então no último caso (`LOJA_NAO_CREDENCIADA`) uma lista alterada passaria |
| C21 | `PortalConsumidor.test.tsx` `C21 falha técnica mostra a mensagem genérica e mantém a chave` | yes |
| C22 | `PortalConsumidor.test.tsx` `C22 editar a chave apaga a mensagem anterior` | yes |
| C23 | `PortalConsumidor.test.tsx` `C23 lista ordena da mais recente e soma no cabeçalho` | yes |
| C24 | `PortalConsumidor.test.tsx` `C24 lista vazia mostra o estado vazio` | yes |
| C25 | `PortalConsumidor.test.tsx` `C25 lista tem estado de carregando erro e tentar novamente` | yes |
| C26 | `PortalConsumidor.test.tsx` `C26 botões do painel enviam a chave de cada erro` | yes |
| C27 | `PortalConsumidor.test.tsx` `C27 reiniciar zera a demonstração e o ciclo de chaves` | yes |
| C28 | `PortalConsumidor.test.tsx` `C28 ordem de validação mostra os 7 itens da captura` | yes |
| C29 | `PortalConsumidor.test.tsx` `C29 backend real esconde reiniciar e o rodapé do mock` | yes |
| C30 | `consumidor.test.ts` `C30 backend real chama as 3 rotas do contrato pelo fetcher` | yes |
| C31 | `consumidor.test.ts` `C31 backend real converte 409 e 422 em erro de negócio e o resto em genérico` | yes |
| C32 | `consumidor.test.ts` `C32 só a flag exata true liga o backend real` | yes |
| C33 | `consumidor.test.ts` `C33 percentual e faltante da meta respeitam os limites` | yes |
| C34 | `consumidor.test.ts` `C34 chaves de demonstração têm 44 dígitos e são distintas` | yes |
| C35 | `consumidor.test.ts` `C35 mock recusa cada caso de negócio sem tocar no acumulado` | yes |
| C36 | `consumidor.test.ts` `C36 mock libera um único voucher ao atingir a meta` | yes |
| C37 | `consumidor.test.ts` `C37 mock devolve notas e benefício na forma do contrato` | yes |
| C38 | `consumidor.test.ts` `C38 valores em reais saem no formato brasileiro` | yes |
| C39 | shell - `node -e` sobre `frontend/package.json` | yes |
| C40 | `PortalConsumidor.test.tsx` `C40 App renderiza a Tela 1 no lugar da vitrine` | yes |

Exemplos próprios, rodados em `70cef7a` como teste descartável (apagado, não commitado), todos verdes: CPF "123.456.789-09" e "111.444.777-35" aceitos, "000.000.000-00", 12 dígitos e vazio recusados (AC 14); 3 notas de 0,10 + 0,20 + 59,86 → "3 notas · R$ 60,16" na ordem da emissão, 1 nota de 1420 → "1 nota · R$ 1.420,00" (AC 21); `percentual` 100 e 101 → barra 100% com "Meta atingida!", 99.5 → 99.5% com "Faltam" (AC 6/7); `validoAte` na virada do ano → "01/01, 20:00 (fechamento)" e mesmo dia/mês de outro ano → "31/12, 22:00 (fechamento)" (AC 8); `400` + `NOTA_DUPLICADA` e `409` com corpo string → erro genérico (AC 29); colar 50 dígitos com traço → 44 (AC 11).

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| C4 não prova `tabular-nums` no contador "<n>/44": o teste passa mesmo sem a classe nele | `PortalConsumidor.test.tsx:71` filtra nós de texto com `\d+\/44`, mas `FormularioNota.tsx:61` renderiza `{cadastro.chave.length}/{TAMANHO_CHAVE}` como 3 nós (`"0"`, `"/"`, `"44"`, confirmado em teste descartável); o mesmo vale para qualquer valor partido em nós | afirmar `tabular-nums` no elemento (`getByTestId('contador-chave').closest('.tabular-nums')`) ou testar o `textContent` dos elementos em vez dos nós de texto | `9ba30d7` - C4 verifica o texto próprio de cada elemento e exige "0/44"; mutante sem a classe no contador reprova |
| C20 afirma "não altera lista nem acumulado" antes do refetch, então o último caso da tabela passaria com a lista alterada | `PortalConsumidor.test.tsx:309-314`: o alerta aparece no `onError`, antes das invalidações do `onSettled` (`hooks.tsx:79`) resolverem; o `waitFor` de comprimento 1 passa na primeira tentativa com a lista antiga, e só a iteração seguinte pegaria uma nota a mais | esperar o refetch terminar (ex.: `await waitFor(() => expect(api.listarNotasHoje/beneficioHoje).toHaveBeenCalledTimes(n))` ou `queryClient.isFetching() === 0`) antes de afirmar lista e acumulado | `9ba30d7` - C20 espera `isFetching() + isMutating() === 0` antes de conferir lista e acumulado |
| C3 é mais frouxo que o AC 3: "ícones só de `lucide-react`" vira uma lista negra de 4 bibliotecas, e o grep de hex/emoji não cobre `src/test/setup.ts`, que o card cria em `frontend/src/` | proof de C3 em `checks.md`; `git diff --stat 238c2cf..70cef7a -- frontend/src` lista `frontend/src/test/setup.ts` | trocar a lista negra por uma lista branca (todo import de componente de ícone vem de `lucide-react`) e incluir `src/test/setup.ts` no grep de hex e emoji | `7cb56fe` (C3 verde em `proofs.md`) - proof de C3 em `checks.md` com lista branca de imports (`lucide-react` é o único pacote de ícones aceito) e `src/test/setup.ts` no grep; mutante com `react-icons` reprova |
