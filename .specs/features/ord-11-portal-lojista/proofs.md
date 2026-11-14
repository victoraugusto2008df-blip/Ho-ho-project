# ord-11-portal-lojista proofs

**HEAD**: ecf3ca3
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 34 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `browser - abrir /?tela=lojista com o mock, esperar o dashboard, sem disparar a campanha, em janela de 1317 de ` | pass |
| C2 | `run unit / ✓ C2 App escolhe a Tela 2 só com tela=lojista` | pass |
| C3 | `run unit / ✓ C3 card de ticket médio mostra o valor em reais` | pass |
| C4 | `run unit / ✓ C4 benchmarking liberado mostra as duas barras e o gap com sinal` | pass |
| C31 | `run unit / ✓ C31 gap arredonda a magnitude igual nos dois sinais` | pass |
| C5 | `run unit / ✓ C5 benchmarking bloqueado mostra cadeado e explicação da ReN05` | pass |
| C6 | `run unit / ✓ C6 média da categoria nunca aparece com o benchmarking bloqueado` | pass |
| C7 | `run unit / ✓ C7 aviso de K-Anonymity aparece com o benchmarking liberado` | pass |
| C8 | `run unit / ✓ C8 horas do pico são preenchidas de ponta a ponta com zero` | pass |
| C8 | `run unit / ✓ C8 gráfico de pico desenha uma barra por hora` | pass |
| C9 | `run unit / ✓ C9 resumo do pico usa a maior hora com desempate pela mais cedo` | pass |
| C9 | `run unit / ✓ C9 barra de pico destacada e legenda do pico na tela` | pass |
| C10 | `run unit / ✓ C10 ver dados em tabela abre a tabela de horários e vendas` | pass |
| C11 | `run unit / ✓ C11 afinidade lista as 6 maiores categorias com contagem de compras` | pass |
| C12 | `run unit / ✓ C12 pico e afinidade vazios mostram o estado vazio` | pass |
| C13 | `run unit / ✓ C13 card de campanha mostra segmento desconto e botão fixos` | pass |
| C14 | `run unit / ✓ C14 disparar campanha envia o corpo fixo e mostra o público atingido` | pass |
| C15 | `run unit / ✓ C15 botão de campanha fica desabilitado durante o disparo` | pass |
| C16 | `run unit / ✓ C16 falha no disparo mostra o erro e reabilita o botão` | pass |
| C17 | `run unit / ✓ C17 backend real chama o dashboard e a campanha pelo fetcher` | pass |
| C18 | `run unit / ✓ C18 só VITE_BACKEND_LOJISTA true liga o backend real da Tela 2` | pass |
| C19 | `cd frontend && npm run build:demo >/dev/null 2>&1 && { cat dist/assets/*.js / grep -qE '/api/v1//campanhas//an` | pass |
| C20 | `run unit / ✓ C20 nenhum seletor de loja e nenhum lojaId nas requisições` | pass |
| C21 | `run unit / ✓ C21 os quatro cards de dados mostram carregando` | pass |
| C22 | `run unit / ✓ C22 erro do dashboard mostra tentar novamente e mantém a campanha` | pass |
| C23 | `run unit / ✓ C23 cabeçalho mostra título e selos` | pass |
| C24 | `run unit / ✓ C24 mock devolve o dashboard e a campanha na forma do contrato` | pass |
| C25 | `cd frontend && F="src/features/lojista src/App.tsx" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' $F / g` | pass |
| C26 | `run unit / ✓ C26 paleta dos gráficos é a do guia de design system` | pass |
| C27 | `run unit / ✓ C27 valores percentuais e contagens da Tela 2 usam tabular-nums` | pass |
| C28 | `run unit / ✓ C28 controles selos e blocos da Tela 2 usam Button Badge e Card` | pass |
| C29 | `walk - com o DevTools aberto: abrir /?tela=lojista → esperar o dashboard → "Ver dados em tabela" → "Disparar C` | pass (Walked) |
| C30 | `walk - em 375px, document.documentElement.scrollWidth é igual a clientWidth` | pass (Walked) |
| Build | `cd frontend && npm run build` | pass |

## Output

`Run unit` - exit 0

```
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C21 falha técnica mostra a mensagem genérica e mantém a chave 510ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S3 - cadastrar nota > C22 editar a chave apaga a mensagem anterior 496ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C23 lista ordena da mais recente e soma no cabeçalho 47ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C24 lista vazia mostra o estado vazio 32ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S4 - notas de hoje > C25 lista tem estado de carregando erro e tentar novamente 110ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C26 botões do painel enviam a chave de cada erro 262ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C27 reiniciar zera a demonstração e o ciclo de chaves 497ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C28 ordem de validação mostra os 7 itens da captura 7ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > S5 - painel do protótipo > C29 backend real esconde reiniciar e o rodapé do mock 11ms
 ✓ src/features/consumidor/PortalConsumidor.test.tsx > montagem > C40 App renderiza a Tela 1 no lugar da vitrine 6ms

 Test Files  5 passed (5)
      Tests  64 passed (64)
   Start at  11:50:52
   Duration  10.31s (transform 824ms, setup 1.95s, collect 9.70s, tests 6.48s, environment 9.62s, prepare 1.25s)
```

`cd frontend && npm run build:demo >/dev/null 2>&1 && { cat dist/assets/*.js / grep -qE '/api/v1//campanhas//an` - exit 0

```
(no output)
```

`cd frontend && F="src/features/lojista src/App.tsx" && { grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' $F / g` - exit 0

```
(no output)
```
