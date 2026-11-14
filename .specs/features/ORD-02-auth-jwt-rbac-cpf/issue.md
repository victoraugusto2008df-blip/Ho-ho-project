# [ORD-02] BACK — Autenticação JWT, RBAC & Hashing de CPF

Issue #2 · victoraugusto2008df-blip/Ho-ho-project

> Equipe 22 — Ho-Ho · MVP da entrega de sábado (vertical slice das 3 telas)
> Card oficial: `.docs/planning/mvp-sabado-kanban.md`

## Metadados do card

| Campo | Valor |
| --- | --- |
| ORD | ORD-02 |
| Stack | Backend (Dados & Segurança de Domínio) |
| Prioridade | 🔴 P0 — Crítica |
| Onda | 1 — Fundação de Domínio |
| Responsável | Dev 1 — Backend Core & Fiscal |
| Ordem de execução | 2º |
| Dependências | — nenhuma declarada no planejamento (Onda 1, em paralelo). Na prática consome os usuários seedados em #1 (ORD-01) |
| Bloqueia | #8 (ORD-08), #9 (ORD-09), #10 (ORD-10) |

## O que fazer

- Implementar `POST /api/v1/auth/login` retornando JWT com `role` (`CONSUMIDOR`, `LOJISTA`, `ADMIN_SHOPPING`) e `lojaId` / `clienteId`.
- Proteger rotas por perfil (`@PreAuthorize` / `SecurityFilterChain`) garantindo isolamento *multi-tenant*: o `lojaId` vem sempre do token, nunca enviado solto pelo front.
- Implementar utilitário de `cpf_hash` (SHA-256 + pepper via env var) e máscara `***.456.789-**` (LGPD).

## Critérios de aceite

- Lojista A não consegue consultar dados da Loja B.
- Consumidor não acessa rotas B2B.
- `POST /api/v1/auth/login` retorna JWT válido com `role` e `lojaId`/`clienteId` no payload.
- O `lojaId` usado nas consultas é sempre extraído do token, nunca do corpo/query da requisição.
- CPF é persistido apenas como `cpf_hash` (SHA-256 + pepper), nunca em texto puro.
- O pepper é lido de variável de ambiente (não está no código nem no repositório).
- CPF é exibido mascarado no formato `***.456.789-**`.

## Definição de pronto (DoD)

- Código revisado e aprovado em PR por outro integrante da equipe.
- Todos os critérios de aceite acima verificados.
- Teste provando o bloqueio cross-tenant (Loja A × Loja B) passando.
- `./mvnw test` passando.
- Contrato do endpoint documentado (exemplo de request e response).
- Nenhum segredo commitado.
- Merge na branch principal.
- Validado no ensaio da demo (ORD-14).
