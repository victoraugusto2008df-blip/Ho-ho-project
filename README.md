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

## 🛠️ Stack Tecnológica

* **Backend:**
  * **Java 21 LTS** com **Spring Boot 3.x**
  * **Clean Architecture** & princípios de Domain-Driven Design (DDD)
  * **Virtual Threads (Project Loom)** para alta escalabilidade em chamadas I/O assíncronas (SEFAZ / APIs fiscais)
  * Banco de Dados Relacional com isolamento multi-tenant lógico
* **Frontend:**
  * **React** com **TypeScript**
  * Componentização modular para os Portais do Lojista e da Administração
  * Visualização de dados e gráficos analíticos
* **Integrações:**
  * Ingestão de NFC-e via leitura de QR Code ou chave de acesso de 44 dígitos da SEFAZ

---

## 📂 Documentação Detalhada

A documentação conceitual e técnica completa está disponível no diretório `.docs/markdown/`:

* 📄 **[about.md](.docs/markdown/about.md):** Contexto detalhado do negócio, motivação, desafios do varejo físico e estratégias de monetização.
* 📋 **[requirements.md](.docs/markdown/requirements.md):** Especificação completa de Requisitos de Negócio (RN), Requisitos Funcionais (RF), Requisitos Não Funcionais (RNF) e Regras de Negócio (ReN).

---

## 👥 Equipe
* **Equipe 22 — Ho-Ho**
