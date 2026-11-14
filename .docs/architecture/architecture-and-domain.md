# 🏗️ Arquitetura, Modelagem de Domínio e ADRs — Shopping Analytics & Loyalty Hub

> **Objetivo:** Consolidar as decisões de arquitetura, modelo de dados (DER), contratos iniciais de API REST e *Architecture Decision Records (ADRs)* definidos na fase de planejamento e validação do MVP.

---

## 1. Arquitetura Lógica: Monólito Modular

O backend em **Java 21 LTS + Spring Boot 3.x** será estruturado como um **Monólito Modular** organizado por contextos de negócio (*Bounded Contexts*), aplicando **Clean Architecture** e **SOLID**:

* **`fiscal`**: Ingestão de NFC-e, validação de unicidade (ReN01), prazo de 72h (ReN02), consulta ao gateway fiscal (`ConsultaNotaFiscalGateway`) e publicação de eventos de domínio (`NotaFiscalValidadaEvent`).
* **`beneficios`**: Escuta eventos de notas aprovadas, calcula o acúmulo diário do consumidor (ReN03) e emite o `VoucherEstacionamento` garantindo a trava de 1 resgate/dia (ReN04).
* **`analytics`**: Consolida métricas de Ticket Médio, horários de pico, afinidade entre categorias (*Cross-Shopping*), gestão de campanhas e aplica a trava de privacidade *K-Anonymity* ($k \ge 3$ lojistas ativos por categoria — ReN05).
* **`auth` / `shared`**: Autenticação stateless com **Spring Security + JWT**, controle de acesso por perfil (`CONSUMIDOR`, `LOJISTA`, `ADMIN_SHOPPING`) e isolamento lógico *multi-tenant* por `loja_id`.

### Inversão de Dependência no Gateway Fiscal (DIP — SOLID)
A camada de domínio/aplicação do módulo `fiscal` depende exclusivamente da abstração `ConsultaNotaFiscalGateway`.
* **No MVP:** A implementação `MockSefazGateway` interpreta chaves de 44 dígitos determinísticas/simuladas para demonstrar tanto cenários válidos (acúmulo até R$ 150,00) quanto cenários de rejeição (nota duplicada, emissão > 72h, CNPJ não credenciado).
* **Na v2:** Uma implementação `SefazRealGateway` substitui o mock sem alterar nenhuma regra de negócio.

---

## 2. Modelagem de Dados (DER — PostgreSQL)

```mermaid
erDiagram
    CATEGORIAS ||--o{ LOJAS : classifica
    LOJAS ||--o{ NOTAS_FISCAIS : emite
    LOJAS ||--o{ CAMPANHAS : cria
    LOJAS ||--o{ USUARIOS : vincula
    CLIENTES ||--o{ NOTAS_FISCAIS : cadastra
    CLIENTES ||--o{ VOUCHERS_ESTACIONAMENTO : resgata
    CLIENTES ||--o{ USUARIOS : possui

    CATEGORIAS {
        uuid id PK
        varchar nome UK
    }

    LOJAS {
        uuid id PK
        varchar cnpj UK
        varchar nome
        uuid categoria_id FK
        boolean ativa
        timestamp criado_em
    }

    CLIENTES {
        uuid id PK
        varchar cpf_hash UK "SHA-256 + pepper (LGPD)"
        varchar cpf_mascarado "***.456.789-**"
        varchar nome
        boolean consentimento_lgpd
        timestamp criado_em
    }

    USUARIOS {
        uuid id PK
        varchar email UK
        varchar senha_hash
        varchar role "CONSUMIDOR | LOJISTA | ADMIN_SHOPPING"
        uuid cliente_id FK "nullable"
        uuid loja_id FK "nullable (tenant)"
    }

    NOTAS_FISCAIS {
        uuid id PK
        char44 chave_acesso UK "ReN01: unicidade"
        uuid cliente_id FK
        uuid loja_id FK
        numeric valor_total
        timestamp data_emissao
        timestamp data_cadastro
        varchar status "APROVADA | REJEITADA"
    }

    VOUCHERS_ESTACIONAMENTO {
        uuid id PK
        uuid cliente_id FK "UK com data_referencia (ReN04)"
        date data_referencia "UK com cliente_id (ReN04)"
        numeric valor_acumulado
        varchar codigo_qr UK
        varchar status "LIBERADO | UTILIZADO | EXPIRADO"
        timestamp criado_em
    }

    CAMPANHAS {
        uuid id PK
        uuid loja_id FK
        varchar titulo
        integer desconto_percentual
        varchar criterio_alvo
        integer publico_atingido
        timestamp criado_em
    }
```

### Garantias de Integridade no Banco (Flyway)
1. **Unicidade Fiscal (ReN01):** `notas_fiscais.chave_acesso` possui restrição `UNIQUE` (`CHAR(44)`).
2. **Limite Diário Atômico (ReN04):** `vouchers_estacionamento` possui chave única composta `UNIQUE (cliente_id, data_referencia)`, impedindo emissão duplicada mesmo sob requisições concorrentes (*Virtual Threads* / cliques duplos).
3. **LGPD por Design:** `clientes` nunca armazena o CPF em texto claro — apenas `cpf_hash` (para busca e deduplicação) e `cpf_mascarado` (para exibição na UI).

---

## 3. Contratos Iniciais da API REST (MVP — 3 Telas)

| Módulo | Método & Endpoint | Perfil | Finalidade no MVP |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/v1/auth/login` | Público | Autentica usuário seedado e retorna JWT com `role` e `lojaId`/`clienteId`. |
| **Fiscal** | `POST /api/v1/notas` | `CONSUMIDOR` | Recebe chave de 44 dígitos (ou payload do simulador QR), valida ReN01–ReN03 e dispara evento. |
| **Benefícios** | `GET /api/v1/beneficios/estacionamento/hoje` | `CONSUMIDOR` | Retorna valor acumulado hoje, percentual da meta (R$ 150) e voucher/QR Code se liberado. |
| **Analytics** | `GET /api/v1/analytics/lojista/dashboard` | `LOJISTA` | Retorna Ticket Médio da loja, média da categoria (se $k \ge 3$), horários de pico e cross-shopping. |
| **Campanhas** | `POST /api/v1/campanhas` | `LOJISTA` | Registra campanha direcionada (botão 1 clique da Tela 2) e retorna público estimado atingido. |
| **Analytics** | `GET /api/v1/analytics/shopping/dashboard` | `ADMIN_SHOPPING` | Retorna faturamento total capturado, distribuição por setor, mapa horário e total de vouchers/campanhas. |

---

## 4. Architecture Decision Records (ADRs)

### ADR-01: Monólito Modular em vez de Microsserviços
* **Contexto:** Prazo de 2 dias para MVP funcional com 3 telas, equipe enxuta e necessidade de manter código limpo e escalável.
* **Decisão:** Adotar Monólito Modular em Java 21 / Spring Boot 3 com separação lógica por pacotes e eventos internos (`ApplicationEventPublisher`).
* **Consequência:** Zero overhead de rede/orquestração agora, preservando fronteiras claras caso algum módulo precise virar microsserviço no futuro.

### ADR-02: Armazenamento de `cpf_hash` + `cpf_mascarado` (LGPD)
* **Contexto:** RNF04 exige proteção rigorosa de dados pessoais (CPF), mas o domínio exige agrupar compras do cliente e limitar 1 voucher/dia por CPF.
* **Decisão:** Armazenar hash determinístico SHA-256 com *pepper* configurado via variável de ambiente (`cpf_hash`) e máscara para exibição (`cpf_mascarado`).
* **Consequência:** Conformidade imediata com LGPD e *Privacy by Design* sem comprometer chaves únicas e consultas rápidas no PostgreSQL.

### ADR-03: Adiamento da tabela `itens_nota` para a v2 (YAGNI)
* **Contexto:** A NFC-e real contém lista granular de produtos (SKU/NCM), mas nenhuma das 3 telas do MVP exibe detalhamento por produto — todas operam sobre loja, categoria e valor total da nota.
* **Decisão:** Manter apenas `notas_fiscais` na Fase 1 e introduzir `itens_nota` na v2 junto à integração real da SEFAZ.
* **Consequência:** Entrega mais rápida e banco enxuto sem impactar o valor demonstrado na demo.

### ADR-04: `MockSefazGateway` atrás de Interface (DIP) + Cenários de Erro
* **Contexto:** Integração real com SEFAZ exige certificado digital e está fora do prazo de 2 dias.
* **Decisão:** Implementar `MockSefazGateway` sob `ConsultaNotaFiscalGateway` aceitando chaves de teste determinísticas (válidas, > 72h, loja não credenciada).
* **Consequência:** Demonstração ao vivo 100% confiável de todos os fluxos (sucesso e validações ReN01–ReN03) sem acoplar o código de domínio.

### ADR-05: JWT com Usuários Seedados e Acesso Rápido na UI
* **Contexto:** Construir fluxo completo de cadastro, verificação de e-mail e recuperação de senha consumiria tempo crítico do MVP.
* **Decisão:** Manter autenticação JWT real com Spring Security + RBAC, populando usuários de demonstração via *seed* do Flyway e oferecendo botões de acesso rápido na tela de login do React.
* **Consequência:** Segurança real garantida no backend e navegação fluida entre os 3 perfis durante a apresentação.

### ADR-06: Design Tokens em 3 Camadas e Tailwind CSS v4
* **Contexto:** As 3 telas do MVP (`.docs/images/`) compartilham identidade visual consistente (Indigo para marca/ações, Blue para analytics, Emerald para metas/vouchers e Slate para superfícies), mas serão implementadas em paralelo no Kanban por diferentes desenvolvedores.
* **Decisão:** Centralizar o estilo em `frontend/src/styles/tokens.css` seguindo a arquitetura de **3 camadas (`Primitivos -> Semânticos -> Componentes`)** integrada ao Tailwind CSS v4 (`@tailwindcss/vite` + `@theme`), evitando valores hexadecimais dispersos nos componentes e utilizando `lucide-react` (SVG) no lugar de emojis.
* **Consequência:** Consistência visual imediata entre os cards `ORD-03`, `ORD-07`, `ORD-11` e `ORD-12`, além de manutenção desacoplada de tema e tipografia.

### ADR-07: Vite Dev Proxy (`/api`), React 18 e TanStack Query
* **Contexto:** Em desenvolvimento local, o frontend roda na porta `5173` e o backend Spring Boot na `8080`; além disso, o dashboard exige gráficos (`recharts`) e sincronização de estado remoto.
* **Decisão:** Configurar proxy reverso no `vite.config.ts` (`/api` → `http://localhost:8080`), fixar React 18 (`^18.3.1`) para compatibilidade estável de *peer dependencies* com `recharts` (`^2.15.1`) e adotar `@tanstack/react-query` (`QueryClient`) para cache/requisições.
* **Consequência:** Eliminação de atritos de CORS em desenvolvimento sem acoplar URLs absolutas de `localhost` nos componentes React.

---

## 5. Arquitetura do Frontend (`frontend/`) & Design System

A camada web é uma SPA em **React 18 + TypeScript (`strict`) + Vite + Tailwind CSS v4**, organizada para isolar infraestrutura visual, primitivas de UI e futuras telas do Kanban:

* **Tokens de Design (`src/styles/tokens.css` e `src/index.css`):**
  1. **Camada Primitiva (`--palette-*`):** Paleta base alinhada aos mockups — Slate (`#f8fafc`..`#0f172a`), Indigo (`#4f46e5` marca/CTAs), Blue (`#2563eb` gráficos/analytics), Emerald (`#10b981`/`#059669` meta de estacionamento e vouchers), Amber (`#d97706`) e Red (`#dc2626`).
  2. **Camada Semântica:** Significado funcional para superfícies (`--bg-canvas`, `--bg-surface`, `--bg-subtle`, `--border-hairline`), tipografia (`--text-primary`, `--text-secondary`, `--text-muted`) e estados (`--color-brand`, `--color-analytics`, `--color-success`, `--color-warning`, `--color-danger`).
  3. **Camada de Componentes & Tipografia:** Raios padronizados (`--radius-card`, `--radius-control`, `--radius-pill`), fontes via Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`) e utilitário `.tabular-nums` para alinhamento numérico em KPIs e tabelas.
* **Infraestrutura & Primitivas UI:**
  * `src/lib/utils.ts`: Helper `cn()` (`clsx` + `tailwind-merge`) para composição segura de classes Tailwind.
  * `src/lib/queryClient.ts`: Instância base do TanStack `QueryClient`.
  * `src/components/ui/`: Primitivas acessíveis (`Button`, `Card`, `Badge`) com foco visível e consumo exclusivo de tokens semânticos.
  * `src/lib/api.ts`: `apiFetch`, o cliente HTTP único (prefixa `/api/v1`, injeta o `Authorization: Bearer` da sessão e, num `401`, encerra a sessão e dispara o evento `hoho:unauthorized`). As telas chamam a API só por ele, dentro dos hooks do TanStack Query.
  * `src/features/auth/`: sessão em `sessionStorage` (`hoho.session`), `AuthProvider`/`useAuth`, o guarda `RequireRole` e o login de Acesso Rápido (`POST /api/v1/auth/login` com os usuários seedados; `VITE_AUTH_MOCK=true` gera um JWT local enquanto o backend não está pronto).
  * `src/app/router.tsx` e `src/app/routes.tsx`: rotas `/acesso`, `/consumidor`, `/lojista` e `/shopping`, cada uma protegida pelo `role` do token. `ConsumidorShell` (barra no topo) e `B2BShell` (sidebar, que vira gaveta abaixo de 768px) trazem a troca de perfil em 1 clique; as telas dos cards `ORD-07`, `ORD-11` e `ORD-12` entram na área de conteúdo, e o ORD-11/12 declaram os itens do menu do portal em `handle.nav` da rota.
* **Integração Local:** `vite.config.ts` expõe o alias `@/*` -> `./src/*` e faz proxy das chamadas `/api/*` para `http://localhost:8080`.

