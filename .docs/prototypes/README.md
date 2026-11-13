# Protótipos do MVP (3 telas)

Protótipos navegáveis em HTML estático das três telas da **Fase 1 — MVP Funcional** descritas em
[`../markdown/requirements.md`](../markdown/requirements.md) (seção 5). Todos os dados são **fictícios**
e gerados no navegador; a consulta à SEFAZ é simulada, no mesmo espírito do `MockSefazGateway` previsto para o backend.

São protótipos de baixo custo para validar fluxo, conteúdo e regras de negócio **antes** da implementação real em
React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts. Não são código de produção.

## Como abrir

1. Abra `index.html` no navegador (duplo clique; funciona via `file://`, sem build nem servidor).
2. Navegue entre as telas pelo menu superior/lateral.

Observações:

- É necessário acesso à internet: o Tailwind CSS é carregado pelo Play CDN (`https://cdn.tailwindcss.com`). Sem conexão, a página mostra um aviso e fica sem estilos.
- Gráficos são SVG/CSS feitos à mão (sem biblioteca) e todo o JavaScript é vanilla, embutido em cada arquivo.
- O estado é reiniciado ao recarregar a página.

## Arquivos

| Arquivo | Tela | Layout |
|---|---|---|
| `index.html` | Página inicial com links, explicação e tabela de rastreabilidade | — |
| `tela-1-consumidor.html` | Tela 1 — Consumidor (Ingestão e Estacionamento) | Mobile-first (moldura de celular no desktop) |
| `tela-2-lojista.html` | Tela 2 — Portal do Lojista (Insights e Ação) | Desktop com sidebar |
| `tela-3-shopping.html` | Tela 3 — Portal do Shopping (Visão Executiva) | Desktop com sidebar |

## O que cada tela demonstra

### Tela 1 — Consumidor

- CPF com máscara e validação dos dígitos verificadores (CPF de teste: `529.982.247-25`). Na tela, o CPF aparece parcialmente oculto.
- Chave NFC-e de 44 dígitos formatada em blocos de 4, com contador e validação do dígito verificador (módulo 11).
  A chave segue a estrutura oficial (cUF, AAMM, CNPJ, modelo 65...), e o CNPJ emissor é extraído dela.
- **Simular leitura de QR Code**: gera uma chave válida de uma loja aleatória do shopping, com valor aleatório.
- Checkbox de consentimento LGPD (obrigatório para enviar).
- Barra de progresso até R$ 150,00, atualizada a cada nota (com `role="progressbar"` e `aria-live`).
- Voucher de estacionamento com QR Code ilustrativo, código, horário de emissão, validade até o fechamento (22h) e status
  **pendente / utilizado / expirado**.
- “Painel do protótipo” (fora do celular) para simular: nota duplicada, nota com mais de 72h, CNPJ fora do shopping,
  nota de ontem (aceita, mas não soma para a meta de hoje), saída na cancela e fechamento do shopping.

### Tela 2 — Portal do Lojista

- KPIs: ticket médio, nº de vendas identificadas, taxa de recompra e faturamento identificado.
- Benchmarking: ticket médio da loja vs. mediana de Calçados, com aviso de K-anonimato. A aba “Calçados infantis”
  (apenas 2 lojistas) mostra o bloqueio da comparação (ReN05).
- Horários de pico (barras por hora, com filtro todos os dias / seg–sex / sáb–dom e tabela acessível).
- Afinidade de compras cruzadas por categoria (nunca por loja ou cliente).
- Campanha em 1 clique: segmento pré-qualificado (ex.: inativos há 60 dias), audiência estimada, desconto validado (5–50%),
  validade, prévia da mensagem e toast de sucesso simulado. Nenhum CPF ou dado pessoal é exibido.

### Tela 3 — Portal do Shopping

- Filtro de período (hoje / 7 dias / 30 dias) que troca todos os dados.
- KPIs consolidados, faturamento por segmento, volume de notas (linha por hora ou por dia), mapa de calor dia da semana × horário.
- Adesão ao estacionamento: vouchers emitidos, % das saídas de veículos, utilizados / expirados / pendentes.
- ROI das campanhas ativas, incluindo a receita do shopping pela taxa de sucesso por cupom convertido.

## Rastreabilidade (RF / ReN / RN)

| Código | Descrição resumida | Tela | Onde |
|---|---|---|---|
| RF01 | Envio da NFC-e por QR Code ou chave de 44 dígitos | 1 | Formulário + “Simular leitura de QR Code” |
| RF02 | Dados oficiais da nota via SEFAZ | 1 | **Simulado** (loja, data/hora, valor; sem itens/SKU/NCM) |
| RF03 | Unicidade + CNPJ de lojista ativo | 1 | Cenários “Nota duplicada” e “CNPJ fora do shopping” |
| RF04 | Progresso diário de consumo | 1 | Barra de progresso |
| RF05 | Voucher/QR Code com status pendente, utilizado, expirado | 1, 3 | Card do voucher; status consolidado na tela 3 |
| RF07 | Ticket médio, dias/horários de pico, frequência | 2, 3 | KPIs, horários de pico, linha + mapa de calor |
| RF08 | Compras cruzadas (afinidade entre categorias) | 2 | Card de afinidade |
| RF09 | Benchmarking (mediana da categoria vs. loja) | 2 | Card de benchmarking |
| RF10 | Dashboard do lojista | 2 | Tela inteira |
| RF11 | Campanhas para segmentos pré-qualificados | 2 | Card “Nova campanha em 1 clique” |
| RF12 | Painel executivo: faturamento por segmento, adesão ao estacionamento, ROI | 3 | Tela inteira |
| RF13 | Extrato de notas e status do estacionamento | 1 | Lista “Notas de hoje” + voucher |
| ReN01 | Nota processada uma única vez | 1 | Cenário “Nota duplicada” |
| ReN02 | Envio em até 72h da emissão | 1 | Cenário “Nota com mais de 72h” |
| ReN03 | R$ 150,00 em notas do mesmo dia | 1 | Meta da barra; cenário “Nota de ontem” |
| ReN04 | 1 isenção por CPF/dia, válida até o fechamento | 1 | Validade do voucher; aviso ao cadastrar mais notas |
| ReN05 | K-anonimato (≥ 3 lojistas) | 2 | Aba “Calçados infantis” |
| RN04 | LGPD: consentimento e dados agregados | 1, 2, 3 | Checkbox de consentimento; CPF mascarado; portais sem dados pessoais |

Fora do escopo destes protótipos: RF06 (carteira de pontos e catálogo de resgate), ofertas personalizadas do RF13,
autenticação/perfis reais (RNF04) e qualquer integração real.

## Ordem de validação usada no mock (Tela 1)

Sugestão de sequência para o caso de uso de cadastro de nota no backend (módulo `fiscal` → `beneficios`):

1. CPF válido e consentimento LGPD registrado (RN04)
2. Chave com 44 dígitos e dígito verificador correto (RF01)
3. Chave ainda não cadastrada no sistema (ReN01)
4. Consulta via `ConsultaNotaFiscalGateway` (RF02)
5. CNPJ emissor pertence a lojista ativo (RF03)
6. Emissão há no máximo 72h (ReN02)
7. Soma das notas **do dia** ≥ R$ 150,00 e sem voucher no dia → emite voucher (ReN03/ReN04)

Mensagens de erro exibidas (podem virar códigos de erro da API): “Nota já cadastrada”, “Prazo de envio expirado”,
“Loja não participante”, “Chave incompleta”, “Chave inválida”, “CPF inválido”, “Consentimento necessário”.

## Guia para a implementação (React + TypeScript + Tailwind + shadcn/ui + Recharts)

Identidade visual usada nos protótipos:

- Cor primária `brand` = indigo (`#4f46e5` / `brand-600`), neutros `zinc`. Pode virar `--primary` no tema do shadcn/ui.
- Cards `rounded-xl border bg-white shadow-sm`, abas no estilo `Tabs` do shadcn, badges arredondados.
- Gráficos: série principal azul `#2a78d6` (destaque `#184f95`), comparação neutra cinza; barra empilhada com azul, laranja `#eb6834` e verde-água `#1baf7a`; mapa de calor em rampa sequencial de um único azul.

Sugestões de componentes por tela:

| Tela | Componentes sugeridos | shadcn/ui / Recharts |
|---|---|---|
| Layout comum | `AppShell`, `PortalSidebar`, `PageHeader`, `PrototypeBadge` | `Sheet` (sidebar mobile), `Badge`, `Separator` |
| 1 · Consumidor | `CpfInput` (máscara), `NfceKeyInput` (44 dígitos + contador), `QrScanButton`, `LgpdConsentCheckbox`, `DailyProgressCard`, `ParkingVoucherCard` (com `VoucherStatusBadge`), `ReceiptList` / `ReceiptListItem`, `ValidationErrorAlert` | `Input`, `Textarea`, `Checkbox`, `Button`, `Progress`, `Alert`, `Card`, `Badge`, `Sonner`/`Toast` |
| 2 · Lojista | `KpiCard`, `BenchmarkCard` (+ `KAnonymityNotice`), `PeakHoursChart`, `CrossShoppingAffinityList`, `CampaignForm`, `AudienceEstimate`, `RecentCampaignsList` | `Card`, `Tabs`, `Select`, `Input`, `Button`, `Toast`; Recharts `BarChart` (vertical e `layout="vertical"`) |
| 3 · Shopping | `PeriodFilter`, `KpiCard`, `RevenueBySegmentChart`, `ReceiptVolumeChart`, `ReceiptHeatmap`, `ParkingAdoptionCard`, `CampaignRoiTable` | `Tabs`/`ToggleGroup`, `Card`, `Table`; Recharts `BarChart`, `LineChart`/`AreaChart` (heatmap pode ser uma grid CSS) |

Hooks/queries (TanStack Query) que as telas sugerem, para alinhar com os DTOs do backend:
`useReceiptsToday(cpf)`, `useSubmitReceipt()`, `useParkingVoucher(cpf)`, `useStoreKpis(period)`,
`useStoreBenchmark(category)`, `usePeakHours(days)`, `useCrossShopping()`, `useCreateCampaign()`,
`useMallOverview(period)`.
