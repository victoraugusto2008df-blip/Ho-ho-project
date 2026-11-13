# Protótipos do MVP (3 telas)

Protótipos navegáveis em HTML estático das três telas da **Fase 1 — MVP Funcional** descritas em
[`../markdown/requirements.md`](../markdown/requirements.md) (seção 5). Todos os dados são **fictícios**
e gerados no navegador; a consulta à SEFAZ é simulada, no mesmo espírito do `MockSefazGateway` previsto para o backend.

São protótipos de baixo custo para validar fluxo, conteúdo e regras de negócio **antes** da implementação real em
React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts. Não são código de produção.

As telas usam como contexto o **Capim Dourado Shopping**, em Palmas – TO (ver seção
[Contexto](#contexto-capim-dourado-shopping-palmas--to)).

> **Aviso:** Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping. Informações públicas do shopping usadas como contexto; todos os números são fictícios.

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

## Contexto: Capim Dourado Shopping (Palmas – TO)

Fatos públicos usados para dar realismo às telas. Pesquisa feita em **13/11/2026** (data de acesso de todas as fontes).
As páginas foram consultadas por mecanismo de busca (o ambiente de desenvolvimento não abria os sites diretamente);
confirme no site oficial antes de apresentar, pois horários e tarifas podem mudar.

| Fato | Valor | Fonte |
|---|---|---|
| Nome oficial | Capim Dourado Shopping | [Site oficial](https://capimdouradosc.com.br/) · [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping) |
| Endereço | Quadra 107 Norte, Av. NS-5, s/n, Plano Diretor Norte, Palmas – TO, CEP 77001-098 | [Site oficial — SAC](https://capimdouradosc.com.br/servico/?servico=sac-servico-de-atendimento-ao-cliente) |
| Horário de lojas e quiosques | Seg. a sáb. 10h–22h; dom. 14h–20h | [Site oficial — SAC](https://capimdouradosc.com.br/servico/?servico=sac-servico-de-atendimento-ao-cliente) · [Ingresso.com](https://www.ingresso.com/espetaculos/locais/capim-dourado-shopping) |
| Horário dos restaurantes | Seg. a sáb. 11h–22h; dom. 11h–20h | [Site oficial — Alimentação](https://capimdouradosc.com.br/alimentacao/) |
| Inauguração | Agosto de 2010 (17/08/2010) | [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping) · [Prefeitura de Palmas](https://www.palmas.to.gov.br/core/noticias/capim-dourado-shopping-e-inaugurado-com-a-presenca-do-prefeito-raul-filho/) · [Conexão Tocantins](https://conexaoto.com.br/2010/08/12/capim-dourado-shopping-sera-inaugurado-na-terca-17) |
| Estrutura | 1 piso; ABL de ~39 mil m²; 10 âncoras e megalojas; 6 salas de cinema; 967 vagas de estacionamento | [Soul Malls — ficha técnica](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping) |
| Número de lojas | 147 lojas (Soul Malls) / 153 operações (Hedge Brasil Shopping FII) | [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping) · [Hedge Investments](https://www.hedgeinvest.com.br/en/ativos/capim-dourado-shopping/) |
| Administração | Soul Malls | [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping) · [Hedge Investments](https://www.hedgeinvest.com.br/en/ativos/capim-dourado-shopping/) |
| Histórico | Desenvolvido pelo Grupo Skipton; depois adquirido pela BRMalls (R$ 177,1 milhões) | [Conexão Tocantins](https://conexaoto.com.br/2010/08/12/capim-dourado-shopping-sera-inaugurado-na-terca-17) · [Exame](https://exame.com/negocios/br-malls-adquire-seu-50o-shopping/) · [Fusões & Aquisições](https://fusoesaquisicoes.com/acontece-no-setor/brmallscia-compra-shopping-capim/) |
| Mix (exemplos) | Vestuário (Renner, Riachuelo, C&A), esportes (Centauro), brinquedos (Ri Happy), cinema (Cinemark), lazer infantil (Zig Zag Play), alimentação (praça de alimentação e restaurantes), serviços (Detran, Resolve Palmas, lavanderia) | [Site oficial — Lojas](https://www.capimdouradosc.com.br/lojas/) · [Site oficial — Alimentação](https://capimdouradosc.com.br/alimentacao/) · [Hedge Investments](https://www.hedgeinvest.com.br/en/ativos/capim-dourado-shopping/) |
| Estacionamento | Pago: diária (sem pernoite) R$ 15,00 (R$ 14,00 pelo app); pernoite R$ 50,00; tolerância de 15 min | [Site oficial — Estacionamento](https://www.capimdouradosc.com.br/servico/?servico=estacionamento) |

Como esses fatos aparecem nos protótipos:

- Nome do shopping e “Palmas – TO” nos cabeçalhos das 3 telas; administração “Administração Capim Dourado” na tela 3.
- **ReN04:** o voucher vale até o fechamento das lojas no dia (seg. a sáb. 22h; dom. 20h). Feriados e datas especiais têm horários próprios e não foram modelados.
- Tela 1: linha “Economia de R$ 15,00 no estacionamento” no voucher (valor da diária); chaves NFC-e simuladas com cUF 17 (Tocantins).
- Tela 2: loja no “Piso único”. Telas 2 e 3: segmento “Lazer” (cinema e diversões) no lugar de “Livraria”, que não foi confirmada no mix.
- Tela 3: “967 vagas” no card de estacionamento.

O que **não** foi usado: logotipo e imagens do shopping (a marca “SA” do produto foi mantida). As lojas citadas nas telas
(Passo Firme Calçados, Sabor da Serra Café etc.) continuam **fictícias**, e nenhum faturamento, venda ou resultado de campanha
é atribuído a marcas reais. Não foi possível confirmar: horários de feriados, qual é hoje o supermercado do shopping
(as fontes citam Mateus e Mercado&Cia) e a contagem atual exata de lojas.

## O que cada tela demonstra

### Tela 1 — Consumidor

- CPF com máscara e validação dos dígitos verificadores (CPF de teste: `529.982.247-25`). Na tela, o CPF aparece parcialmente oculto.
- Chave NFC-e de 44 dígitos formatada em blocos de 4, com contador e validação do dígito verificador (módulo 11).
  A chave segue a estrutura oficial (cUF, AAMM, CNPJ, modelo 65...), e o CNPJ emissor é extraído dela.
- **Simular leitura de QR Code**: gera uma chave válida de uma loja aleatória do shopping, com valor aleatório.
- Checkbox de consentimento LGPD (obrigatório para enviar).
- Barra de progresso até R$ 150,00, atualizada a cada nota (com `role="progressbar"` e `aria-live`).
- Voucher de estacionamento com QR Code ilustrativo, código, horário de emissão, validade até o fechamento
  (seg. a sáb. 22h; dom. 20h), economia da diária do estacionamento (R$ 15,00) e status **pendente / utilizado / expirado**.
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
