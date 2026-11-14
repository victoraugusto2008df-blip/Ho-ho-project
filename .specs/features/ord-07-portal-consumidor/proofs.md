# ord-07-portal-consumidor proofs

**HEAD**: d7bd68b
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 44 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `browser - abrir / com o mock, enviar VALIDA_60 e VALIDA_90 para chegar ao estado com voucher, em janela de 128` | pass |
| C2 | `browser - abrir / com o mock, enviar VALIDA_60 e VALIDA_90, em janela de 390 de largura, salvar a página intei` | pass |
| C2 | `walk - em 390px, document.documentElement.scrollWidth é igual a clientWidth, e a ordem dos blocos é cabeçalho,` | pass (Walked) |
| C3 | `cd frontend && F="src/features/consumidor src/App.tsx src/test/setup.ts" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a` | pass |
| C4 | `run unit / ✓ C4 todo valor em reais, percentual e contador usa tabular-nums` | pass |
| C5 | `run unit / ✓ C5 controles pílulas e blocos usam Button Badge e Card` | pass |
| C6 | `walk - com o DevTools aberto: abrir / → simular e enviar VALIDA_60, VALIDA_90, VALIDA_40 → os 3 erros do paine` | pass (Walked) |
| C7 | `run unit / ✓ C7 progresso mostra acumulado CPF e barra limitada a 0-100` | pass |
| C8 | `run unit / ✓ C8 mostra o faltante abaixo da meta e meta atingida em 100` | pass |
| C9 | `run unit / ✓ C9 voucher liberado mostra QR do qrPayload código horários e regras` | pass |
| C10 | `run unit / ✓ C10 validoAte de hoje e de outro dia saem no formato do voucher` | pass |
| C11 | `run unit / ✓ C11 sem voucher o card do voucher não aparece` | pass |
| C12 | `run unit / ✓ C12 progresso tem estado de carregando erro e tentar novamente` | pass |
| C13 | `run unit / ✓ C13 campo da chave aceita só 44 dígitos em grupos de 4 com contador` | pass |
| C14 | `run unit / ✓ C14 simular leitura percorre o ciclo de chaves válidas sem enviar` | pass |
| C15 | `run unit / ✓ C15 CPF abre com o fictício e o link o preenche` | pass |
| C16 | `run unit / ✓ C16 CPF com dígito verificador inválido é recusado sem requisição` | pass |
| C17 | `run unit / ✓ C17 sem autorização LGPD nada é enviado` | pass |
| C18 | `run unit / ✓ C18 chave incompleta é recusada sem requisição` | pass |
| C19 | `run unit / ✓ C19 envio aprovado limpa a chave e atualiza lista e progresso` | pass |
| C20 | `run unit / ✓ C20 cada recusa de negócio mostra a regra e a mensagem própria` | pass |
| C21 | `run unit / ✓ C21 falha técnica mostra a mensagem genérica e mantém a chave` | pass |
| C22 | `run unit / ✓ C22 editar a chave apaga a mensagem anterior` | pass |
| C23 | `run unit / ✓ C23 lista ordena da mais recente e soma no cabeçalho` | pass |
| C24 | `run unit / ✓ C24 lista vazia mostra o estado vazio` | pass |
| C25 | `run unit / ✓ C25 lista tem estado de carregando erro e tentar novamente` | pass |
| C26 | `run unit / ✓ C26 botões do painel enviam a chave de cada erro` | pass |
| C27 | `run unit / ✓ C27 reiniciar zera a demonstração e o ciclo de chaves` | pass |
| C28 | `run unit / ✓ C28 ordem de validação mostra os 7 itens da captura` | pass |
| C29 | `run unit / ✓ C29 backend real esconde reiniciar e o rodapé do mock` | pass |
| C30 | `run unit / ✓ C30 backend real chama as 3 rotas do contrato pelo fetcher` | pass |
| C31 | `run unit / ✓ C31 backend real converte 409 e 422 em erro de negócio e o resto em genérico` | pass |
| C32 | `run unit / ✓ C32 só a flag exata true liga o backend real` | pass |
| C33 | `run unit / ✓ C33 percentual e faltante da meta respeitam os limites` | pass |
| C42 | `run unit / ✓ C42 abaixo da meta o percentual nunca chega a 100` | pass |
| C34 | `run unit / ✓ C34 chaves de demonstração têm 44 dígitos e são distintas` | pass |
| C35 | `run unit / ✓ C35 mock recusa cada caso de negócio sem tocar no acumulado` | pass |
| C36 | `run unit / ✓ C36 mock libera um único voucher ao atingir a meta` | pass |
| C37 | `run unit / ✓ C37 mock devolve notas e benefício na forma do contrato` | pass |
| C38 | `run unit / ✓ C38 valores em reais saem no formato brasileiro` | pass |
| C39 | `cd frontend && node -e "const p=require('./package.json'),d=p.devDependencies//{},r=p.dependencies//{};const o` | pass |
| C41 | `cd frontend && npm run build >/dev/null 2>&1 && { cat dist/assets/*.js / grep -qE '/api/v1/chaveAcesso'; test ` | pass |
| C40 | `run unit / ✓ C40 App renderiza a Tela 1 no lugar da vitrine` | pass |
| Build | `cd frontend && npm run build` | pass |

## Output

`Run unit` - exit 0

```
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C21 falha técnica mostra a mensagem genérica e mantém a chave 479ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C22 editar a chave apaga a mensagem anterior 460ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C23 lista ordena da mais recente e soma no cabeçalho 60ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C24 lista vazia mostra o estado vazio 31ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C25 lista tem estado de carregando erro e tentar novamente 107ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C26 botões do painel enviam a chave de cada erro 264ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C27 reiniciar zera a demonstração e o ciclo de chaves 493ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C28 ordem de validação mostra os 7 itens da captura 7ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C29 backend real esconde reiniciar e o rodapé do mock 13ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > montagem > C40 App renderiza a Tela 1 no lugar da vitrine 6ms

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  04:45:25
   Duration  8.59s (transform 326ms, setup 1.02s, collect 2.98s, tests 4.91s, environment 4.59s, prepare 653ms)
```

`cd frontend && F="src/features/consumidor src/App.tsx src/test/setup.ts" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a` - exit 0

```
(no output)
```

`cd frontend && node -e "const p=require('./package.json'),d=p.devDependencies//{},r=p.dependencies//{};const o` - exit 0

```
(no output)
```

`cd frontend && npm run build >/dev/null 2>&1 && { cat dist/assets/*.js / grep -qE '/api/v1/chaveAcesso'; test ` - exit 0

```
(no output)
```
