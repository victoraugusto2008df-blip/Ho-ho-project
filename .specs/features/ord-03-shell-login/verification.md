# ORD-03 - Shell da Aplicação, Rotas & Login "Acesso Rápido" verification

**Verdict**: PASS
**Proofs**: `proofs.md` at 91eba26
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `src/app/acesso.test.tsx` `C1 mostra os 3 botões de acesso rápido` | yes - `toEqual` sobre o `textContent` de todos os botões da tela, na ordem e em número exato |
| C2 | `src/app/acesso.test.tsx` `C2 cada botão autentica o seu perfil e abre a sua rota` | yes - nos 3 perfis afirma URL, método, corpo `{email, senha}` de `DEMO_USERS[role]`, rota final e `role` gravado |
| C3 | `src/app/acesso.test.tsx` `C3 desabilita os 3 botões enquanto o login está pendente` | yes - "Entrando…", os 3 `disabled` e `fetch` chamado 1 vez após dois cliques extras |
| C4 | `src/app/acesso.test.tsx` `C4 login 401 mostra erro e não cria sessão` | yes |
| C5 | `src/app/acesso.test.tsx` `C5 falha de rede e 500 mostram a mensagem de cada caso` | yes - texto literal de cada caso, sem sessão e botões reabilitados |
| C6 | `src/lib/api.test.ts` `C6 decodeSession valida role e exp` | yes - os 3 exemplos do AC 5 |
| C7 | `src/app/acesso.test.tsx` `C7 token inválido no login mostra resposta de login inválida` | yes - `role: "ADMIN"` e corpo sem `token`, sem `hoho.session` |
| C8 | `src/app/acesso.test.tsx` `C8 acesso com sessão válida redireciona para a rota do perfil` | yes |
| C9 | `src/app/acesso.test.tsx` `C9 mostra o aviso de sessão expirada só com motivo=expirado` | yes - os dois lados (com e sem o parâmetro) |
| C10 | `src/app/mock-and-routes.test.tsx` `C10 rotas de portal sem sessão redirecionam para acesso` | yes - as 3 rotas, caminho exato `/acesso` |
| C11 | `src/app/mock-and-routes.test.tsx` `C11 perfil errado redireciona para a rota do próprio perfil` | yes - as 6 combinações |
| C12 | `src/app/mock-and-routes.test.tsx` `C12 raiz e rota inexistente redirecionam conforme a sessão` | yes - os 4 casos |
| C13 | `src/app/mock-and-routes.test.tsx` `C13 token vencido ou ilegível apaga a sessão e volta ao acesso` | yes - agora − 1s, `"lixo"` e agora + 60s |
| C14 | `src/app/mock-and-routes.test.tsx` `C14 sessão sobrevive à remontagem do app` | yes - rota, "Perfil: LOJISTA" e zero `fetch` na remontagem |
| C15 | `src/app/mock-and-routes.test.tsx` `C15 grava só o token em sessionStorage` | yes - string exata `{"token":...}` e `localStorage.length` 0 |
| C16 | `src/lib/api.test.ts` `C16 apiFetch injeta Bearer só com sessão` | yes |
| C17 | `src/lib/api.test.ts` `C17 apiFetch prefixa /api/v1` | yes |
| C18 | `src/app/mock-and-routes.test.tsx` `C18 401 da API encerra a sessão e volta ao acesso expirado` | yes - `ApiError` 401, evento 1 vez, sessão apagada e rota `/acesso?motivo=expirado` com o aviso |
| C19 | `src/app/acesso.test.tsx` `C19 401 do login não dispara o fluxo de sessão expirada` | yes - prova o caso com sessão (troca no shell a partir de `/lojista`), mais forte que o `/acesso` do texto do claim; o caso sem sessão em `/acesso` fica coberto por C4 |
| C20 | `src/lib/api.test.ts` `C20 403 mantém a sessão e a rota` | no - teste de unidade sem router montado: afirma sessão e ausência do evento, mas nunca a rota atual que o claim fixa |
| C21 | `src/lib/api.test.ts` `C21 apiFetch expõe status e body no ApiError` | yes - `body` igual ao JSON e `2xx` resolve com o JSON |
| C22 | browser - `figura1-consumidor-desktop.running.png` contra `figura1-consumidor-desktop.png` | prova por imagem, julgada pelo sub-agente de telas; fora deste julgamento |
| C23 | browser - `figura2-consumidor-mobile.running.png` contra `figura2-consumidor-mobile.png` | prova por imagem, julgada pelo sub-agente de telas; fora deste julgamento |
| C24 | browser - `figura3-portal-lojista.running.png` contra `figura3-portal-lojista.png` | prova por imagem, julgada pelo sub-agente de telas; rótulos do código ("Portal do Lojista", "Telas do protótipo" em caixa alta por CSS, "2 · Lojista", "Perfil: LOJISTA") batem com a captura |
| C25 | browser - `figura4-portal-shopping.running.png` contra `figura4-portal-shopping.png` | prova por imagem, julgada pelo sub-agente de telas; fora deste julgamento |
| C26 | `src/app/shell.test.tsx` `C26 aba de perfil troca de perfil em 1 clique` | yes - 6 pares, rota, `role` gravado e `aria-current="page"` só no destino |
| C27 | `src/app/shell.test.tsx` `C27 clicar no perfil ativo não faz nada` | yes - barra (Consumidor) e sidebar (Lojista), mock desligado, zero `fetch`, rota e sessão intactas |
| C28 | `src/app/shell.test.tsx` `C28 troca de perfil e sair esvaziam o cache` | yes |
| C29 | `src/app/shell.test.tsx` `C29 rodapé mostra nome ou sub e o perfil` | yes |
| C30 | `src/app/shell.test.tsx` `C30 gaveta abre no menu e fecha por item fora e Esc` + walk em 375px/1280px | yes - abrir e os 3 fechamentos por `data-open`/`aria-expanded`; a largura fica no walk, que não julgo |
| C31 | `src/app/shell.test.tsx` `C31 sair encerra a sessão e abre o acesso sem aviso` | yes - barra e sidebar |
| C32 | `src/app/mock-and-routes.test.tsx` `C32 cada portal mostra o placeholder do seu card` | yes - o próprio código uma vez e os outros ausentes |
| C33 | `src/app/shell.test.tsx` `C33 sidebar renderiza handle.nav e omite a seção sem ele` | yes |
| C34 | walk - percurso S1 a S4 com DevTools e `VITE_AUTH_MOCK=true` | prova por walk; fora deste julgamento |
| C35 | `cd frontend && ! grep -rnE '#[0-9a-fA-F]{3}...' ... && ! grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' ... && ! grep -rnE "from '(react-icons\|...)" src` | no - o `grep -P` de emoji sai com erro (`character value in \x{} or \o{} is too large`, exit 2, visível no próprio `proofs.md`) e o `!` transforma o erro em sucesso; a parte de emoji nunca é verificada |
| C36 | `src/app/design-system.test.tsx` `C36 controles do shell e do acesso usam o primitivo Button` | yes - as 5 rotulagens marcadas pelo `Button` espionado (o "Sair" da barra do Consumidor é o mesmo `LogoutButton`) |
| C37 | `src/app/mock-and-routes.test.tsx` `C37 modo mock cria sessão sem rede com exp de 8h` | yes - relógio fixo, `exp` exato nos 3 perfis, zero `fetch` |
| C38 | `src/app/mock-and-routes.test.tsx` `C38 sem a flag exata true o login usa a rede` | yes - ausente, `"false"` e `"TRUE"` |
| C39 | `grep -q 'src/lib/api.ts' ... && ! grep -q 'Placeholder da fundação' .docs/architecture/architecture-and-domain.md` | yes - e a linha de `src/App.tsx` saiu inteira do §5 |
| C40 | `src/app/shell.test.tsx` `C40 itens de perfil do shell ficam desabilitados durante a troca` | yes - barra e sidebar |
| C41 | `cd frontend && node -e "...p.scripts.test==='vitest run'&&p.dependencies.react==='^18.3.1'..."` | yes |
| C42 | `src/app/shell.test.tsx` `C42 sair e expiração limpam o erro de troca de perfil` | yes - provoca o alerta real (troca com login 401), depois afirma `/acesso` sem `role="alert"` após "Sair" e `/acesso?motivo=expirado` com o aviso (`role="status"`) e sem `alert` após `hoho:unauthorized`; em 714e1cc a metade de "Sair" falhava no meu exemplo próprio, então o teste cai se o `reset()` sair |

Exemplos próprios rodados em `HEAD` (arquivo descartável `frontend/src/zz-verifier-throwaway.test.tsx`, apagado depois): AC 11 com `exp` = agora + 2s (aceito, `/lojista` abre), `exp` = agora exato (expirado), `exp` como string e `role: "lojista"` (rejeitados) - passam; AC 30 com `VITE_AUTH_MOCK` = `" true"` e `"1"` (rede) - passam; AC 14 com `'/notas?page=2'` e 401 sem sessão (sem evento) - passam; 403 com o app montado mantém `/lojista` - passa; erro de troca de perfil seguido de "Sair" - falha (ver Findings).

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| A prova de C35 nunca verifica emoji: o `grep -P` falha no locale da shell e o `!` converte o erro em sucesso | `proofs.md` mostra `grep: character value in \x{} or \o{} is too large`; rodado à mão dá exit 2, e com `LC_ALL=C.UTF-8` o mesmo padrão acha um emoji de teste (o código atual não tem emoji, mas a prova passaria com um) | fixar `LC_ALL=C.UTF-8` no comando (ou trocar por um teste/script que falhe com erro de execução) e distinguir exit 1 de exit 2 | `c76d8c9` - proof de C35 com `LC_ALL=C.UTF-8` e `test $? -eq 1` em cada grep (emoji plantado → exit 1, sem emoji → exit 0) |
| C20 afirma "mantém a rota atual" sem montar o app | `src/lib/api.test.ts:36-50` chama `apiFetch` sem router; só sessão e ausência do evento são afirmadas | montar o app em `/lojista` (como C18), responder 403 e afirmar `currentPath(router)` igual a `/lojista` além da sessão | `c76d8c9` - C20 monta o app em `/lojista`, responde 403 e afirma a rota |
| Erro de uma troca de perfil que falhou continua na tela de acesso depois de "Sair" (regra tocada pelo diff e não nomeada por nenhum check) | exemplo próprio: em `/lojista`, `1 · Consumidor` com login `401` mostra "Credenciais de demonstração inválidas."; clicar "Sair" abre `/acesso` ainda com esse `role="alert"`, para um login que não foi feito ali. `AuthProvider.logout`/`invalidate` não fazem `reset()` da mutation (`loginError` sobrevive à navegação); o mesmo vale para o fluxo de expiração | chamar `loginMutation.reset()` em `logout` e `invalidate` (e no sucesso de outra navegação, se for o caso) e acrescentar um check: erro de troca + "Sair" → `/acesso` sem `alert` | `c76d8c9` - `resetLogin()` em `logout` e `invalidate`; C42 acrescentado (falha sem a correção, passa com ela) |
