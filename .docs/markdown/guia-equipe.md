# 🧭 Guia Prático da Equipe — Como Rodar, Testar e Codar com Spec Lean

> **Equipe 22 — Ho-Ho** | Guia feito para todo mundo da equipe conseguir subir o projeto, trabalhar em paralelo sem quebrar a `main` e usar IA (Qwen / agentes) com método profissional — mesmo quem está nos primeiros semestres.

---

## 1. O que você precisa ter instalado no PC (uma única vez)

Antes de começar, instale/confirme estas 4 ferramentas:

1. **Git** — para baixar o código e enviar Pull Requests (`git --version`).
2. **Docker Desktop** — **precisa estar aberto** sempre que for rodar o banco de dados ou os testes do backend (`docker --version`).
3. **Java 21 (JDK 21 LTS)** — para compilar e rodar o backend Spring Boot (`java -version`).
4. **Node.js (v20 ou superior — projeto usa v24)** — para rodar o frontend React/Vite (`node -v` e `npm -v`).

---

## 2. Primeira configuração após clonar o repositório

No terminal (PowerShell ou Git Bash), dentro da pasta do projeto (`HO-ho`):

### Passo 1 — Criar o arquivo `.env`
As senhas locais e chaves ficam fora do Git. Copie o modelo `.env.example` (localizado na raiz do repositório) para `.env`:

* **PowerShell (Windows):**
  ```powershell
  Copy-Item .env.example .env
  ```
* **Git Bash / Linux / Mac:**
  ```bash
  cp .env.example .env
  ```

> ⚠️ **Regra absoluta:** **Nunca** dê `git add` ou `commit` no arquivo `.env`. Apenas o `.env.example` vai para o GitHub.

### Passo 2 — Conferir sua assinatura do Git
Garanta que seus commits vão sair no seu nome e e-mail do GitHub:

```bash
git config --local user.name "Seu Nome"
git config --local user.email "seu-email-do-github@exemplo.com"
```

---

## 3. Como rodar o projeto inteiro na sua máquina

Você vai precisar de **1 Docker + 2 terminais abertos** (um para o Backend, outro para o Frontend).

### Passo 1 — Subir o PostgreSQL (Docker)
Na **raiz do projeto** (`HO-ho`), onde está o arquivo `docker-compose.yml`:

```bash
docker compose up -d
```

Confira se o banco ficou saudável (`healthy`):

```bash
docker compose ps
```

*(Para desligar o banco depois sem apagar os dados: `docker compose down`.)*

---

### Passo 2 — Rodar o Backend (Java 21 + Spring Boot)
Abra um terminal na pasta `backend/`:

* **Windows (PowerShell/CMD):**
  ```powershell
  cd backend
  .\mvnw.cmd spring-boot:run
  ```
* **Git Bash / Linux / Mac:**
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```

Quando subir, a API responde em `http://localhost:8080` e o Swagger (documentação interativa das rotas) fica em:
* `http://localhost:8080/swagger-ui.html`

---

### Passo 3 — Rodar o Frontend (React + Vite + Tailwind)
Abra um **segundo terminal** na pasta `frontend/`:

```bash
cd frontend
npm install   # Rode na 1ª vez ou quando alguém adicionar pacote novo
npm run dev
```

Acesse no navegador: `http://localhost:5173`.

> 💡 **Não precisa configurar CORS nem URL manual no front:** o arquivo [`frontend/vite.config.ts`](../../frontend/vite.config.ts) já redireciona tudo que começa com `/api` para `http://localhost:8080`.

---

## 4. Como testar antes de subir código (o que o CI cobra)

Nosso repositório tem uma pipeline automática no GitHub Actions configurada em [`/.github/workflows/ci.yml`](../../.github/workflows/ci.yml). Se algo quebrar nela, **o Pull Request fica vermelho e não pode ir para a `main`**.

Antes de dar `git push`, rode estes comandos localmente:

### Testar o Backend (com Docker Desktop aberto!)
Os testes usam **Testcontainers**, que sobe um PostgreSQL `16-alpine` automático e descartável para testar de verdade (configurado em [`backend/src/test/java/com/hoho/shoppinghub/TestcontainersConfiguration.java`](../../backend/src/test/java/com/hoho/shoppinghub/TestcontainersConfiguration.java)):

* **Windows:**
  ```powershell
  cd backend
  .\mvnw.cmd -B verify
  ```
* **Git Bash / Linux / Mac:**
  ```bash
  cd backend
  ./mvnw -B verify
  ```

### Testar o Frontend (tipagem TypeScript + build de produção)

```bash
cd frontend
npm run build
```

Se ambos terminarem sem erro (`BUILD SUCCESS` no Maven e `built in ...` no Vite), seu código está pronto para subir!

---

## 5. Fluxo de trabalho no Git e no Kanban

Acompanhe e mova seus cards no **[Kanban Oficial (GitHub Projects)](https://github.com/users/victoraugusto2008df-blip/projects/2)** e consulte os detalhes técnicos e dependências no arquivo [`.docs/planning/mvp-sabado-kanban.md`](../planning/mvp-sabado-kanban.md).

### Regras de Git da equipe
1. **Nunca faça commits direto na `main`.**
2. Sempre comece um card criando uma branch nova a partir da `main` atualizada:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/ORD-05-ingestao-nfce
   ```
3. Faça commits pequenos e descritivos:
   ```bash
   git add .
   git commit -m "feat(ORD-05): implementa validacao de chave e evento fiscal"
   ```
4. Suba sua branch e abra um **Pull Request (PR)** no GitHub mirando a `main`:
   ```bash
   git push -u origin feat/ORD-05-ingestao-nfce
   ```
5. Espere os 3 checks do CI ficarem verdes (`Backend`, `Frontend`, `Docker Compose Validation`) e peça para um colega revisar antes de dar merge.

---

## 6. Como usar o Qwen (ou outra IA) com o método `tlc-spec-lean`

Se você só jogar no chat *"Qwen, faz o card ORD-05 pra mim"*, a IA provavelmente vai:
* Esquecer regras importantes (ex: trava de 72h, K-Anonymity $k \ge 3$, LGPD);
* Inventar nomes de rotas ou colunas que não batem com o banco;
* Falar *"pronto, tudo funcionando!"* sem ter testado nada.

Para evitar esse "vibecoding quebrado", usamos o método **`tlc-spec-lean`** ([`.agents/skills/tlc-spec-lean/SKILL.md`](../../.agents/skills/tlc-spec-lean/SKILL.md)). A ideia é simples: **antes de gerar código, travamos o que precisa ser verdade e como provar que funciona — e quem verifica no final NÃO pode ser a mesma conversa que escreveu o código.**

### Os 4 passos do `tlc-spec-lean`

```text
1. PLAN (Planejar) ──► 2. CHECKS (Provas) ──► 3. BUILD (Codar) ──► 4. VERIFY (Auditar em chat novo)
```

1. **PLAN (Planejar em 1 arquivo pequeno):**
   Peça para a IA ler os documentos do projeto e escrever um plano curto (em `.specs/features/<card>/plan.md`) respondendo:
   * Qual problema esse card resolve;
   * Fluxo passo a passo (ex: Controller -> UseCase -> Repository -> Evento);
   * Rotas de API / telas envolvidas;
   * **Portas sem volta** (ex: nova migration SQL ou mudança de contrato JSON);
   * Critérios no formato **EARS**: *"Quando [evento], o sistema DEVE [comportamento]"*.
   * **Pare aqui e leia!** Só autorize ir para o código quando o plano fizer sentido.

2. **CHECKS (Transformar requisitos em testes obrigatórios):**
   Peça para a IA listar em `.specs/features/<card>/checks.md` cada regra do plano ligada a **uma prova real** (nome do teste JUnit ou comando que prova que a regra funciona).
   * **Regra de ouro:** O teste valida a regra de negócio, nunca o código que já foi escrito. **Nunca** apague ou enfraqueça um teste para fazer o build passar.

3. **BUILD (Codar em fatias pequenas):**
   Agora sim a IA escreve os testes e o código aos poucos, rodando `./mvnw.cmd -B verify` (backend) ou `npm run build` (frontend) a cada etapa.

4. **VERIFY (Verificação independente — obrigatório!):**
   Quem escreveu o código costuma ter ponto cego nos próprios erros. Quando terminar o último commit da feature:
   * **Abra uma NOVA conversa limpa no Qwen** (sem o histórico anterior);
   * Cole o `checks.md` e o resultado de `git diff main...HEAD` e peça para essa nova conversa agir como **Revisor/Verificador**: conferir linha por linha se todas as regras foram implementadas e se os testes realmente passaram sem truques.

---

### Prompt pronto para copiar e colar no Qwen

Sempre que for começar um card do Kanban com o Qwen, comece a conversa assim:

```text
Você vai me ajudar a implementar o card [ORD-XX] do projeto Shopping Analytics & Loyalty Hub.

Antes de escrever qualquer código, leia estes arquivos de referência do repositório:
1. .docs/markdown/requirements.md (regras de negócio ReN01–ReN05)
2. .docs/architecture/architecture-and-domain.md (arquitetura, DER e ADRs)
3. .docs/planning/mvp-sabado-kanban.md (escopo exato do card ORD-XX)

Vamos trabalhar usando o fluxo tlc-spec-lean (perfil light):
- Passo 1 (PLAN): Gere apenas um plano enxuto com: fluxo, rotas/contratos envolvidos, decisões difíceis de reverter (migrations/APIs) e critérios EARS ("Quando X, o sistema DEVE Y"). Pare e aguarde minha aprovação.
- Passo 2 (CHECKS): Após eu aprovar o plano, liste cada critério com o teste unitário/integração ou comando exato que comprova o funcionamento.
- Passo 3 (BUILD): Só depois escreva código limpo em partes pequenas, seguindo SOLID e os padrões já existentes no projeto, e rode os testes (`./mvnw.cmd -B verify` no backend ou `npm run build` no frontend).

Não altere código de outros cards nem faça commits/push sem eu pedir. Comece pelo Passo 1 (PLAN).
```

E quando terminar o card, abra **outro chat novo no Qwen** e mande:

```text
Atue como um Revisor Técnico independente (Verifier do tlc-spec-lean). Você não escreveu este código.

Compare as alterações da minha branch (git diff main...HEAD) com os critérios do card [ORD-XX] em .docs/planning/mvp-sabado-kanban.md e com as regras em .docs/architecture/architecture-and-domain.md.

Verifique:
1. Alguma regra de negócio ou caso de erro ficou de fora?
2. Algum teste foi enfraquecido, pulado ou só mocka tudo sem provar a regra real?
3. Os comandos `./mvnw.cmd -B verify` (backend) e `npm run build` (frontend) passam de verdade?

Liste o que passou, o que falhou e exatamente em qual arquivo e linha está o problema.
```

---

## 7. Checklist rápido do que NUNCA fazer no projeto

* **No Backend:**
  * Não retornar `@Entity` direto no Controller (sempre usar DTOs de entrada/saída).
  * Não confiar em `lojaId` ou `clienteId` enviado pelo frontend no corpo da requisição — pegar sempre do usuário autenticado (JWT).
  * Não salvar CPF em texto limpo (LGPD: usar apenas `cpf_hash` e `cpf_mascarado`).
  * Não colocar regra de negócio dentro de `@RestController`.
* **No Frontend:**
  * Não inventar cores hexadecimais soltas (`#123456`) nos componentes — usar os tokens de [`frontend/src/styles/tokens.css`](../../frontend/src/styles/tokens.css).
  * Não usar emojis como ícones de interface — usar `lucide-react`.
* **No dia a dia:**
  * Travou por mais de 20 minutos num erro? Mande no grupo: qual card (`ORD-XX`), qual comando rodou e o erro completo do terminal.

