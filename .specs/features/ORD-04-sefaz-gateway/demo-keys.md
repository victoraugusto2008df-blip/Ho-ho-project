# Chaves Determinísticas — `MockSefazGateway` (ORD-04)

Tabela de referência para uso nos testes, no Frontend (`ORD-07`) e no Ensaio da Demo (`ORD-14`).

| Chave de Acesso (44 dígitos) | Loja / CNPJ | Valor | Emissão relativa | Cenário / Regra |
| --- | --- | --- | --- | --- |
| `35261111111111000101650010000001010000000101` | Zara Shopping Hub (`11111111000101`) | R$ 65,00 | -2 horas | Nota válida credenciada (Par 1 -> + R$ 85,00 = R$ 150,00) |
| `35261122222222000102650010000001020000000102` | Renner Shopping Hub (`22222222000102`) | R$ 85,00 | -1 hora | Nota válida credenciada (Par 1 -> + R$ 65,00 = R$ 150,00) |
| `35261155555555000105650010000001030000000103` | Fast Shop (`55555555000105`) | R$ 55,00 | -4 horas | Nota válida credenciada (Par 2 -> + R$ 95,00 = R$ 150,00) |
| `35261144444444000104650010000001040000000104` | Burger King (`44444444000104`) | R$ 95,00 | -3 horas | Nota válida credenciada (Par 2 -> + R$ 55,00 = R$ 150,00) |
| `35261111111111000101650010000001050000000105` | Zara Shopping Hub (`11111111000101`) | R$ 120,00 | -96 horas | **ReN02**: Nota expirada (> 72h) |
| `35261199999999000199650010000001060000000106` | Loja Externa (`99999999000199`) | R$ 75,00 | -1 hora | **RF03**: CNPJ fora do shopping |
| Qualquer outra chave de 44 dígitos numéricos | — | — | — | Retorna `Optional.empty()` |
