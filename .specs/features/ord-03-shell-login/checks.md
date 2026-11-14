# ORD-03 - Shell da Aplicação, Rotas & Login "Acesso Rápido" - checks

Build: `cd frontend && npm run build`
Run unit: `cd frontend && NO_COLOR=1 npx vitest run --reporter=verbose`
Plan: `.specs/features/ord-03-shell-login/plan.md`

42 checks em 6 slices · 7 one-way doors · 2 open, das quais 1 blocks go-live (credenciais dos seeds)

## Checks

### S1 - Acesso rápido

**C1** - Em `/acesso` sem sessão aparecem exatamente 3 botões: "Entrar como Consumidor", "Entrar como Lojista", "Entrar como Admin Shopping" (AC 1)
Proof: run unit | ✓ C1 mostra os 3 botões de acesso rápido

**C2** - Clicar em cada botão envia `POST /api/v1/auth/login` com o corpo `{"email","senha"}` de `DEMO_USERS[role]` e, no `200`, abre a rota do perfil com a sessão daquele `role`; table-driven nos 3: Consumidor → `/consumidor`, Lojista → `/lojista`, Admin Shopping → `/shopping` (AC 2)
Proof: run unit | ✓ C2 cada botão autentica o seu perfil e abre a sua rota

**C3** - Com o login pendente, os 3 botões ficam `disabled` e o clicado mostra "Entrando…"; um segundo clique não dispara segunda requisição (AC 3)
Proof: run unit | ✓ C3 desabilita os 3 botões enquanto o login está pendente

**C4** - Login com `401` mostra "Credenciais de demonstração inválidas.", reabilita os 3 botões e não grava `hoho.session` (AC 4)
Proof: run unit | ✓ C4 login 401 mostra erro e não cria sessão

**C5** - Falha de rede mostra "Não foi possível conectar ao servidor." e `500` mostra "Erro no servidor. Tente novamente.", ambos sem criar sessão e com os botões reabilitados (AC 4)
Proof: run unit | ✓ C5 falha de rede e 500 mostram a mensagem de cada caso

**C6** - `decodeSession` rejeita `role: "ADMIN"`, rejeita token sem `exp` e aceita `role: "LOJISTA"` com `exp` futuro (AC 5)
Proof: run unit | ✓ C6 decodeSession valida role e exp

**C7** - Um `200` cujo token não passa em `decodeSession` mostra "Resposta de login inválida." e não grava `hoho.session` (AC 5)
Proof: run unit | ✓ C7 token inválido no login mostra resposta de login inválida

**C8** - Abrir `/acesso` com sessão válida de `LOJISTA` redireciona para `/lojista` (AC 6)
Proof: run unit | ✓ C8 acesso com sessão válida redireciona para a rota do perfil

**C9** - `/acesso?motivo=expirado` mostra "Sua sessão expirou. Entre novamente." e `/acesso` sem o parâmetro não mostra (AC 7)
Proof: run unit | ✓ C9 mostra o aviso de sessão expirada só com motivo=expirado

### S2 - Rotas por perfil

**C10** - Sem sessão, `/consumidor`, `/lojista` e `/shopping` redirecionam para `/acesso`; table-driven nas 3 (AC 8)
Proof: run unit | ✓ C10 rotas de portal sem sessão redirecionam para acesso

**C11** - Com sessão de um perfil, a rota de outro perfil redireciona para a rota do próprio; table-driven nas 6 combinações, incluindo `CONSUMIDOR`→`/lojista`→`/consumidor`, `LOJISTA`→`/shopping`→`/lojista`, `ADMIN_SHOPPING`→`/consumidor`→`/shopping` (AC 9)
Proof: run unit | ✓ C11 perfil errado redireciona para a rota do próprio perfil

**C12** - `/` e `/nao-existe` levam à rota do perfil com sessão e a `/acesso` sem sessão; table-driven nos 4 casos (AC 10)
Proof: run unit | ✓ C12 raiz e rota inexistente redirecionam conforme a sessão

**C13** - Com `hoho.session` de `exp` = agora − 1s ou com token `"lixo"`, abrir `/lojista` apaga `hoho.session` e leva a `/acesso?motivo=expirado`; com `exp` = agora + 60s, `/lojista` abre (AC 11)
Proof: run unit | ✓ C13 token vencido ou ilegível apaga a sessão e volta ao acesso

**C14** - Remontar o app em `/lojista` com `hoho.session` válido (simulação do F5) mantém `/lojista` e o mesmo `role`, sem nova requisição de login (AC 12)
Proof: run unit | ✓ C14 sessão sobrevive à remontagem do app

**C15** - O login grava em `sessionStorage['hoho.session']` exatamente `{"token":"<jwt>"}` e não grava nada em `localStorage` (AC 12, door 2)
Proof: run unit | ✓ C15 grava só o token em sessionStorage

### S3 - Cliente HTTP autenticado

**C16** - Com sessão, `apiFetch` envia `Authorization: Bearer <token>`; sem sessão, a requisição sai sem o header `Authorization` (AC 13)
Proof: run unit | ✓ C16 apiFetch injeta Bearer só com sessão

**C17** - `apiFetch('/notas')` requisita `/api/v1/notas` (AC 14)
Proof: run unit | ✓ C17 apiFetch prefixa /api/v1

**C18** - `401` em `apiFetch('/beneficios/estacionamento/hoje')` com sessão apaga `hoho.session`, rejeita com `ApiError` de `status` `401`, dispara `hoho:unauthorized`, e o app montado navega para `/acesso?motivo=expirado` (AC 15)
Proof: run unit | ✓ C18 401 da API encerra a sessão e volta ao acesso expirado

**C19** - `401` do próprio `POST /auth/login` não dispara `hoho:unauthorized` e não navega: fica em `/acesso` com a mensagem de C4 (AC 15)
Proof: run unit | ✓ C19 401 do login não dispara o fluxo de sessão expirada

**C20** - `403` rejeita com `ApiError` de `status` `403`, mantém `hoho.session` e a rota atual (AC 16)
Proof: run unit | ✓ C20 403 mantém a sessão e a rota

**C21** - Uma resposta não-2xx com corpo JSON rejeita com `ApiError` cujo `body` é o JSON recebido; um `2xx` resolve com o JSON parseado (door 1)
Proof: run unit | ✓ C21 apiFetch expõe status e body no ApiError

### S4 - Shell e troca de perfil

**C22** - O shell do Consumidor em 1280px bate com `.specs/features/ord-03-shell-login/captures/figura1-consumidor-desktop.png` na barra do topo (AC 17)
Proof: browser - abrir `/consumidor` como `CONSUMIDOR` em janela 1280 de largura, salvar `.specs/features/ord-03-shell-login/captures/figura1-consumidor-desktop.running.png`

**C23** - O shell do Consumidor em largura de celular bate com `.specs/features/ord-03-shell-login/captures/figura2-consumidor-mobile.png` na barra do topo (AC 17)
Proof: browser - abrir `/consumidor` como `CONSUMIDOR` na largura da captura, salvar `.specs/features/ord-03-shell-login/captures/figura2-consumidor-mobile.running.png`

**C24** - O shell do Lojista bate com `.specs/features/ord-03-shell-login/captures/figura3-portal-lojista.png` na sidebar (AC 18)
Proof: browser - abrir `/lojista` como `LOJISTA` em janela 1317 de largura, salvar `.specs/features/ord-03-shell-login/captures/figura3-portal-lojista.running.png`

**C25** - O shell do Shopping bate com `.specs/features/ord-03-shell-login/captures/figura4-portal-shopping.png` na sidebar (AC 18)
Proof: browser - abrir `/shopping` como `ADMIN_SHOPPING` em janela 1373 de largura, salvar `.specs/features/ord-03-shell-login/captures/figura4-portal-shopping.running.png`

**C26** - Clicar em "1 · Consumidor", "2 · Lojista" ou "3 · Shopping" em um perfil diferente autentica no perfil alvo e abre a sua rota em 1 clique, e o item do perfil ativo tem `aria-current="page"`; table-driven nos 6 pares de origem/destino, 2 pela barra do Consumidor e 4 pela sidebar B2B (AC 19)
Proof: run unit | ✓ C26 aba de perfil troca de perfil em 1 clique

**C27** - Clicar no item do perfil ativo, na barra e na sidebar, não faz requisição e não muda a rota (AC 19)
Proof: run unit | ✓ C27 clicar no perfil ativo não faz nada

**C28** - Com uma query em cache no perfil A, trocar para o perfil B e, em outro caso, clicar em "Sair" deixam o cache do `queryClient` vazio (AC 20)
Proof: run unit | ✓ C28 troca de perfil e sair esvaziam o cache

**C29** - O rodapé da sidebar mostra o claim `nome` quando existe, `sub` quando não existe, e "Perfil: LOJISTA" / "Perfil: ADMIN_SHOPPING" conforme o `role` (AC 21)
Proof: run unit | ✓ C29 rodapé mostra nome ou sub e o perfil

**C30** - No shell B2B, "Abrir menu" abre a gaveta, e escolher um item, clicar fora ou pressionar Esc a fecha (AC 22)
Proof: run unit | ✓ C30 gaveta abre no menu e fecha por item fora e Esc
Proof: walk - em 375px de largura no `/lojista`, o botão "Abrir menu" aparece e a sidebar fica oculta; em 1280px a sidebar fica fixa e o botão some

**C31** - Clicar em "Sair" apaga `hoho.session`, esvazia o cache e abre `/acesso` sem "Sua sessão expirou. Entre novamente."; vale na barra do Consumidor e na sidebar B2B (AC 23)
Proof: run unit | ✓ C31 sair encerra a sessão e abre o acesso sem aviso

**C32** - `/consumidor`, `/lojista` e `/shopping` mostram na área de conteúdo o placeholder com `ORD-07`, `ORD-11` e `ORD-12`, respectivamente; table-driven nas 3 (AC 24)
Proof: run unit | ✓ C32 cada portal mostra o placeholder do seu card

**C33** - Uma rota B2B com `handle.nav = [{label:"Visão geral",to:"/lojista"}]` renderiza o link "Visão geral" na sidebar; sem `handle.nav`, a seção do portal não é renderizada (AC 25, door 5)
Proof: run unit | ✓ C33 sidebar renderiza handle.nav e omite a seção sem ele

**C34** - Percorrer S1 a S4 no navegador com `VITE_AUTH_MOCK=true` não registra erro nem warning no console (AC 26)
Proof: walk - com o DevTools aberto: acesso → os 3 perfis → troca pelas abas e pela sidebar → gaveta em 375px → Sair → token adulterado → acesso expirado; console sem erro nem warning

**C35** - Os arquivos que o card cria em `frontend/src/` não têm cor hexadecimal literal nem emoji, e nenhum importa ícone de biblioteca que não seja `lucide-react` (AC 27)
Proof: `cd frontend && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' src/app src/features src/pages src/lib/api.ts src/lib/jwt.ts; test $? -eq 1; } && { LC_ALL=C.UTF-8 grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' src/app src/features src/pages src/lib/api.ts src/lib/jwt.ts; test $? -eq 1; } && { grep -rnE "from '(react-icons|@heroicons/|@mui/icons-material|@fortawesome/)" src; test $? -eq 1; }`

**C36** - Os botões "Entrar como …" (3), "Sair" e "Abrir menu" são instâncias do `Button` de `src/components/ui/Button.tsx`: com o módulo espionado, as 5 rotulagens aparecem como `children` do `Button` (AC 28)
Proof: run unit | ✓ C36 controles do shell e do acesso usam o primitivo Button

**C42** - Depois de uma troca de perfil recusada (alerta "Credenciais de demonstração inválidas."), clicar em "Sair" abre `/acesso` sem nenhum alerta, e um `401` da API abre `/acesso?motivo=expirado` só com o aviso de expiração e sem o alerta antigo (AC 23, AC 15 - achado do Verifier)
Proof: run unit | ✓ C42 sair e expiração limpam o erro de troca de perfil

**C40** - Com uma troca de perfil pendente no shell, os 3 itens de perfil (barra ou sidebar) ficam `disabled`, e um segundo clique em outro perfil não dispara segunda requisição (AC 3, AC 19)
Proof: run unit | ✓ C40 itens de perfil do shell ficam desabilitados durante a troca

### S5 - Modo mock até o ORD-02

**C37** - Com `VITE_AUTH_MOCK=true`, clicar em cada um dos 3 botões cria a sessão daquele `role` com `exp` = agora + 8h (relógio fixo) e zero chamadas a `fetch`; table-driven nos 3 (AC 29)
Proof: run unit | ✓ C37 modo mock cria sessão sem rede com exp de 8h

**C38** - Com `VITE_AUTH_MOCK` ausente, `"false"` e `"TRUE"`, o login chama `fetch` em `/api/v1/auth/login`; table-driven nos 3 (AC 30)
Proof: run unit | ✓ C38 sem a flag exata true o login usa a rede

### S6 - Documentação de arquitetura

**C39** - `.docs/architecture/architecture-and-domain.md` cita `src/lib/api.ts`, `src/features/auth/` e `src/app/router.tsx`, e não contém mais "Placeholder da fundação" (AC 31)
Proof: `grep -q 'src/lib/api.ts' .docs/architecture/architecture-and-domain.md && grep -q 'src/features/auth/' .docs/architecture/architecture-and-domain.md && grep -q 'src/app/router.tsx' .docs/architecture/architecture-and-domain.md && ! grep -q 'Placeholder da fundação' .docs/architecture/architecture-and-domain.md`

**C41** - `frontend/package.json` tem `"test": "vitest run"` e mantém `react` em `^18.3.1` (door 6, ADR-07)
Proof: `cd frontend && node -e "const p=require('./package.json');process.exit(p.scripts.test==='vitest run'&&p.dependencies.react==='^18.3.1'?0:1)"`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /acesso` statuses (2) | `200` C1 · redirect com sessão C8 | - |
| `GET /consumidor` statuses (3) | `200` C2 · `302` sem sessão C10 · `302` outro perfil C11 | - |
| `GET /lojista` statuses (3) | `200` C2 · `302` sem sessão C10 · `302` outro perfil C11 | - |
| `GET /shopping` statuses (3) | `200` C2 · `302` sem sessão C10 · `302` outro perfil C11 | - |
| `GET /` e qualquer outra rota statuses (2) | `200` para a rota do perfil C12 · `200` para `/acesso` C12 | - |
| botões de acesso, AC 2 (3) | Consumidor C2 · Lojista C2 · Admin Shopping C2 | - |
| erros do login, AC 4 (3) | `401` C4 · rede C5 · `500` C5 | - |
| exemplos de `decodeSession`, AC 5 (3) | `role: "ADMIN"` C6 · sem `exp` C6 · `LOJISTA` com `exp` futuro C6 | - |
| perfil × rota alheia, AC 9 (6) | C11, table-driven nas 6 | - |
| exemplos de expiração, AC 11 (3) | agora − 1s C13 · agora + 60s C13 · `"lixo"` C13 | - |
| `apiFetch` por status (4) | `2xx` C21 · `401` C18 · `401` do login C19 · `403` C20 | - |
| source controls: barra do Consumidor, figuras 1 e 2 (3) | `1 · Consumidor` C27 · `2 · Lojista` C26 · `3 · Shopping` C26 | - |
| source controls: sidebar B2B, figuras 3 e 4 (3) | `1 · Consumidor` C26 · `2 · Lojista` C26 C27 · `3 · Shopping` C26 C27 | - |
| controles acrescentados por AD-005 e AD-006 (2) | "Abrir menu" C30 · "Sair" C31 | - |
| captures (4) | figura1 C22 · figura2 C23 · figura3 C24 · figura4 C25 | - |
| rodapé, AC 21 (4) | `nome` C29 · `sub` C29 · "Perfil: LOJISTA" C29 · "Perfil: ADMIN_SHOPPING" C29 | - |
| fechamento da gaveta, AC 22 (3) | item C30 · clique fora C30 · Esc C30 | - |
| placeholders, AC 24 (3) | `ORD-07` C32 · `ORD-11` C32 · `ORD-12` C32 | - |
| regras de ouro, AC 27 (3) | hex C35 · emoji C35 · ícones `lucide-react` C35 | - |
| primitivo `Button`, AC 28 (5) | "Entrar como Consumidor" C36 · "Entrar como Lojista" C36 · "Entrar como Admin Shopping" C36 · "Sair" C36 · "Abrir menu" C36 | - |
| valores de `VITE_AUTH_MOCK`, AC 29-30 (4) | `true` C37 · ausente C38 · `"false"` C38 · `"TRUE"` C38 | - |
| transições da sessão (7) | Anonimo→Autenticando C2 · Autenticando→Autenticado C2 · Autenticando→Anonimo C4 C5 C7 · Autenticado→Autenticando C26 · Autenticado→Expirado C13 C18 · Autenticado→Anonimo C31 · Expirado→Anonimo C9 C13 | - |
| one-way doors (7) | 1 `apiFetch` C16 C17 C21 · 2 `hoho.session` C15 · 3 mock C37 · 4 contrato de login C2 C6 · 5 `handle.nav` C33 · 6 runner C41 · 7 URLs C2 C10 | - |
| startup config: router + `AuthProvider` (2 assemblies) | `main.tsx` com `createBrowserRouter(routes)` C34 · harness de teste com `createMemoryRouter(routes)` C2 | - |

- Claims naming a status code, route or response shape: C2, C4, C5, C8, C10-C13, C16-C21 - cada prova atravessa `apiFetch` com `fetch` simulado ou monta o router
- C30 e C34 dependem de largura e do console real, que o jsdom não reproduz: por isso levam `walk`

## Swept

- validation: C6, C7, C13
- failure modes: C4, C5
- idempotency: C3, C27, C40
- authorization: C10, C11 - o guard é só UX; a autorização real é do ORD-02 (`@PreAuthorize`), fora deste card
- concurrency: C3, C40 - cliques concorrentes durante um login pendente
- data lifecycle: C13, C15, C28, C31, C42
- dependency failure: C5, C38
- state transitions: C2, C4, C13, C18, C26, C31
- observability: n/a - SPA sem requisito de log ou métrica; o console limpo é C34

## Handoff

- **Settled mid-build:** selo B2B - user: "Faixa no topo do conteúdo"; iniciais - user: "Faça o que não fere o escopo da issue"; `.vscode/` - user: "Ignorar no .gitignore local"
- **Dispatched:** Verifier round 1 at `714e1cc` (diff `20d261b..714e1cc`); screens round 1 at `714e1cc` (figuras 1-4) - both returned; fix pass `c76d8c9`, `91eba26`; screens round 2 at `91eba26` (resumed) - returned, 4 matches (figura2 retaken at 232×1600 and re-judged: matches); Verifier resumed for C42 - returned, PASS
- **Boundary:** C1-C21, C26-C33, C35-C41 closed at `HEAD`; C22-C25 and C34 await the screens round and the gate
- **Abandoned:** `localStorage` global do Node 26 vem indefinido sob o jsdom (reposto em `src/test/setup.ts`, para o C15 poder afirmar que nada vai para lá); o `Request` do Node rejeita o `AbortSignal` do jsdom ao navegar (o setup descarta o sinal nos testes)
- **Walked:** com `VITE_AUTH_MOCK=true` e `npm run dev` (Vite em `127.0.0.1:5173`), no Chrome 1280px: `/acesso` → "Entrar como Consumidor" → `/consumidor`; abas `2 · Lojista` (barra) → `/lojista`, `3 · Shopping` e `1 · Consumidor` (sidebar) → `/shopping` e `/consumidor`; o Consumidor abre `/lojista` e volta a `/consumidor`; "Sair" → `/acesso` sem aviso; `hoho.session` com token `lixo` e `/shopping` → `/acesso?motivo=expirado` com o aviso. Em 375px, `/lojista`: sidebar oculta e botão "Abrir menu" visível; o botão abre a gaveta e Esc a fecha; em 1280px a sidebar fica fixa e o botão some. Console sem erro nem aviso em todo o percurso (o 404 de `favicon.ico` apareceu na primeira rodada e foi corrigido). As imagens `*.running.png` ficaram em `captures/`; a janela do `figura2` foi 390px (a captura é a página inteira reduzida a 232px).
