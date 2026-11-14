# ord-03-shell-login proofs

**HEAD**: 91eba26
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 44 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run unit / ✓ C1 mostra os 3 botões de acesso rápido` | pass |
| C2 | `run unit / ✓ C2 cada botão autentica o seu perfil e abre a sua rota` | pass |
| C3 | `run unit / ✓ C3 desabilita os 3 botões enquanto o login está pendente` | pass |
| C4 | `run unit / ✓ C4 login 401 mostra erro e não cria sessão` | pass |
| C5 | `run unit / ✓ C5 falha de rede e 500 mostram a mensagem de cada caso` | pass |
| C6 | `run unit / ✓ C6 decodeSession valida role e exp` | pass |
| C7 | `run unit / ✓ C7 token inválido no login mostra resposta de login inválida` | pass |
| C8 | `run unit / ✓ C8 acesso com sessão válida redireciona para a rota do perfil` | pass |
| C9 | `run unit / ✓ C9 mostra o aviso de sessão expirada só com motivo=expirado` | pass |
| C10 | `run unit / ✓ C10 rotas de portal sem sessão redirecionam para acesso` | pass |
| C11 | `run unit / ✓ C11 perfil errado redireciona para a rota do próprio perfil` | pass |
| C12 | `run unit / ✓ C12 raiz e rota inexistente redirecionam conforme a sessão` | pass |
| C13 | `run unit / ✓ C13 token vencido ou ilegível apaga a sessão e volta ao acesso` | pass |
| C14 | `run unit / ✓ C14 sessão sobrevive à remontagem do app` | pass |
| C15 | `run unit / ✓ C15 grava só o token em sessionStorage` | pass |
| C16 | `run unit / ✓ C16 apiFetch injeta Bearer só com sessão` | pass |
| C17 | `run unit / ✓ C17 apiFetch prefixa /api/v1` | pass |
| C18 | `run unit / ✓ C18 401 da API encerra a sessão e volta ao acesso expirado` | pass |
| C19 | `run unit / ✓ C19 401 do login não dispara o fluxo de sessão expirada` | pass |
| C20 | `run unit / ✓ C20 403 mantém a sessão e a rota` | pass |
| C21 | `run unit / ✓ C21 apiFetch expõe status e body no ApiError` | pass |
| C22 | `browser - abrir /consumidor como CONSUMIDOR em janela 1280 de largura, salvar .specs/features/ord-03-shell-log` | pass |
| C23 | `browser - abrir /consumidor como CONSUMIDOR na largura da captura, salvar .specs/features/ord-03-shell-login/c` | pass |
| C24 | `browser - abrir /lojista como LOJISTA em janela 1317 de largura, salvar .specs/features/ord-03-shell-login/cap` | pass |
| C25 | `browser - abrir /shopping como ADMIN_SHOPPING em janela 1373 de largura, salvar .specs/features/ord-03-shell-l` | pass |
| C26 | `run unit / ✓ C26 aba de perfil troca de perfil em 1 clique` | pass |
| C27 | `run unit / ✓ C27 clicar no perfil ativo não faz nada` | pass |
| C28 | `run unit / ✓ C28 troca de perfil e sair esvaziam o cache` | pass |
| C29 | `run unit / ✓ C29 rodapé mostra nome ou sub e o perfil` | pass |
| C30 | `run unit / ✓ C30 gaveta abre no menu e fecha por item fora e Esc` | pass |
| C30 | `walk - em 375px de largura no /lojista, o botão "Abrir menu" aparece e a sidebar fica oculta; em 1280px a side` | pass (Walked) |
| C31 | `run unit / ✓ C31 sair encerra a sessão e abre o acesso sem aviso` | pass |
| C32 | `run unit / ✓ C32 cada portal mostra o placeholder do seu card` | pass |
| C33 | `run unit / ✓ C33 sidebar renderiza handle.nav e omite a seção sem ele` | pass |
| C34 | `walk - com o DevTools aberto: acesso → os 3 perfis → troca pelas abas e pela sidebar → gaveta em 375px → Sair ` | pass (Walked) |
| C35 | `cd frontend && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' src/app src/features src/pages src/lib/api.ts ` | pass |
| C36 | `run unit / ✓ C36 controles do shell e do acesso usam o primitivo Button` | pass |
| C42 | `run unit / ✓ C42 sair e expiração limpam o erro de troca de perfil` | pass |
| C40 | `run unit / ✓ C40 itens de perfil do shell ficam desabilitados durante a troca` | pass |
| C37 | `run unit / ✓ C37 modo mock cria sessão sem rede com exp de 8h` | pass |
| C38 | `run unit / ✓ C38 sem a flag exata true o login usa a rede` | pass |
| C39 | `grep -q 'src/lib/api.ts' .docs/architecture/architecture-and-domain.md && grep -q 'src/features/auth/' .docs/a` | pass |
| C41 | `cd frontend && node -e "const p=require('./package.json');process.exit(p.scripts.test==='vitest run'&&p.depend` | pass |
| Build | `cd frontend && npm run build` | pass |

## Output

`Run unit` - exit 0

```
 ✓ src/app/mock-and-routes.test.tsx > modo mock > C37 modo mock cria sessão sem rede com exp de 8h 152ms
 ✓ src/app/mock-and-routes.test.tsx > modo mock > C38 sem a flag exata true o login usa a rede 154ms
 ✓ src/app/shell.test.tsx > troca de perfil no shell > C27 clicar no perfil ativo não faz nada 119ms
 ✓ src/app/shell.test.tsx > troca de perfil no shell > C28 troca de perfil e sair esvaziam o cache 124ms
 ✓ src/app/shell.test.tsx > troca de perfil no shell > C40 itens de perfil do shell ficam desabilitados durante a troca 217ms
 ✓ src/app/shell.test.tsx > shell B2B > C29 rodapé mostra nome ou sub e o perfil 11ms
 ✓ src/app/shell.test.tsx > shell B2B > C30 gaveta abre no menu e fecha por item fora e Esc 310ms
 ✓ src/app/shell.test.tsx > shell B2B > C33 sidebar renderiza handle.nav e omite a seção sem ele 10ms
 ✓ src/app/shell.test.tsx > sair > C42 sair e expiração limpam o erro de troca de perfil 252ms
 ✓ src/app/shell.test.tsx > sair > C31 sair encerra a sessão e abre o acesso sem aviso 139ms

 Test Files  5 passed (5)
      Tests  34 passed (34)
   Start at  01:24:55
   Duration  7.42s (transform 548ms, setup 2.11s, collect 13.85s, tests 3.77s, environment 8.53s, prepare 1.25s)
```

`cd frontend && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' src/app src/features src/pages src/lib/api.ts ` - exit 0

```
(no output)
```

`grep -q 'src/lib/api.ts' .docs/architecture/architecture-and-domain.md && grep -q 'src/features/auth/' .docs/a` - exit 0

```
(no output)
```

`cd frontend && node -e "const p=require('./package.json');process.exit(p.scripts.test==='vitest run'&&p.depend` - exit 0

```
(no output)
```
