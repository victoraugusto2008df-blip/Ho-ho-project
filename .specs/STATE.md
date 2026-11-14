# Project state

## Decisions

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

**Feature**: ORD-01-migrations-seeds  
**Where**: Build e Verificação Round 2 concluídos com **PASS** (`C1`–`C10`, 11/11 testes passando)  
**In progress**: Aguardando revisão do Lucas e autorização para `git push` da branch `feat/ORD-01-migrations-seeds`  
**Next step**: Push da branch, PR contra `develop` e início da `ORD-02`  
**Blockers**: none  
**Uncommitted**: none  
**Branch**: feat/ORD-01-migrations-seeds  

