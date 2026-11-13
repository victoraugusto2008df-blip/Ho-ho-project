# 🛍️ Shopping Analytics & Loyalty Hub

> **Equipe 22 — Ho-Ho**  
> Plataforma integrada de Inteligência Fiscal, CRM Cooperativo e Gestão de Benefícios para Shopping Centers.

---

## 📌 Visão Geral do Projeto

Enquanto o e-commerce conhece cada clique e intenção de compra do usuário em tempo real, o varejo físico tradicional opera sob uma **cegueira analítica**: sabe-se quantas pessoas entram pelas portas do shopping, mas não quem consome, qual é o ticket médio real, quais os horários de pico por categoria ou como os clientes transitam entre diferentes marcas.

O **Shopping Analytics & Loyalty Hub** resolve essa dor através de um **ecossistema cooperativo tripartite** fundamentado em dados fiscais reais (**NFC-e / Cupom Fiscal com CPF**), eliminando a necessidade de sensores físicos invasivos ou câmeras de rastreamento.

---

## 🎯 Proposta de Valor Tripartite (Ganha-Ganha-Ganha)

```
                    ┌──────────────────────────────┐
                    │      Consumidor Final        │
                    │ (Estacionamento Grátis/Clube)│
                    └──────────────┬───────────────┘
                                   │ Cadastra NFC-e
                                   ▼
┌──────────────────────────┐  API REST  ┌──────────────────────────┐
│   Lojistas do Shopping   │◄──────────►│  Administração Shopping  │
│ (Benchmarking/Campanhas) │            │ (Visão Macro/Tenant Mix) │
└──────────────────────────┘            └──────────────────────────┘
```

1. **Para o Consumidor:**
   * **Gancho de Atração Principal:** Isenção de taxa de estacionamento ao atingir meta de consumo diário (ex: R$ 150,00 acumulados em compras no mesmo dia).
   * Clube de benefícios, cashback e ofertas hiperpersonalizadas.
   * *Privacy by Design:* Consentimento explícito e transparência sob a LGPD.

2. **Para os Lojistas (Portal Web do Lojista):**
   * **Benchmarking Setorial:** Comparação do desempenho da loja contra a média da categoria (ex: ticket médio próprio vs. mediana do setor de calçados).
   * **Afinidade de Cestas (Cross-Shopping):** Mapeamento de quais outras categorias os seus clientes consomem no shopping.
   * **Campanhas Direcionadas em 1 Clique:** Disparo de cupons via app do shopping para audiências qualificadas (ex: clientes inativos há 60 dias) sem violação de dados pessoais.
   * **CRM Próprio:** Métricas de recompra e retenção da sua própria base de clientes.

3. **Para a Administração do Shopping (Portal Corporativo):**
   * Mapeamento do faturamento real por andar, corredor e segmento.
   * Otimização estratégica do mix de lojas (*Tenant Mix*).
   * Monetização B2B por meio de assinaturas de módulos analíticos e taxas de conversão de campanhas.

---

## 🛠️ Stack Tecnológica e Arquitetura

O projeto adota uma arquitetura de **Monólito Modular** (com módulos isolados por domínio: `fiscal`, `beneficios` e `analytics` seguindo **Clean Architecture** e **SOLID**), evitando a complexidade prematura de microsserviços distribuídos sem abrir mão de desacoplamento.

### Base Atual (MVP Funcional)

* **Backend:**
  * **Java 21 LTS** + **Spring Boot 3.x:** Aproveitando *Records*, *Pattern Matching* e **Virtual Threads (Project Loom)** para alta eficiência em operações I/O.
  * **PostgreSQL + Flyway:** Banco relacional robusto com *migrations* versionadas em Git (paridade entre desenvolvimento e produção, sem depender de `ddl-auto`).
  * **Spring Security + JWT:** Controle de acesso baseado em perfis (`CONSUMIDOR`, `LOJISTA`, `ADMIN_SHOPPING`) e isolamento lógico *multi-tenant*.
  * **SpringDoc OpenAPI (Swagger):** Documentação viva da API REST e geração de contratos tipados para o frontend.
* **Frontend:**
  * **React + TypeScript + Vite:** Tipagem forte alinhada aos DTOs da API e build ultrarrápido.
  * **TanStack Query (React Query):** Gerenciamento de estado servidor, loading e cache de requisições REST.
  * **Tailwind CSS + shadcn/ui + Recharts:** Construção ágil de interfaces e gráficos analíticos para os portais.
* **Infraestrutura, Testes e CI/CD:**
  * **Docker & Docker Compose:** Padronização completa do ambiente local (Backend + Frontend + PostgreSQL).
  * **JUnit 5 + Mockito + Testcontainers:** Testes unitários nas regras de negócio e testes de integração reais subindo PostgreSQL em container.
  * **GitHub Actions (CI):** Pipeline automática a cada push/PR para validar compilação, testes automatizados e build das imagens Docker.

### Roadmap Futuro (Evolução v2)

Tecnologias mapeadas para escalar o sistema após a validação do MVP, com o **porquê** de cada uma:

* **Integração Real com SEFAZ / Leitor de QR Code (OCR):**
  * *Por quê:* No MVP, a consulta fiscal usa um `Mock` atrás de uma interface (`Dependency Inversion Principle` — SOLID). Na v2, plugamos a API fiscal real sem alterar nenhuma regra de negócio.
* **Mensageria Assíncrona (`RabbitMQ`):**
  * *Por quê:* Consultas à SEFAZ podem ser lentas ou instáveis. Uma fila desacopla o envio da nota pelo cliente do processamento em segundo plano, permitindo *retries* automáticos sem travar a tela do usuário.
* **Cache em Memória (`Redis`):**
  * *Por quê:* Queries analíticas (benchmarking setorial, ticket médio e afinidade de cestas) são custosas no banco; o Redis armazena agregações temporárias e protege a API com *rate limiting*.
* **Observabilidade (`Spring Boot Actuator` + `Micrometer`):**
  * *Por quê:* Expor *health checks* reais para os containers Docker e métricas de latência/erros em produção.

---

## 📂 Documentação Detalhada

A documentação conceitual e técnica completa está disponível no diretório `.docs/markdown/`:

* 📄 **[about.md](.docs/markdown/about.md):** Contexto detalhado do negócio, motivação, desafios do varejo físico e estratégias de monetização.
* 📋 **[requirements.md](.docs/markdown/requirements.md):** Especificação completa de Requisitos de Negócio (RN), Requisitos Funcionais (RF), Requisitos Não Funcionais (RNF) e Regras de Negócio (ReN).

---

## 👥 Equipe
* **Equipe 22 — Ho-Ho**

