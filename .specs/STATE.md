# Project state

## Decisions

Este arquivo é **apenas um índice**. O log de decisões oficial do projeto continua sendo a seção 4
("Architecture Decision Records") de
[`.docs/architecture/architecture-and-domain.md`](../.docs/architecture/architecture-and-domain.md),
onde as decisões nasceram e onde a equipe já procura. Nada do conteúdo dos ADRs é duplicado aqui:
`references/memory.md` da skill manda acrescentar ao log que já existe e não iniciar um segundo.

O índice existe porque `scripts/validate_plan.py` resolve referências `AD-NNN` lendo exclusivamente
este arquivo. Decisões **de arquitetura** novas devem ser escritas primeiro como ADR no documento de
arquitetura e então espelhadas aqui em uma linha, com o mesmo número (ADR-08 vira AD-008).

A faixa a partir de **AD-101** é de outra natureza: decisões que aprovam uma diferença entre uma tela e
a sua fonte vinculante (a figura do mockup). Não são de arquitetura e não vão para o documento da
equipe; ficam registradas só aqui, por autorização do usuário em 2026-11-14 (ORD-12, decisão D3).

| ID | Decision | Rationale | Status | Date |
| --- | --- | --- | --- | --- |
| AD-001 | ver ADR-01 em `.docs/architecture/architecture-and-domain.md` - Monólito Modular em vez de Microsserviços | registrado no ADR-01 | active | 2026-11-13 |
| AD-002 | ver ADR-02 - Armazenamento de `cpf_hash` + `cpf_mascarado` (LGPD) | registrado no ADR-02 | active | 2026-11-13 |
| AD-003 | ver ADR-03 - Adiamento da tabela `itens_nota` para a v2 (YAGNI) | registrado no ADR-03 | active | 2026-11-13 |
| AD-004 | ver ADR-04 - `MockSefazGateway` atrás de interface (DIP) + cenários de erro | registrado no ADR-04 | active | 2026-11-13 |
| AD-005 | ver ADR-05 - JWT com usuários seedados e acesso rápido na UI | registrado no ADR-05 | active | 2026-11-13 |
| AD-006 | ver ADR-06 - Design tokens em 3 camadas e Tailwind CSS v4 | registrado no ADR-06 | active | 2026-11-13 |
| AD-007 | ver ADR-07 - Vite dev proxy (`/api`), React 18 e TanStack Query | registrado no ADR-07 | active | 2026-11-13 |
| AD-101 | ORD-12: título da página e títulos dos painéis em Plus Jakarta Sans e o restante do texto em Inter, as fontes do design system, no lugar da fonte do sistema (`system-ui`) que a figura4 desenha | pergunta: "Fonte: manter a do design system?"; usuário (D2): "manter as fontes do design system."; registro (D3): "autorizo registrar as diferenças visuais e de tokens em Differences e editar o .specs/STATE.md." | active | 2026-11-14 |
| AD-102 | ORD-12: cores dos tokens do design system no lugar das cores do protótipo - `--color-analytics` nas barras de setor e na série de volume, rampa do mapa horário por `color-mix` dos tokens azuis, fundo `--bg-canvas` e `Expirados` em `--color-warning` (âmbar), porque o design system não tem token laranja | pergunta: "Registrar fonte e cores dos tokens (incluindo Expirados âmbar) em Differences, com novas decisões no STATE.md"; usuário (D3): "autorizo registrar as diferenças visuais e de tokens em Differences e editar o .specs/STATE.md." | active | 2026-11-14 |
| AD-103 | ORD-12: ladrilho `SA` quadrado e coluna `21h` do mapa horário inteira, onde a figura4 desenha o ladrilho achatado e corta a coluna na borda - os dois vêm de defeitos do protótipo | pergunta: "Registro as duas em Differences, com a decisão no STATE.md, junto com a fonte e as cores?"; usuário: "Registrar as duas (Recomendado)" | active | 2026-11-14 |
| AD-104 | ORD-12: `saídas de veículos` com acento no rodapé do KPI de vouchers e no painel de estacionamento, onde a figura4 escreve `veiculos` sem acento - corrige um erro de grafia da captura | pergunta: "a figura4 escreve \"saídas de veiculos\" (sem acento) [...] a Tela 3 escreve \"veículos\" [...] Como fechar?"; usuário: "Registrar em Differences (Recomendado)" | active | 2026-11-14 |

A feature ORD-12 registra aqui AD-101 a AD-104, as diferenças entre a Tela 3 e a figura4 que o
usuário aprovou. As questões `blocks go-live` do plano dela (contrato do DTO com o ORD-10, campos que
o ORD-10 entrega, ticket médio e soma dos setores) devem virar **ADR-08 em diante** no documento de
arquitetura quando a equipe decidir, e só então ganhar uma linha aqui.
| ID | Decision | Rationale | Status | Date |
| --- | --- | --- | --- | --- |
| AD-001 | Monólito Modular em vez de Microsserviços | Prazo de 2 dias para MVP funcional de 3 telas, sem overhead de orquestração de rede | active | 2026-11-13 |
| AD-002 | Armazenamento de cpf_hash + cpf_mascarado | RNF04 / LGPD exige não expor CPF claro mas o domínio precisa deduplicar e agrupar compras | active | 2026-11-13 |
| AD-003 | Adiamento de itens_nota para a v2 (YAGNI) | Nenhuma das 3 telas do MVP precisa de granularidade por SKU/produto, apenas total da nota | active | 2026-11-13 |
| AD-004 | MockSefazGateway com Inversão de Dependência (DIP) | Integração real com SEFAZ fora do escopo do sábado; mock determinístico testa casos válidos e de erro | active | 2026-11-13 |
| AD-005 | JWT com Usuários Seedados e Acesso Rápido na UI | Evita construir fluxos complexos de recuperação de senha e permite alternar os 3 perfis na demo | active | 2026-11-13 |
| AD-006 | Design Tokens em 3 Camadas e Tailwind CSS v4 | Centraliza cores e tipografia evitando valores hex soltos nos componentes React | active | 2026-11-13 |
| AD-007 | Migrations Flyway versionadas separando Schema (V1) e Seeds (V2) | Garante rastreabilidade, imutabilidade de schema e facilidade de desativar seeds em produção | active | 2026-11-13 |

## Handoff

**Feature**: ORD-06-estacionamento  
**Where**: Build e Verificação da ORD-06 concluídos com **PASS** (`C1`–`C8`, 52/52 testes passando)  
**In progress**: Aguardando revisão do Lucas e autorização para `git push` da branch `feat/ORD-06-estacionamento`  
**Next step**: Push da branch, PR contra `develop` e avançar para a Onda 3 (`ORD-08` / `ORD-09` / `ORD-10`)  
**Blockers**: none  
**Uncommitted**: .specs/features/ORD-06-estacionamento/plan.md, .specs/features/ORD-06-estacionamento/checks.md, .specs/STATE.md  
**Branch**: feat/ORD-06-estacionamento  

