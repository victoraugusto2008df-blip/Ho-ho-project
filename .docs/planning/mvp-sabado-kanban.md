# 📋 Planejamento MVP (Entrega de Sábado) — Kanban & Divisão por Stacks

> **Equipe 22 — Ho-Ho** | **Meta:** MVP funcional das 3 Telas (*Vertical Slice*) pronto para demonstração no sábado.  
> **Escopo deste quadro:** Focado **exclusivamente nas regras de negócio, APIs e interfaces**. *(O setup base de Java/Spring Boot, React/TypeScript, Docker, CI e servidor PostgreSQL fica fora deste quadro por ser configuração prévia de infraestrutura).*

---

## 1. Quadro Kanban Geral

| 📌 Backlog Priorizado (A Fazer) | 🚧 Em Progresso | 🔍 Revisão / Testes | ✅ Concluído |
| :--- | :--- | :--- | :--- |
| **`[ORD-01]`** `BACK` Migrations de Domínio & Seeds | *(vazio)* | *(vazio)* | *(vazio)* |
| **`[ORD-02]`** `BACK` Auth JWT + Acesso Rápido (3 Perfis) | | | |
| **`[ORD-03]`** `FRONT` Shell, Rotas & Seletor de Perfil | | | |
| **`[ORD-04]`** `BACK` Gateway Fiscal (`MockSefazGateway` DIP) | | | |
| **`[ORD-05]`** `BACK` Ingestão de NFC-e + ReN01/ReN02 | | | |
| **`[ORD-06]`** `BACK` Motor de Estacionamento (ReN03/ReN04) | | | |
| **`[ORD-07]`** `FRONT` Tela 1 — Portal do Consumidor | | | |
| **`[ORD-08]`** `BACK` Analytics do Lojista + K-Anonymity (ReN05) | | | |
| **`[ORD-09]`** `BACK` Módulo de Campanhas (Disparo Simulado) | | | |
| **`[ORD-10]`** `BACK` Analytics Corporativo do Shopping | | | |
| **`[ORD-11]`** `FRONT` Tela 2 — Portal do Lojista | | | |
| **`[ORD-12]`** `FRONT` Tela 3 — Portal do Shopping | | | |
| **`[ORD-13]`** `QA` Testes Unitários das Regras (ReN01–ReN05) | | | |
| **`[ORD-14]`** `QA` Ensaio Ponta a Ponta da Demo | | | |

---

## 2. Ordem de Execução (Ondas e Dependências)

Para ninguém ficar bloqueado esperando outro colega, o trabalho deve seguir **4 ondas sequenciais** (com paralelismo dentro de cada onda):

```
[ONDA 1: Fundação de Domínio] ──► ORD-01, ORD-02, ORD-03
         │
         ▼
[ONDA 2: Fluxo do Consumidor] ──► ORD-04 ──► ORD-05 ──► ORD-06 + ORD-07
         │
         ▼
[ONDA 3: Inteligência & B2B]  ──► ORD-08 + ORD-09 + ORD-10 ──► ORD-11 + ORD-12
         │
         ▼
[ONDA 4: Blindagem & Demo]    ──► ORD-13 + ORD-14
```

---

## 3. Cards Detalhados por Stack

### 🗄️ Stack: Dados & Segurança de Domínio (Backend)

#### `[ORD-01]` Migrations de Domínio (Flyway) & Seeds da Demo
* **Ordem:** 1º (Destrava todo o backend) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Criar os scripts SQL das 7 tabelas definidas em [architecture-and-domain.md](../architecture/architecture-and-domain.md): `categorias`, `lojas`, `clientes`, `usuarios`, `notas_fiscais`, `vouchers_estacionamento`, `campanhas`.
  * Garantir constraints críticas no SQL: `chave_acesso CHAR(44) UNIQUE` e `UNIQUE (cliente_id, data_referencia)` em vouchers.
  * Criar *seed* com: 4 categorias, **mínimo 3 lojas ativas em uma mesma categoria** (para validar K-Anonymity $k \ge 3$), 3 usuários de demo e ~15 notas históricas (para os gráficos já nascerem populados).
* **Critério de Aceite:** Ao subir a aplicação, todas as tabelas e dados iniciais existem no banco sem intervenção manual.

#### `[ORD-02]` Autenticação JWT, RBAC & Hashing de CPF
* **Ordem:** 2º | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Implementar `POST /api/v1/auth/login` retornando JWT com `role` (`CONSUMIDOR`, `LOJISTA`, `ADMIN_SHOPPING`) e `lojaId`/`clienteId`.
  * Proteger rotas por perfil (`@PreAuthorize` / SecurityFilterChain) garantindo isolamento *multi-tenant* (`lojaId` do token, nunca enviado solto pelo front).
  * Implementar utilitário de `cpf_hash` (SHA-256 + *pepper* via env var) e máscara `***.456.789-**` (LGPD).
* **Critério de Aceite:** Lojista A não consegue consultar dados da Loja B; consumidor não acessa rotas B2B.

---

### ⚙️ Stack: Backend — Módulos Fiscal & Benefícios (Java 21 / Spring Boot)

#### `[ORD-04]` Interface `ConsultaNotaFiscalGateway` + `MockSefazGateway`
* **Ordem:** 3º (Paralelo com Front Shell) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Criar a interface de domínio `ConsultaNotaFiscalGateway` (**DIP — SOLID**).
  * Implementar `MockSefazGateway` interpretando chaves de 44 dígitos determinísticas para simular:
    * Notas válidas de lojas credenciadas (com valores variados, ex: R$ 65,00 e R$ 95,00 para somar R$ 150,00).
    * Nota com emissão `> 72h` (para provar **ReN02**).
    * Nota com CNPJ fora do shopping (para provar **RF03**).
* **Critério de Aceite:** O domínio fiscal não conhece detalhes do mock e responde aos cenários de sucesso e erro.

#### `[ORD-05]` Ingestão Fiscal (`POST /api/v1/notas`) + Evento de Domínio
* **Ordem:** 4º (Depende de `ORD-01`, `ORD-04`) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Validar unicidade da chave de 44 dígitos (**ReN01**), prazo de 72h (**ReN02**) e loja ativa no shopping.
  * Persistir `NotaFiscal` e publicar `NotaFiscalValidadaEvent` via `ApplicationEventPublisher`.
* **Critério de Aceite:** Envio duplicado retorna erro `409 Conflict` claro; nota válida persiste e dispara evento.

#### `[ORD-06]` Motor de Estacionamento Grátis (`beneficios`)
* **Ordem:** 5º (Depende de `ORD-05`) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Listener de `NotaFiscalValidadaEvent`: soma apenas notas `APROVADA` do cliente **emitidas hoje** (**ReN03**).
  * Ao atingir $\ge \text{R\$ } 150,00$, gerar `VoucherEstacionamento` respeitando 1 resgate/CPF/dia (**ReN04**).
  * Criar endpoint `GET /api/v1/beneficios/estacionamento/hoje` retornando valor acumulado, percentual (0–100%), faltante e voucher/código QR se liberado.
* **Critério de Aceite:** Cadastrar 2 notas de R$ 80 no mesmo dia libera exatamente 1 voucher; 3ª nota no dia não gera 2º voucher.

---

### 📊 Stack: Backend — Módulos Analytics & Campanhas (Java 21 / Spring Boot)

#### `[ORD-08]` Dashboard do Lojista + Trava K-Anonymity (`GET /api/v1/analytics/lojista/dashboard`)
* **Ordem:** 6º (Depende de `ORD-01`, `ORD-02`) | **Importância:** 🟠 P1 — Alta
* **O que fazer:**
  * Calcular Ticket Médio da loja autenticada (`lojaId` do JWT) e média da categoria.
  * Aplicar regra **ReN05 (K-Anonymity)**: só retornar média da categoria se houver $\ge 3$ lojas ativas nela (caso contrário, retornar flag `benchmarkingDisponivel: false`).
  * Calcular horários/dias de pico da loja e *Cross-Shopping* (quais outras categorias os clientes dessa loja mais consomem).
* **Critério de Aceite:** Dados refletem notas seedadas + novas notas cadastradas na Tela 1 em tempo real.

#### `[ORD-09]` Disparo de Campanha em 1 Clique (`POST /api/v1/campanhas`)
* **Ordem:** 7º (Depende de `ORD-01`, `ORD-02`) | **Importância:** 🟡 P2 — Média
* **O que fazer:**
  * Endpoint para o lojista registrar campanha (título, % desconto, critério alvo).
  * Calcular contagem anônima do público elegível (sem expor CPFs/nomes ao lojista) e salvar na tabela `campanhas`.
* **Critério de Aceite:** Campanha salva no Postgres e contabilizada nos indicadores da Tela 3.

#### `[ORD-10]` Dashboard Executivo do Shopping (`GET /api/v1/analytics/shopping/dashboard`)
* **Ordem:** 8º (Depende de `ORD-01`, `ORD-02`) | **Importância:** 🟠 P1 — Alta
* **O que fazer:**
  * Consolidar faturamento total capturado, distribuição percentual por categoria, volume de compras por dia/hora (heatmap), total de vouchers liberados e total de campanhas ativas.
* **Critério de Aceite:** Rota acessível apenas pelo perfil `ADMIN_SHOPPING`.

---

### 🎨 Stack: Frontend (React + TypeScript)

#### `[ORD-03]` Shell da Aplicação, Rotas & Login "Acesso Rápido"
* **Ordem:** 2º (Paralelo com Backend) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Configurar client HTTP (Axios/Fetch + TanStack Query) com interceptor de JWT.
  * Criar barra/tela inicial com **3 botões de Acesso Rápido** (*Entrar como Consumidor*, *Entrar como Lojista*, *Entrar como Admin Shopping*) chamando `/auth/login` com os usuários seedados.
* **Critério de Aceite:** Troca de perfil em 1 clique redireciona para a respectiva tela com token válido.

#### `[ORD-07]` Tela 1 — Portal do Consumidor
* **Ordem:** 5º (Depende de `ORD-03`, `ORD-05`, `ORD-06`) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:**
  * Formulário para digitar chave de 44 dígitos + botão **"Simular Leitura QR Code"** (preenche chaves de teste válidas e inválidas para a demo).
  * Barra de progresso visual até R$ 150,00, lista de notas enviadas hoje e exibição do Voucher/QR Code quando liberado.
  * Tratamento visual claro para erros de negócio (nota duplicada, > 72h, loja não credenciada).
* **Critério de Aceite:** Fluxo fiel ao mockup ([.docs/images/figura1-consumidor-desktop.png](../images/figura1-consumidor-desktop.png)) e responsivo em mobile.

#### `[ORD-11]` Tela 2 — Portal do Lojista
* **Ordem:** 8º (Depende de `ORD-03`, `ORD-08`, `ORD-09`) | **Importância:** 🟠 P1 — Alta
* **O que fazer:**
  * Cards comparativos: Ticket Médio da Loja vs. Média da Categoria (exibindo estado bloqueado se $k < 3$).
  * Gráficos (Recharts) de horários de pico e afinidade (*Cross-Shopping*).
  * Card de ação rápida com botão `[Disparar Cupom 15% OFF]` conectado ao `POST /api/v1/campanhas`.
* **Critério de Aceite:** Layout alinhado ao mockup ([.docs/images/figura3-portal-lojista.png](../images/figura3-portal-lojista.png)).

#### `[ORD-12]` Tela 3 — Portal da Administração do Shopping
* **Ordem:** 9º (Depende de `ORD-03`, `ORD-10`) | **Importância:** 🟠 P1 — Alta
* **O que fazer:**
  * KPIs no topo: Faturamento total capturado, vouchers de estacionamento liberados e campanhas ativas.
  * Gráficos (Recharts): Distribuição por setor e curva/heatmap de consumo por hora.
* **Critério de Aceite:** Layout alinhado ao mockup ([.docs/images/figura4-portal-shopping.png](../images/figura4-portal-shopping.png)).

---

### ✅ Stack: Qualidade & Fechamento (Toda a Equipe)

#### `[ORD-13]` Testes Unitários das Regras de Negócio (JUnit 5 + Mockito)
* **Ordem:** 10º | **Importância:** 🟠 P1 — Alta
* **O que fazer:** Cobrir **ReN01** (chave duplicada), **ReN02** (>72h), **ReN03** (meta R$ 150 mesmo dia), **ReN04** (máx 1 voucher/dia) e **ReN05** ($k < 3$ oculta média).

#### `[ORD-14]` Ensaio Ponta a Ponta da Demonstração
* **Ordem:** 11º (Última etapa antes da entrega) | **Importância:** 🔴 P0 — Crítica
* **O que fazer:** Testar ao vivo o roteiro da banca:
  1. Entrar como **Consumidor**, simular nota inválida (>72h) e ver bloqueio.
  2. Simular 2 notas válidas somando $\ge \text{R\$ } 150,00$ e liberar o voucher de estacionamento.
  3. Trocar para **Lojista**, ver ticket atualizado e disparar campanha de 15%.
  4. Trocar para **Admin Shopping**, mostrar faturamento atualizado e voucher contabilizado.

---

## 4. Sugestão de Divisão entre os 4 Integrantes

Para que os **4 integrantes** trabalhem em paralelo sem pisar no código um do outro:

| Integrante | Trilha / Foco | Cards Responsáveis |
| :--- | :--- | :--- |
| **Dev 1 (Backend Core & Fiscal)** | Domínio, Segurança e Ingestão | `ORD-01` $\rightarrow$ `ORD-02` $\rightarrow$ `ORD-04` $\rightarrow$ `ORD-05` |
| **Dev 2 (Backend Benefícios & Analytics)** | Regras de Estacionamento, KPIs e Campanhas | `ORD-06` $\rightarrow$ `ORD-08` $\rightarrow$ `ORD-09` $\rightarrow$ `ORD-10` |
| **Dev 3 (Frontend B2C & Shell)** | Auth Rápida, Interceptador JWT e Tela 1 | `ORD-03` $\rightarrow$ `ORD-07` $\rightarrow$ apoio em `ORD-14` |
| **Dev 4 (Frontend B2B & Gráficos)** | Dashboards Analíticos (Telas 2 e 3) | `ORD-11` $\rightarrow$ `ORD-12` $\rightarrow$ apoio em `ORD-13`/`ORD-14` |

> 💡 **Dica de Ouro para o Sábado:** Enquanto o **Dev 1** finaliza `ORD-01` e `ORD-02`, o **Dev 3** e o **Dev 4** já podem adiantar o layout visual das telas usando dados mockados no front e só plugar os hooks do TanStack Query assim que os endpoints ficarem prontos!

