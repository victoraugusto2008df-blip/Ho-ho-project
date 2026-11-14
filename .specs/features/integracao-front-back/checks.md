# Integração front-back, campanhas e Swagger checks

Build: `cd backend && ./mvnw -B -q -DskipTests compile test-compile`; `cd frontend && npm run build`
Run back: `cd backend && ./mvnw -B test -DargLine=-Dnet.bytebuddy.experimental=true -Dsurefire.reportFormat=plain -Dsurefire.useFile=false -Dtest='CampanhaIntegrationTest,NotasHojeIntegrationTest,OpenApiDocsTest,FiscalServiceRegrasTest,DatabaseMigrationTests,FiscalIngestionIntegrationTest,EstacionamentoIntegrationTest'`
Run front: `cd frontend && npx vitest run --reporter=verbose`
Plan: `.specs/features/integracao-front-back/plan.md`

37 checks in 4 slices · 5 one-way doors · 0 open, of which 0 block

## Checks

### S1 - login real e fim dos mocks

**C1** - "Entrar como Consumidor", "Entrar como Lojista" e "Entrar como Admin Shopping" enviam `POST /api/v1/auth/login` com `consumidor@shopping.com`, `lojista@shopping.com` e `admin@shopping.com`, senha `demo123`, e abrem `/consumidor`, `/lojista` e `/shopping` com o token devolvido guardado na sessão (AC 1)
Proof: run front | ✓ INT-01 login real usa o usuário do seed de cada perfil

**C2** - `mockNotasApi.ts`, `mockLojistaApi.ts`, `createNotasApi.ts` e `createLojistaApi.ts` não existem e nenhum arquivo de `frontend/src`, `frontend/vite.config.ts`, `frontend/.env.example`, `frontend/package.json` ou `docker-compose.yml` cita `VITE_AUTH_MOCK`, `VITE_BACKEND_CONSUMIDOR` ou `VITE_BACKEND_LOJISTA` (AC 2)
Proof: `! ls frontend/src/features/consumidor/mockNotasApi.ts frontend/src/features/lojista/mockLojistaApi.ts frontend/src/features/consumidor/createNotasApi.ts frontend/src/features/lojista/createLojistaApi.ts 2>/dev/null | grep -q . && ! grep -rnE "VITE_AUTH_MOCK|VITE_BACKEND_CONSUMIDOR|VITE_BACKEND_LOJISTA|createMockToken|isMockAuth" frontend/src frontend/vite.config.ts frontend/.env.example frontend/package.json docker-compose.yml`

**C3** - Com sessão de consumidor, a Tela 1 montada pela rota chama `/api/v1/notas/hoje` e `/api/v1/beneficios/estacionamento/hoje` com `Authorization: Bearer <token da sessão>` (AC 3)
Proof: run front | ✓ INT-03 a Tela 1 chama o backend com o Bearer da sessão

**C4** - Com sessão de lojista, a Tela 2 montada pela rota chama `/api/v1/analytics/lojista/dashboard` com `Authorization: Bearer <token da sessão>` (AC 3)
Proof: run front | ✓ INT-04 a Tela 2 chama o backend com o Bearer da sessão

**C5** - O proxy de `/api` do Vite aponta para `localhost:8080` por padrão e para `host.docker.internal:8080` no serviço `frontend` do compose (AC 4)
Proof: `grep -q "API_PROXY_TARGET ?? 'http://localhost:8080'" frontend/vite.config.ts && docker compose --env-file .env.example --profile front config | grep -q "API_PROXY_TARGET: http://host.docker.internal:8080"`

### S2 - Tela 1 sobre o backend

**C6** - `POST /api/v1/notas` com a chave da Zara R$ 65,00 responde `201` com `estabelecimento` "Zara Shopping Hub" e `categoria` "Vestuário"; com a do Burger King R$ 95,00, "Burger King" e "Alimentação" (AC 5)
Proof: run back | validNoteCarriesStoreAndCategoryNames -- Time elapsed

**C7** - `GET /api/v1/notas/hoje` responde `200` com `[]` sem notas hoje; com duas notas de hoje, a cadastrada por último vem primeiro; a nota do mesmo cliente emitida ontem, a nota `REJEITADA` de hoje e a nota de hoje de outro cliente ficam fora (AC 6)
Proof: run back | notasHojeListsOnlyTodaysApprovedNotesOfTheClientNewestFirst -- Time elapsed

**C8** - `GET /api/v1/notas/hoje` responde `401` sem token e `403` para LOJISTA e ADMIN_SHOPPING (Surface)
Proof: run back | notasHojeRequiresConsumidor -- Time elapsed

**C9** - A chave de uma nota do seed, ausente do catálogo da SEFAZ simulada, responde `409` `NOTA_DUPLICADA`; uma chave do catálogo responde `201` e depois `409`; uma chave nunca cadastrada e ausente do catálogo responde `404` `CHAVE_NAO_ENCONTRADA` (AC 7)
Proof: run back | registeredKeyReturns409EvenWhenSefazDoesNotKnowIt -- Time elapsed

**C10** - Para uma chave já cadastrada, `FiscalService` rejeita com `NOTA_DUPLICADA` sem chamar o gateway da SEFAZ (AC 7)
Proof: run back | registeredKeyIsRejectedWithoutConsultingSefaz -- Time elapsed

**C11** - `realNotasApi` converte a rejeição do backend em `NegocioError` pelo `code` do corpo: `NOTA_DUPLICADA` (409), `NOTA_EXPIRADA_72H` (422), `LOJA_NAO_CREDENCIADA` (422), `CHAVE_INVALIDA` (400), `CHAVE_NAO_ENCONTRADA` (404); um 500 sem corpo e um 409 com `code` desconhecido não viram `NegocioError` (AC 8)
Proof: run front | ✓ INT-11 converte cada code do backend em erro de negócio e o resto em genérico

**C12** - A Tela 1 mostra, para cada `code`, a mensagem do critério 8, e a mensagem genérica de falha de envio para um erro que não é de negócio (AC 8)
Proof: run front | ✓ INT-12 cada recusa do backend mostra a mensagem própria

**C13** - `realNotasApi` devolve a nota do backend como `chave` = `chaveAcesso`, `valor` = `valorTotal`, com `estabelecimento`, `categoria`, `dataEmissao` e `status`, tanto em `POST /notas` quanto em `GET /notas/hoje`, e envia `{"chaveAcesso": <chave>}` (AC 9)
Proof: run front | ✓ INT-13 traduz a nota do backend para a forma da tela

**C14** - Com uma nota de R$ 65,00 devolvida pelo backend, a Tela 1 mostra "Nota de R$ 65,00 validada." e a lista mostra o estabelecimento, a categoria e o valor (AC 9)
Proof: run front | ✓ INT-14 nota aprovada pelo backend aparece na mensagem e na lista

**C15** - `GET /api/v1/beneficios/estacionamento/hoje` traz `cpfMascarado` `***.456.789-**` para o cliente `…301`, com `voucher` nulo sem voucher, e `voucher.criadoEm` preenchido quando há voucher (AC 10)
Proof: run back | beneficioCarriesMaskedCpfAndVoucherCreationTime -- Time elapsed

**C16** - `realNotasApi` devolve o benefício com `faltante` = `valorFaltante`, `voucher.codigo` e `voucher.qrPayload` = `codigoQr`, `voucher.emitidoEm` = `criadoEm` e `voucher.validoAte` no fechamento do dia (22h de segunda a sábado, 20h no domingo); sem voucher, `voucher` nulo (AC 11)
Proof: run front | ✓ INT-16 traduz o benefício e o voucher do backend

**C17** - "Simular leitura de QR Code" preenche, em ciclo, as chaves de R$ 65,00, R$ 85,00 e R$ 55,00 do catálogo do backend, e volta à primeira (AC 12)
Proof: run front | ✓ INT-17 simular leitura percorre as chaves do catálogo do backend

**C18** - Os botões "Nota duplicada", "Nota com mais de 72h" e "CNPJ fora do shopping" enviam, nessa ordem, a chave do seed `…0000000001`, a chave de 96h `…0000000105` e a chave de CNPJ externo `…0000000106` (AC 13)
Proof: run front | ✓ INT-18 botões do painel enviam as chaves do backend

**C19** - A Tela 1 não mostra "Reiniciar demonstração" (AC 14)
Proof: run front | ✓ INT-19 a Tela 1 não tem reiniciar demonstração

**C20** - O card se chama "Ordem de validação" e lista os 7 itens do critério 15, nessa ordem (AC 15)
Proof: run front | ✓ INT-20 ordem de validação mostra a ordem real do backend

**C34** - `POST /api/v1/notas` com chave malformada segue respondendo `400` `CHAVE_INVALIDA` (Surface)
Proof: run back | malformedChaveReturns400 -- Time elapsed

**C35** - `POST /api/v1/notas` com nota de mais de 72h segue respondendo `422` `NOTA_EXPIRADA_72H` (Surface)
Proof: run back | expiredNoteReturns422 -- Time elapsed

**C36** - `POST /api/v1/notas` responde `401` sem token e `403` para LOJISTA e ADMIN_SHOPPING, sem gravar (Surface)
Proof: run back | postNotasRequiresConsumidor -- Time elapsed

**C37** - `GET /api/v1/beneficios/estacionamento/hoje` segue respondendo `401` sem token e `403` para outros perfis (Surface)
Proof: run back | getHojeEnforcesConsumidorAuthorization -- Time elapsed

### S3 - Tela 2 e campanhas

**C21** - `POST /api/v1/campanhas` de um LOJISTA responde `201` com `id`, `titulo`, `descontoPercentual`, `criterioAlvo`, `publicoAtingido` e `criadoEm`, e grava a linha em `campanhas` com a loja do token mesmo quando o corpo traz outro `lojaId` (AC 16)
Proof: run back | campaignIsSavedForTheTokenStoreAndReturns201 -- Time elapsed

**C22** - `publicoAtingido` conta: última compra há 61 dias → sim; há 59 dias → não; há 90 dias e de novo há 5 dias → não; inativo há 90 dias só em outra loja → não; nota `REJEITADA` há 90 dias → não; loja sem notas → 0 (AC 17)
Proof: run back | publicoCountsOnlyClientsInactiveForMoreThan60DaysAtTheStore -- Time elapsed

**C23** - `titulo` vazio, `descontoPercentual` 0 e 101 e `criterioAlvo` diferente de `INATIVOS_60_DIAS` respondem `400` sem gravar; `descontoPercentual` 1 e 100 respondem `201` (AC 18)
Proof: run back | invalidBodyReturns400AndSavesNothing -- Time elapsed

**C24** - `POST /api/v1/campanhas` responde `401` sem token e `403` para CONSUMIDOR e ADMIN_SHOPPING, sem gravar (AC 19)
Proof: run back | onlyLojistaMayDispatchACampaign -- Time elapsed

**C25** - No banco recém-migrado, o lojista de demonstração obtém `publicoAtingido` 2 (AC 20)
Proof: run back | freshSeedGivesTheDemoStoreAPublicoOf2 -- Time elapsed

**C26** - No banco recém-migrado, `notas_fiscais` tem 17 linhas, todas emitidas antes de hoje (AC 20)
Proof: run back | historicalReceiptsAreSeeded -- Time elapsed

**C27** - "Disparar Cupom 15% OFF" envia `{"titulo":"Cupom 15% OFF","descontoPercentual":15,"criterioAlvo":"INATIVOS_60_DIAS"}` a `POST /api/v1/campanhas` e a Tela 2 mostra a mensagem de sucesso com o `publicoAtingido` devolvido (AC 21)
Proof: run front | ✓ INT-27 disparar campanha chama o backend e mostra o público devolvido

**C28** - `/consumidor` mostra a Tela 1 e `/lojista` mostra a Tela 2 dentro do shell, sem os textos "ORD-07" e "ORD-11" (AC 22)
Proof: run front | ✓ C32 cada portal mostra só a sua tela

### S4 - Swagger

**C29** - `GET /v3/api-docs` sem token responde `200` com `info.title` "Shopping Analytics & Loyalty Hub API", o esquema `bearerAuth` (`http`, `bearer`, `JWT`) e os 6 caminhos do critério 23 (AC 23)
Proof: run back | apiDocsExposeTitleBearerSchemeAndRoutes -- Time elapsed

**C30** - No documento, `POST /api/v1/auth/login` não exige segurança e as operações de `/api/v1/notas`, `/api/v1/notas/hoje`, `/api/v1/beneficios/estacionamento/hoje`, `/api/v1/analytics/lojista/dashboard` e `/api/v1/campanhas` exigem `bearerAuth` (AC 24)
Proof: run back | loginIsPublicAndTheOtherRoutesRequireBearer -- Time elapsed

**C31** - `/swagger-ui.html` sem token redireciona para `/swagger-ui/index.html`, que responde `200` (AC 25)
Proof: run back | swaggerUiIsServedWithoutToken -- Time elapsed

**C32** - `.docs/api/openapi.json` é igual ao documento que `GET /v3/api-docs` gera (AC 26)
Proof: run back | committedContractMatchesTheGeneratedOne -- Time elapsed

**C33** - As suítes completas do backend e do frontend passam (Changes underneath: os testes que afirmavam o modo simulado mudam com a afirmação)
Proof: `cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true`
Proof: `cd frontend && npx vitest run`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `POST /api/v1/notas` statuses (7) | 201 C6 · 400 C34 · 404 C9 · 409 C9 · 422 C35 · 401 C36 · 403 C36 | - |
| `GET /api/v1/notas/hoje` statuses (3) | 200 C7 · 401 C8 · 403 C8 | - |
| `GET /api/v1/beneficios/estacionamento/hoje` statuses (3) | 200 C15 · 401 C37 · 403 C37 | - |
| `POST /api/v1/campanhas` statuses (4) | 201 C21 · 400 C23 · 401 C24 · 403 C24 | - |
| `GET /v3/api-docs` statuses (1) | 200 C29 | - |
| door 1: campos aditivos (4) | `estabelecimento` C6 · `categoria` C6 · `cpfMascarado` C15 · `voucher.criadoEm` C15 | - |
| door 2: contrato de campanhas (2) | corpo e resposta C21 · loja do token C21 | - |
| door 3: seed V3 (2) | público 2 C25 · 17 notas C26 | - |
| door 4: contrato versionado (1) | C32 | - |
| door 5: `code` lido pelo front (5) | `NOTA_DUPLICADA` C11 · `NOTA_EXPIRADA_72H` C11 · `LOJA_NAO_CREDENCIADA` C11 · `CHAVE_INVALIDA` C11 · `CHAVE_NAO_ENCONTRADA` C11 | - |
| AC 6, notas de hoje (5 exemplos) | vazio C7 · ontem C7 · outro cliente C7 · rejeitada C7 · ordem C7 | - |
| AC 7, duplicidade (3 exemplos) | seed fora do catálogo C9 · catálogo duas vezes C9 · inédita fora do catálogo C9 | - |
| AC 17, público (6 exemplos) | 61 dias C22 · 59 dias C22 · 90 e 5 dias C22 · outra loja C22 · rejeitada C22 · loja sem notas C22 | - |
| AC 18, corpo inválido (6 exemplos) | título vazio C23 · 0 C23 · 101 C23 · 1 C23 · 100 C23 · critério desconhecido C23 | - |
| entidades gravadas (2) | `NotaFiscal` C6, C7 · `Campanha` C21 | - |
| perfis do login (3) | CONSUMIDOR C1 · LOJISTA C1 · ADMIN_SHOPPING C1 | - |
| controles da Tela 1 que mudam (5) | "Simular leitura de QR Code" C17 · "Nota duplicada" C18 · "Nota com mais de 72h" C18 · "CNPJ fora do shopping" C18 · "Reiniciar demonstração" (removido) C19 | - |
| controles da Tela 2 que mudam (1) | "Disparar Cupom 15% OFF" C27 | - |
| startup config: cliente HTTP das telas (2 montagens) | rota `/consumidor` C3 · rota `/lojista` C4 | - |

## Swept

- validation: C23 (corpo da campanha), C9 (chave), existing - `FiscalIngestionIntegrationTest#malformedChaveReturns400`
- failure modes: C12 (erro técnico mostra a mensagem genérica), C23 (400 não grava)
- idempotency: C9 - reenviar a mesma chave não grava duas vezes; a campanha não é idempotente por decisão do card (cada clique é uma campanha)
- authorization: C8, C24, C21 (loja do token)
- concurrency: existing - a constraint `uk_notas_fiscais_chave_acesso` segue como rede para dois envios simultâneos (`FiscalServiceRegrasTest#duplicateKeyIsRejectedWith409AndPublishesNothing`)
- data lifecycle: C26 (seed V3), C7 (o que foi cadastrado volta na lista)
- dependency failure: C12 - backend fora do ar cai na mensagem genérica; estados de erro e "Tentar novamente" das telas já existem (ORD-07 C12/C25, ORD-11 C22)
- state transitions: n/a - nenhuma entidade muda de estado neste plano
- observability: n/a - o pedido não traz requisito de log

## Handoff

- **Settled mid-build:** none
- **Dispatched:** none
- **Boundary:** none
- **Abandoned:** none
- **Walked:** none
