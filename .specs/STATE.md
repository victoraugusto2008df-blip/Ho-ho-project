# Project state

## Decisions

Este arquivo é **apenas um índice**. O log de decisões oficial do projeto continua sendo a seção 4
("Architecture Decision Records") de
[`.docs/architecture/architecture-and-domain.md`](../.docs/architecture/architecture-and-domain.md),
onde as decisões nasceram e onde a equipe já procura. Nada do conteúdo dos ADRs é duplicado aqui:
`references/memory.md` da skill manda acrescentar ao log que já existe e não iniciar um segundo.

O índice existe porque `scripts/validate_plan.py` resolve referências `AD-NNN` lendo exclusivamente
este arquivo. Decisões novas devem ser escritas **primeiro** como ADR no documento de arquitetura e
então espelhadas aqui em uma linha, com o mesmo número.

| ID | Decision | Rationale | Status | Date |
| --- | --- | --- | --- | --- |
| AD-001 | ver ADR-01 em `.docs/architecture/architecture-and-domain.md` - Monólito Modular em vez de Microsserviços | registrado no ADR-01 | active | 2026-11-13 |
| AD-002 | ver ADR-02 - Armazenamento de `cpf_hash` + `cpf_mascarado` (LGPD) | registrado no ADR-02 | active | 2026-11-13 |
| AD-003 | ver ADR-03 - Adiamento da tabela `itens_nota` para a v2 (YAGNI) | registrado no ADR-03 | active | 2026-11-13 |
| AD-004 | ver ADR-04 - `MockSefazGateway` atrás de interface (DIP) + cenários de erro | registrado no ADR-04 | active | 2026-11-13 |
| AD-005 | ver ADR-05 - JWT com usuários seedados e acesso rápido na UI | registrado no ADR-05 | active | 2026-11-13 |
| AD-006 | ver ADR-06 - Design tokens em 3 camadas e Tailwind CSS v4 | registrado no ADR-06 | active | 2026-11-13 |
| AD-007 | ver ADR-07 - Vite dev proxy (`/api`), React 18 e TanStack Query | registrado no ADR-07 | active | 2026-11-13 |

Nenhuma decisão nova foi tomada pela feature ORD-12: seu `plan.md` registra
`## Differences from the source` como `None`, portanto não há departure da fonte vinculante a
aprovar. As duas questões `blocks go-live` do plano (contrato do DTO com o ORD-10 e os campos que o
DER não sustenta) devem virar **ADR-08 em diante** no documento de arquitetura quando a equipe
decidir, e só então ganhar uma linha aqui.
