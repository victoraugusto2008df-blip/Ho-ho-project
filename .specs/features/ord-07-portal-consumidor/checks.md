# ORD-07 - Tela 1: Portal do Consumidor - checks

Build: `cd frontend && npm run build`
Run unit: `cd frontend && NO_COLOR=1 npx vitest run --reporter=verbose`
Plan: `.specs/features/ord-07-portal-consumidor/plan.md`

41 checks em 6 slices · 5 one-way doors · 2 open, das quais 2 blocks go-live (contrato com o Lucas; integração na rota `/consumidor` depois do ORD-03)

## Checks

### S1 - A tela dos mockups

**C1** - A Tela 1 em janela de 1280px bate com `.specs/features/ord-07-portal-consumidor/captures/figura1-consumidor-desktop.png`, menos a barra do topo, o rodapé do shell e "OUTROS CENÁRIOS" (AC 1)
Proof: browser - abrir `/` com o mock, enviar `VALIDA_60` e `VALIDA_90` para chegar ao estado com voucher, em janela de 1280 de largura, salvar `.specs/features/ord-07-portal-consumidor/captures/figura1-consumidor-desktop.running.png`

**C2** - A Tela 1 em janela de 390px bate com `.specs/features/ord-07-portal-consumidor/captures/figura2-consumidor-mobile.png`, em coluna única na ordem da captura e sem rolagem horizontal (AC 2)
Proof: browser - abrir `/` com o mock, enviar `VALIDA_60` e `VALIDA_90`, em janela de 390 de largura, salvar a página inteira reduzida a 232 de largura em `.specs/features/ord-07-portal-consumidor/captures/figura2-consumidor-mobile.running.png`
Proof: walk - em 390px, `document.documentElement.scrollWidth` é igual a `clientWidth`, e a ordem dos blocos é cabeçalho, progresso, voucher, formulário, notas de hoje, painel, ordem de validação

**C3** - Os arquivos que o card cria ou altera em `frontend/src/` não têm cor hexadecimal literal nem emoji, e nenhum importa ícone de biblioteca que não seja `lucide-react` (AC 3)
Proof: `cd frontend && F="src/features/consumidor src/App.tsx src/test/setup.ts" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' $F; test $? -eq 1; } && { LC_ALL=C.UTF-8 grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' $F; test $? -eq 1; } && { grep -rhoE "from '[^']+'" $F | sort -u | grep -vE "^from '(react|@tanstack/react-query|qrcode\.react|lucide-react|vitest|@testing-library/[a-z-]+|\./[^']+|@/[^']+)'$"; test $? -eq 1; }`

**C4** - Com a tela renderizada no estado com voucher, todo texto que mostra valor em reais ("R$ …"), percentual ou o contador "<n>/44" está num elemento com a classe `tabular-nums` ou dentro de um (AC 3)
Proof: run unit | ✓ C4 todo valor em reais, percentual e contador usa tabular-nums

**C5** - Com os módulos espionados, "Enviar nota", "Simular leitura de QR Code", "Nota duplicada", "Nota com mais de 72h", "CNPJ fora do shopping", "Reiniciar demonstração" e "Tentar novamente" são `children` do `Button`; "Validada", "Pendente · pronto para uso", "ReN01", "ReN02" e "RF03" são `children` do `Badge`; "Seu progresso hoje", "Voucher de estacionamento grátis", "Cadastrar nota fiscal (NFC-e)", "Notas de hoje", "Painel do protótipo" e "Ordem de validação (mock do backend)" ficam dentro de um `Card` (AC 4)
Proof: run unit | ✓ C5 controles pílulas e blocos usam Button Badge e Card

**C6** - Percorrer S1 a S5 no navegador com o mock não registra erro nem warning no console (AC 5)
Proof: walk - com o DevTools aberto: abrir `/` → simular e enviar `VALIDA_60`, `VALIDA_90`, `VALIDA_40` → os 3 erros do painel → CPF inválido → LGPD desmarcada → "Reiniciar demonstração"; console sem erro nem warning

### S2 - Progresso e voucher

**C7** - Com o `beneficioHoje` simulado, "Seu progresso hoje" mostra o `valorAcumulado` em reais, "de R$ 150,00", "CPF <cpfMascarado>" e a barra com `width` igual ao `percentual` limitado a 0-100; table-driven: `percentual` 0 → `0%`, 48 → `48%`, 139 → `100%`, -5 → `0%`; `valorAcumulado` 208.33 → "R$ 208,33" (AC 6)
Proof: run unit | ✓ C7 progresso mostra acumulado CPF e barra limitada a 0-100

**C8** - Com `percentual` < 100 aparece "Faltam R$ <faltante> para liberar seu estacionamento." e com 100 aparece "Meta atingida! Seu estacionamento de hoje está liberado." com o ícone `Check`; table-driven: `faltante` 150 → "Faltam R$ 150,00 para liberar seu estacionamento."; 0.01 → "Faltam R$ 0,01 para liberar seu estacionamento."; `percentual` 100 → "Meta atingida!…", sem "Faltam" (AC 7)
Proof: run unit | ✓ C8 mostra o faltante abaixo da meta e meta atingida em 100

**C9** - Com `voucher` `LIBERADO`, o card "Voucher de estacionamento grátis" mostra "Apresente o QR Code na cancela de saída.", "Pendente · pronto para uso", o QR Code gerado com `value` igual ao `qrPayload`, "Código" com o `codigo`, "Emitido às" com o `HH:mm` de `emitidoEm`, "Válido até", "Economia de R$ 15,00 no estacionamento (valor público da diária)" e "Limite de 1 isenção por CPF por dia. Válido para saída até o fechamento do shopping hoje (seg. a sáb. 22h; dom. 20h)." (AC 8, door 4)
Proof: run unit | ✓ C9 voucher liberado mostra QR do qrPayload código horários e regras

**C10** - Com o relógio fixo em 14/11 às 14:19, `validoAte` hoje às 22:00 vira "Hoje, 22:00 (fechamento)" e amanhã às 20:00 vira "15/11, 20:00 (fechamento)" (AC 8)
Proof: run unit | ✓ C10 validoAte de hoje e de outro dia saem no formato do voucher

**C11** - Com `voucher` `null`, o texto "Voucher de estacionamento grátis" não está na tela (AC 9)
Proof: run unit | ✓ C11 sem voucher o card do voucher não aparece

**C12** - Com o `beneficioHoje` pendente aparece "Carregando seu progresso…" e nenhum valor em reais no card; com ele rejeitado aparecem "Não foi possível carregar seu progresso." e "Tentar novamente", e clicar no botão chama `beneficioHoje` de novo e, resolvido, mostra o acumulado (AC 10)
Proof: run unit | ✓ C12 progresso tem estado de carregando erro e tentar novamente

### S3 - Cadastrar nota

**C13** - O campo "Chave de acesso (44 dígitos)": vazio mostra "0/44"; colar os 44 dígitos de `VALIDA_60` com espaços entre os grupos guarda 44 dígitos e mostra "44/44"; digitar "a" não muda o valor; um 45º dígito é ignorado; o valor exibido vem em grupos de 4 separados por espaço; a dica "Fica impressa abaixo do QR Code do cupom fiscal." aparece (AC 11)
Proof: run unit | ✓ C13 campo da chave aceita só 44 dígitos em grupos de 4 com contador

**C14** - Quatro cliques em "Simular leitura de QR Code" preenchem o campo, em ordem, com `VALIDA_60`, `VALIDA_90`, `VALIDA_40` e `VALIDA_60`, e `enviarNota` não é chamado (AC 12)
Proof: run unit | ✓ C14 simular leitura percorre o ciclo de chaves válidas sem enviar

**C15** - O campo "CPF" abre com "529.982.247-25" e a linha "CPF fictício de teste: 529.982.247-25"; depois de apagar o campo, clicar no CPF da linha o preenche de novo com "529.982.247-25" (AC 13)
Proof: run unit | ✓ C15 CPF abre com o fictício e o link o preenche

**C16** - `cpfValido` aceita "529.982.247-25" e "52998224725" e rejeita "529.982.247-24", "111.111.111-11" e "5299822472"; na tela, enviar com "529.982.247-24" mostra "Informe um CPF válido." e não chama `enviarNota` (AC 14)
Proof: run unit | ✓ C16 CPF com dígito verificador inválido é recusado sem requisição

**C17** - A autorização LGPD abre desmarcada; enviar uma chave válida sem marcá-la mostra "Marque a autorização de uso dos dados (LGPD) para enviar a nota." e não chama `enviarNota` (AC 15)
Proof: run unit | ✓ C17 sem autorização LGPD nada é enviado

**C18** - Enviar com 43 dígitos mostra "A chave precisa ter 44 dígitos numéricos." e não chama `enviarNota` (AC 16)
Proof: run unit | ✓ C18 chave incompleta é recusada sem requisição

**C19** - Com `enviarNota` pendente, "Enviar nota" fica `disabled` e mostra "Enviando…", e um segundo clique não chama `enviarNota` de novo; resolvida a nota de R$ 60,00, o campo da chave fica vazio, aparece "Nota de R$ 60,00 validada." e, sem remontar a tela, "Notas de hoje" passa a ter a nota e "Seu progresso hoje" mostra "R$ 60,00" (AC 17)
Proof: run unit | ✓ C19 envio aprovado limpa a chave e atualiza lista e progresso

**C20** - Com o mock, cada recusa mostra a pílula e a mensagem do código, mantém a chave no campo e não muda a lista nem o acumulado; table-driven: `DUPLICADA` → "ReN01" + "Esta nota já foi cadastrada. Cada nota vale apenas uma vez."; `ANTIGA` → "ReN02" + "Esta nota foi emitida há mais de 72 horas e não pode ser usada."; `LOJA_NAO_CREDENCIADA` → "RF03" + "A loja emissora não participa do programa do shopping." (AC 18)
Proof: run unit | ✓ C20 cada recusa de negócio mostra a regra e a mensagem própria

**C21** - `enviarNota` rejeitado com `TypeError` (rede), com o erro genérico de um `500` e com o de um `codigo` desconhecido mostra "Não foi possível enviar a nota. Tente novamente." e mantém a chave; table-driven nos 3 (AC 19)
Proof: run unit | ✓ C21 falha técnica mostra a mensagem genérica e mantém a chave

**C22** - Depois de uma mensagem de erro e, em outro caso, de uma de sucesso, digitar um dígito na chave remove a mensagem (AC 20)
Proof: run unit | ✓ C22 editar a chave apaga a mensagem anterior

### S4 - Notas de hoje

**C23** - Com notas de 12:59 (R$ 60,00) e 14:15 (R$ 90,00), "Notas de hoje" mostra a de 14:15 acima, cada linha com estabelecimento, "<categoria> · <HH:mm>", valor e "Validada", e o cabeçalho "2 notas · R$ 150,00"; com uma nota de R$ 60,00 o cabeçalho é "1 nota · R$ 60,00" (AC 21)
Proof: run unit | ✓ C23 lista ordena da mais recente e soma no cabeçalho

**C24** - Com a lista vazia aparece "Nenhuma nota enviada hoje. Cadastre a primeira acima." (AC 22)
Proof: run unit | ✓ C24 lista vazia mostra o estado vazio

**C25** - Com `listarNotasHoje` pendente aparece "Carregando suas notas…"; rejeitado, aparecem "Não foi possível carregar suas notas." e "Tentar novamente", e clicar chama `listarNotasHoje` de novo e, resolvido, mostra as notas (AC 23)
Proof: run unit | ✓ C25 lista tem estado de carregando erro e tentar novamente

### S5 - Painel do protótipo

**C26** - Com LGPD marcada, "Nota duplicada", "Nota com mais de 72h" e "CNPJ fora do shopping" preenchem a chave `DUPLICADA`, `ANTIGA` e `LOJA_NAO_CREDENCIADA`, chamam `enviarNota` com ela e mostram a mensagem de `NOTA_DUPLICADA`, `NOTA_ANTIGA` e `LOJA_NAO_CREDENCIADA`; table-driven nos 3; com LGPD desmarcada, "Nota duplicada" mostra a mensagem de C17 e não chama `enviarNota` (AC 24)
Proof: run unit | ✓ C26 botões do painel enviam a chave de cada erro

**C27** - Depois de enviar `VALIDA_60` e `VALIDA_90` (voucher liberado) e de um erro na tela, "Reiniciar demonstração" deixa o campo vazio, sem mensagem, "R$ 0,00", o estado vazio de C24, nenhum voucher, e o próximo "Simular leitura de QR Code" preenche `VALIDA_60` (AC 25)
Proof: run unit | ✓ C27 reiniciar zera a demonstração e o ciclo de chaves

**C28** - O card "Ordem de validação (mock do backend)" mostra, nesta ordem, os 7 itens da captura: "CPF válido + consentimento LGPD (RN04)", "Chave com 44 dígitos e dígito verificador (RF01)", "Chave nunca cadastrada (ReN01)", "Consulta à SEFAZ simulada (RF02)", "CNPJ emissor é lojista ativo (RF03)", "Emitida há no máximo 72h (ReN02)", "Soma do dia ≥ R$ 150 → voucher (ReN03/ReN04)" (AC 26)
Proof: run unit | ✓ C28 ordem de validação mostra os 7 itens da captura

**C29** - Com `VITE_BACKEND_CONSUMIDOR=true`, "Reiniciar demonstração" e "Consulta fiscal simulada (MockSefazGateway)" não aparecem; sem a flag, os dois aparecem (AC 27)
Proof: run unit | ✓ C29 backend real esconde reiniciar e o rodapé do mock

### S6 - Pronto para o backend real

**C30** - A implementação real chama o `fetcher` injetado com `POST /notas` e corpo `{"chaveAcesso":"<44 dígitos>"}`, `GET /notas/hoje` e `GET /beneficios/estacionamento/hoje`, e devolve os corpos da door 1 como `NotaHoje[]` e `BeneficioHoje` (AC 28, door 1, door 2)
Proof: run unit | ✓ C30 backend real chama as 3 rotas do contrato pelo fetcher

**C31** - A implementação real converte a rejeição do `fetcher`; table-driven: `409` + `NOTA_DUPLICADA` → `NegocioError` `NOTA_DUPLICADA`; `422` + `NOTA_ANTIGA` → `NOTA_ANTIGA`; `422` + `LOJA_NAO_CREDENCIADA` → `LOJA_NAO_CREDENCIADA`; `422` + `CHAVE_INVALIDA` → `CHAVE_INVALIDA`; `422` + `"OUTRO"` → erro que não é `NegocioError`; `500` sem corpo → erro que não é `NegocioError` (AC 29)
Proof: run unit | ✓ C31 backend real converte 409 e 422 em erro de negócio e o resto em genérico

**C32** - `criarNotasApi` devolve o mock com `VITE_BACKEND_CONSUMIDOR` ausente, `"false"` e `"TRUE"`, e a implementação real com `"true"`; table-driven nos 4 (AC 30)
Proof: run unit | ✓ C32 só a flag exata true liga o backend real

### Mock da demonstração (plan, Shape linha 2)

**C33** - `percentualDaMeta` vai de 0 a 100 (0 → 0, 75 → 50, 150 → 100, 208,33 → 100, -10 → 0) e `faltanteDaMeta` dá 150 com 0, 0,01 com 149,99 e 0 com 208,33 (AC 6, AC 7)
Proof: run unit | ✓ C33 percentual e faltante da meta respeitam os limites

**C42** - Abaixo da meta, `percentualDaMeta` nunca chega a 100: 149,25 → 99 e 149,99 → 99; 150 → 100 e 150,01 → 100 (AC 7, estado `MetaAtingida` - achado do Verifier em `a239bbd`)
Proof: run unit | ✓ C42 abaixo da meta o percentual nunca chega a 100

**C34** - Todas as chaves de `CHAVES_DEMO` (`VALIDA_60`, `VALIDA_90`, `VALIDA_40`, `DUPLICADA`, `ANTIGA`, `LOJA_NAO_CREDENCIADA`) têm 44 dígitos e são distintas (AC 12, AC 24)
Proof: run unit | ✓ C34 chaves de demonstração têm 44 dígitos e são distintas

**C35** - O mock recusa: a mesma chave válida enviada 2 vezes → `NOTA_DUPLICADA`; `DUPLICADA` na primeira vez → `NOTA_DUPLICADA`; `ANTIGA` → `NOTA_ANTIGA`; `LOJA_NAO_CREDENCIADA` → `LOJA_NAO_CREDENCIADA`; 43 dígitos → `CHAVE_INVALIDA`; e nenhuma recusa entra na lista nem no acumulado (AC 18, AC 24)
Proof: run unit | ✓ C35 mock recusa cada caso de negócio sem tocar no acumulado

**C36** - No mock, `VALIDA_60` e `VALIDA_90` somam R$ 150,00, `percentual` 100 e exatamente 1 voucher `LIBERADO`; `VALIDA_40` depois disso leva o acumulado a R$ 190,00 e mantém o mesmo `codigo` de voucher (ReN04); `VALIDA_60` sozinha deixa `voucher` `null` (AC 8, AC 9, AC 17)
Proof: run unit | ✓ C36 mock libera um único voucher ao atingir a meta

**C37** - No mock, cada nota aprovada vem com `status` `APROVADA`, `dataEmissao` ISO de hoje e estabelecimento e categoria não vazios, e `cpfMascarado` é "***.982.247-**" (AC 6, AC 21)
Proof: run unit | ✓ C37 mock devolve notas e benefício na forma do contrato

**C38** - `formatarReais` dá "R$ 208,33" para 208.33, "R$ 0,00" para 0 e "R$ 1.420,00" para 1420 (com o espaço que o `Intl` usa normalizado) (AC 6, AC 21)
Proof: run unit | ✓ C38 valores em reais saem no formato brasileiro

### Portas e montagem

**C39** - `frontend/package.json` tem `"test": "vitest run"`, `vitest` `^3.2.7`, `@testing-library/react` `^16.3.3`, `@testing-library/dom` `^10.4.2`, `@testing-library/user-event` `^14.6.10`, `jsdom` `^31.0.1`, `qrcode.react` `^4.2.0`, e mantém `react` em `^18.3.1` (door 3, door 4)
Proof: `cd frontend && node -e "const p=require('./package.json'),d=p.devDependencies||{},r=p.dependencies||{};const ok=p.scripts.test==='vitest run'&&d.vitest==='^3.2.7'&&d['@testing-library/react']==='^16.3.3'&&d['@testing-library/dom']==='^10.4.2'&&d['@testing-library/user-event']==='^14.6.10'&&d.jsdom==='^31.0.1'&&r['qrcode.react']==='^4.2.0'&&r.react==='^18.3.1';process.exit(ok?0:1)"`

**C41** - O pacote de `npm run build` e o de `npm run build:demo` não contêm `/api/v1` nem `chaveAcesso`, e o de `npm run build:integrado` contém os dois (AC 31, door 5)
Proof: `cd frontend && npm run build >/dev/null 2>&1 && { cat dist/assets/*.js | grep -qE '/api/v1|chaveAcesso'; test $? -eq 1; } && npm run build:demo >/dev/null 2>&1 && { cat dist/assets/*.js | grep -qE '/api/v1|chaveAcesso'; test $? -eq 1; } && npm run build:integrado >/dev/null 2>&1 && cat dist/assets/*.js | grep -q '/api/v1' && cat dist/assets/*.js | grep -q 'chaveAcesso'`

**C40** - Renderizar `App` com um `QueryClientProvider` mostra "Estacionamento grátis" e "Cadastrar nota fiscal (NFC-e)" e não mostra mais "Aguardando implementação" (plan, Changes underneath - readers; AD-010)
Proof: run unit | ✓ C40 App renderiza a Tela 1 no lugar da vitrine

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| captures (2) | figura1 C1 · figura2 C2 | - |
| source controls: Tela 1, figuras 1 e 2 menos Differences (9) | campo "CPF" C15 C16 · link "529.982.247-25" C15 · campo "Chave de acesso (44 dígitos)" C13 · "Simular leitura de QR Code" C14 · autorização LGPD C17 · "Enviar nota" C19 · "Nota duplicada" C26 · "Nota com mais de 72h" C26 · "CNPJ fora do shopping" C26 · "Reiniciar demonstração" C27 | - |
| controles acrescentados fora da captura (1) | "Tentar novamente" C12 C25 | - |
| barra de progresso, AC 6 (5 exemplos) | 0 C7 · 48 C7 · 139 C7 · -5 C7 · 208.33 C7 | - |
| mensagem de progresso, AC 7 (3 exemplos) | 150 C8 · 0.01 C8 · 100 C8 | - |
| campos do voucher, AC 8 (9) | título/instrução C9 · pílula C9 · QR C9 · código C9 · emitido C9 · válido até C9 C10 · economia C9 · limite C9 · formato hoje/outro dia C10 | - |
| estados do benefício, AC 9-10 (4) | carregando C12 · erro C12 · tentar novamente C12 · sem voucher C11 | - |
| campo da chave, AC 11 (5 exemplos) | colar com espaços C13 · "a" C13 · 45º dígito C13 · vazio C13 · grupos de 4 C13 | - |
| ciclo do simulador, AC 12 (4 cliques) | `VALIDA_60` C14 · `VALIDA_90` C14 · `VALIDA_40` C14 · volta a `VALIDA_60` C14 | - |
| CPF, AC 14 (5) | "529.982.247-25" C16 · "52998224725" C16 · "529.982.247-24" C16 · "111.111.111-11" C16 · 10 dígitos C16 | - |
| validações do front sem requisição, AC 14-16 (3) | CPF C16 · LGPD C17 · chave C18 | - |
| recusas de negócio, AC 18 (3) | `NOTA_DUPLICADA` C20 · `NOTA_ANTIGA` C20 · `LOJA_NAO_CREDENCIADA` C20 | - |
| falhas técnicas, AC 19 (3) | rede C21 · `5xx` C21 · `codigo` desconhecido C21 | - |
| lista, AC 21 (2 exemplos) | 1 nota C23 · 2 notas ordenadas C23 | - |
| estados da lista, AC 22-23 (4) | vazio C24 · carregando C25 · erro C25 · tentar novamente C25 | - |
| botões de erro do painel, AC 24 (4) | duplicada C26 · 72h C26 · CNPJ C26 · LGPD desmarcada C26 | - |
| ordem de validação, AC 26 (7) | C28, table-driven nos 7 | - |
| flag `VITE_BACKEND_CONSUMIDOR` (4 valores) | ausente C32 · `"false"` C32 · `"TRUE"` C32 · `"true"` C29 C32 | - |
| rotas do contrato, door 1 (3) | `POST /notas` C30 · `GET /notas/hoje` C30 · `GET /beneficios/estacionamento/hoje` C30 | - |
| statuses de `POST /notas`, door 1 (3) | `201` C30 · `409` C31 · `422` C31 | - |
| erros do `fetcher`, AC 29 (6) | `409` duplicada C31 · `422` antiga C31 · `422` loja C31 · `422` chave C31 · `422` outro C31 · `500` C31 | - |
| one-way doors (5) | 1 contrato C30 C31 · 2 `fetcher` injetado C30 · 3 runner C39 · 4 `qrcode.react` C9 C39 · 5 modos de build C41 | - |
| modos de build, AC 31 (2) | `demo` C41 · `integrado` C41 | - |
| transições da tela (10) | Carregando→Erro C12 · Erro→Carregando C12 · Carregando→SemNotas C24 · Carregando→Acumulando C7 · Carregando→MetaAtingida C9 · SemNotas→Acumulando C19 · Acumulando→Acumulando C36 · SemNotas/Acumulando→MetaAtingida C36 · MetaAtingida→MetaAtingida C36 · Acumulando/MetaAtingida→SemNotas C27 | - |
| regras de ouro, AC 3 (4) | hex C3 · emoji C3 · ícones `lucide-react` C3 · `tabular-nums` C4 | - |
| primitivos, AC 4 (3) | `Button` C5 · `Badge` C5 · `Card` C5 | - |
| startup config: `QueryClientProvider` + `NotasApi` (2 assemblies) | `main.tsx` → `App` C40 C6 · harness de teste com `QueryClient` novo e `NotasApi` simulado C7 | - |

- C1, C2 e C6 dependem de largura real e do console do navegador, que o jsdom não reproduz: por isso levam `browser`/`walk`
- C20, C26 e C27 rodam a tela com o `mockNotasApi` de verdade (reiniciado antes de cada teste); os demais testes de tela injetam um `NotasApi` simulado para controlar pendência e rejeição

## Swept

- validation: C13, C16, C17, C18 - toda validação do front também é provada pela ausência da chamada a `enviarNota`
- failure modes: C12, C21, C25
- idempotency: C19 - clique duplo durante o envio; C35 - a mesma chave duas vezes é recusada
- authorization: n/a - a tela não tem guard nesta branch (AD-010); o guard de rota e o 401 são do ORD-03 (`RequireRole`, `apiFetch`), e a autorização real é do backend
- concurrency: C19 - o botão desabilitado impede o segundo envio; a trava contra dois vouchers sob requisições simultâneas é do banco (`UNIQUE (cliente_id, data_referencia)`, ORD-01) e do ORD-06
- data lifecycle: C19, C27, C36 - o estado da demonstração vive na memória do mock e some no F5 (Assumptions)
- dependency failure: C12, C21, C25, C31
- state transitions: C7, C9, C12, C19, C24, C27, C36
- observability: n/a - SPA sem requisito de log ou métrica; o console limpo é C6

## Handoff

- **Settled mid-build:** plano aprovado - user: "Aprovado, pode seguir para os checks"; modos de build - user: "Faça uma bilud em que a realações com Backend sejam feitas somente após o backend está pronto" (AC 31, door 5, C41); nova verificação depois do round 2 - user: "faça a VERIFY"; LGPD ao abrir - user: "Desmarcada" (AD-015)
- **Dispatched:** Verifier round 1 at `70cef7a` (diff `238c2cf..70cef7a`) - returned, FAIL com 3 achados (C4, C20, C3), fechados em `9ba30d7` e no proof de C3; screens round 1 at `70cef7a` (figuras 1 e 2) - returned, 2 diverges (barra de status; recuo do app no celular), corrigido em `9ba30d7`; screens round 2 at `9ba30d7` (resumed) - returned: figura1 matches, figura2 diverges só em "container do app" (o judge não vê o recuo de 16px medido no navegador: o fundo `--bg-canvas` é quase branco). Depois do round 2, o gate exigiu as figuras no tamanho exato das capturas; a 1280×1600 a tela passava 78px, então `7cb56fe` compactou o espaçamento vertical e as duas figuras foram refeitas em 1280×1600 e 232×1600. Esse commit e a linha que ainda diverge vão para o usuário (não há round 3). O usuário pediu nova verificação ("faça a VERIFY"): relatórios anteriores arquivados em `verification.rodada1-70cef7a.md` e `screens.rodadas1-2-9ba30d7.md`; Verifier novo at `a239bbd` (diff `238c2cf..a239bbd`) - returned, FAIL com 3 achados (percentual 100 abaixo da meta, LGPD marcada na captura, C41 sem `npm run build`), fechados em `d7bd68b` e AD-015; screens round 1 novo at `a239bbd` (figuras 1 e 2) - returned, 2 matches; figuras refeitas em `d7bd68b` e screens round 2 at `d7bd68b` (resumed) - returned, 2 matches
- **Boundary:** C1-C40 closed at `70cef7a` (35 testes Vitest verdes, C3 e C39 com exit 0, `npm run build` verde); C1, C2 e C6 aguardam o screens sub-agent e o gate
- **Abandoned:** ler a flag com `(import.meta as …).env` - o cast impede o Vite/Vitest de substituir `import.meta.env`, e a flag nunca era lida (C29/C32 vermelhos); trocado por `import.meta.env` com `/// <reference types="vite/client" />`, sem criar o `vite-env.d.ts` que o ORD-03 traz
- **Walked:** com `npx vite --host 127.0.0.1 --port 5173` (mock, sem flag), percurso por `puppeteer-core` + Chrome headless (`scratchpad/walk/walk.mjs`). Em 1280px: marcar a autorização LGPD → "Simular leitura de QR Code" + "Enviar nota" duas vezes (R$ 60,00 e R$ 90,00) → voucher aparece; editar a chave apaga a mensagem de sucesso; salvo `captures/figura1-consumidor-desktop.running.png` (1280 de largura, página inteira). Em 390px, o mesmo percurso, salvo `captures/figura2-consumidor-mobile.running.png` com `deviceScaleFactor` 232/390 (232 de largura, como a captura); `scrollWidth` = `clientWidth` = 390 e os 7 blocos na ordem cabeçalho, progresso, voucher, formulário, notas de hoje, painel, ordem de validação (C2). C6: em 1280px, depois do voucher, `VALIDA_40` → "Nota de R$ 40,00 validada." → os 3 botões do painel (mensagens de ReN01, ReN02, RF03) → CPF "529.982.247-24" → "Informe um CPF válido." → link do CPF fictício → LGPD desmarcada → mensagem da LGPD → "Reiniciar demonstração" → "Nenhuma nota enviada hoje."; console sem erro nem warning (a primeira rodada achou o 404 de `favicon.ico`, corrigido em `70cef7a`). Sem internet a fonte Inter não carrega; as capturas usam a fonte do sistema.
