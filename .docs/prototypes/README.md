# Protótipos do MVP: 3 Telas Navegáveis

Protótipos em HTML estático das três telas da **Fase 1 — MVP Funcional** descritas em [requirements.md](../markdown/requirements.md) (seção 5). Servem para validar fluxo, conteúdo e regras de negócio **antes** da implementação real em React + TypeScript + Vite. Não são código de produção.

> **Aviso:** Protótipo acadêmico da Equipe 22 — Ho-Ho, sem vínculo oficial com o Capim Dourado Shopping. Informações públicas do shopping usadas como contexto; todos os números são fictícios.

---

## 1. Como Abrir

* **Passo 1:** Abra `index.html` no navegador (duplo clique; funciona via `file://`, sem build nem servidor).
* **Passo 2:** Navegue entre as telas pelo menu superior/lateral.
* **Conexão:** É necessário acesso à internet, pois o Tailwind CSS é carregado pelo *Play CDN* (`https://cdn.tailwindcss.com`). Sem conexão, a página mostra um aviso e fica sem estilos.
* **Tecnologia:** Gráficos feitos à mão em SVG/CSS (sem biblioteca) e JavaScript puro embutido em cada arquivo. Todos os dados são fictícios e gerados no navegador.
* **Estado:** É reiniciado ao recarregar a página.

---

## 2. Arquivos

* **`index.html`:** Página inicial com links para as telas, explicação e rastreabilidade de requisitos.
* **`tela-1-consumidor.html`:** Tela 1 — Consumidor (Ingestão e Estacionamento). Layout *mobile-first* (moldura de celular no desktop). Perfil `CONSUMIDOR`.
* **`tela-2-lojista.html`:** Tela 2 — Portal do Lojista (Insights e Ação). Layout desktop com menu lateral. Perfil `LOJISTA`.
* **`tela-3-shopping.html`:** Tela 3 — Portal do Shopping (Visão Executiva). Layout desktop com menu lateral. Perfil `ADMIN_SHOPPING`.

---

## 3. O Que Cada Tela Demonstra

### Tela 1 — Consumidor
* **CPF:** Máscara e validação dos dígitos verificadores (CPF de teste: `529.982.247-25`). Na tela, o CPF aparece parcialmente oculto.
* **Chave NFC-e:** 44 dígitos formatados em blocos de 4, com contador e validação do dígito verificador (módulo 11). A chave segue a estrutura oficial (cUF, AAMM, CNPJ, modelo 65...) e o CNPJ emissor é extraído dela.
* **Simular leitura de QR Code:** Gera uma chave válida de uma loja aleatória do shopping, com valor aleatório.
* **Consentimento LGPD:** Checkbox obrigatório para enviar a nota.
* **Barra de progresso:** Até R$ 150,00, atualizada a cada nota cadastrada.
* **Voucher de estacionamento:** QR Code ilustrativo, código, horário de emissão, validade até o fechamento (seg. a sáb. 22h; dom. 20h), economia da diária (R$ 15,00) e status pendente / utilizado / expirado.
* **Painel do protótipo:** Controles fora do celular para simular nota duplicada, nota com mais de 72h, CNPJ fora do shopping, nota de ontem (aceita, mas não soma para a meta de hoje), saída na cancela e fechamento do shopping.

### Tela 2 — Portal do Lojista
* **Indicadores:** Ticket médio, número de vendas identificadas, taxa de recompra e faturamento identificado.
* **Benchmarking:** Ticket médio da loja vs. mediana de Calçados, com aviso de *K-Anonymity*. A aba "Calçados infantis" (apenas 2 lojistas) mostra o bloqueio da comparação.
* **Horários de pico:** Barras por hora, com filtro todos os dias / seg-sex / sáb-dom e tabela acessível.
* **Afinidade de compras cruzadas:** Por categoria, nunca por loja ou cliente.
* **Campanha em 1 clique:** Segmento pré-qualificado (ex: inativos há 60 dias), audiência estimada, desconto, validade, prévia da mensagem e confirmação simulada. Nenhum CPF ou dado pessoal é exibido.

### Tela 3 — Portal do Shopping
* **Filtro de período:** Hoje / 7 dias / 30 dias, trocando todos os dados.
* **Visão consolidada:** Indicadores gerais, faturamento por segmento, volume de notas (por hora ou por dia) e mapa de calor dia da semana x horário.
* **Adesão ao estacionamento:** Vouchers emitidos, percentual das saídas de veículos e status utilizados / expirados / pendentes.
* **ROI das campanhas ativas:** Inclui a receita do shopping pela taxa de sucesso por cupom convertido.

---

## 4. Rastreabilidade de Requisitos

### Requisitos de Negócio (RN)
* **RN01:** Tela 1 — benefício imediato do estacionamento grátis como incentivo ao cadastro.
* **RN02:** Tela 2 — benchmarking, compras cruzadas e campanhas para o lojista.
* **RN03:** Tela 3 — visão consolidada e taxa de sucesso das campanhas para o shopping.
* **RN04:** Telas 1, 2 e 3 — checkbox de consentimento, CPF mascarado e portais apenas com dados agregados.

### Requisitos Funcionais (RF)
* **RF01:** Tela 1 — formulário de chave de 44 dígitos e botão "Simular leitura de QR Code".
* **RF02:** Tela 1 — **simulado** (loja, data/hora e valor; sem itens/SKU/NCM).
* **RF03:** Tela 1 — cenários "Nota duplicada" e "CNPJ fora do shopping".
* **RF04:** Tela 1 — barra de progresso diária.
* **RF05:** Telas 1 e 3 — voucher com status pendente, utilizado e expirado; status consolidado no portal do shopping.
* **RF07:** Telas 2 e 3 — ticket médio, horários de pico, gráfico de linha e mapa de calor.
* **RF08:** Tela 2 — card de afinidade de compras cruzadas.
* **RF09:** Tela 2 — card de benchmarking.
* **RF10:** Tela 2 — tela inteira.
* **RF11:** Tela 2 — card "Nova campanha em 1 clique".
* **RF12:** Tela 3 — tela inteira.
* **RF13:** Tela 1 — lista "Notas de hoje" e status do voucher (parcial: sem ofertas).

### Regras de Negócio (ReN)
* **ReN01:** Tela 1 — cenário "Nota duplicada".
* **ReN02:** Tela 1 — cenário "Nota com mais de 72h".
* **ReN03:** Tela 1 — meta de R$ 150,00 e cenário "Nota de ontem".
* **ReN04:** Tela 1 — validade do voucher até o fechamento e aviso de 1 isenção por CPF/dia.
* **ReN05:** Tela 2 — aba "Calçados infantis" (menos de 3 lojistas) bloqueia a comparação.

### Fora do Escopo dos Protótipos
* **RF06:** Carteira de pontos e catálogo de resgate.
* **RF13 (ofertas):** Ofertas personalizadas ao consumidor.
* **RNF04:** Autenticação e perfis reais (os perfis aparecem apenas como rótulo).
* **Integrações:** Nenhuma integração real (SEFAZ, banco de dados ou API).

---

## 5. Premissas do Protótipo (Não Definidas nos Requisitos)

Valores criados apenas para dar realismo às telas. **Não são regras aprovadas pela equipe**; se forem aceitas, podem virar novas Regras de Negócio (ReN06 em diante) em [requirements.md](../markdown/requirements.md).

* **Taxa de sucesso do shopping:** R$ 2,50 por cupom convertido (base do cálculo de ROI na Tela 3).
* **Fórmula de ROI:** (receita gerada - custo da campanha) / custo da campanha, sendo custo = desconto concedido + taxa de sucesso.
* **Desconto de campanha:** Entre 5% e 50%.
* **Validade do cupom:** 7, 15 ou 30 dias.
* **Conversão esperada de campanha:** Entre 8% e 12% da audiência.
* **Taxa de recompra:** Janela de 90 dias.

---

## 6. Contexto: Capim Dourado Shopping (Palmas – TO)

Fatos públicos usados para dar realismo às telas. Pesquisa feita em 13/11/2026 por mecanismo de busca (o ambiente de desenvolvimento não abria os sites diretamente); **confirme no site oficial antes de apresentar**, pois horários e tarifas podem mudar.

* **Nome oficial:** Capim Dourado Shopping. Fontes: [site oficial](https://capimdouradosc.com.br/), [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping).
* **Endereço:** Quadra 107 Norte, Av. NS-5, s/n, Plano Diretor Norte, Palmas – TO, CEP 77001-098. Fonte: [site oficial — SAC](https://capimdouradosc.com.br/servico/?servico=sac-servico-de-atendimento-ao-cliente).
* **Horário de lojas e quiosques:** Seg. a sáb. 10h-22h; dom. 14h-20h. Fontes: [site oficial — SAC](https://capimdouradosc.com.br/servico/?servico=sac-servico-de-atendimento-ao-cliente), [Ingresso.com](https://www.ingresso.com/espetaculos/locais/capim-dourado-shopping).
* **Horário dos restaurantes:** Seg. a sáb. 11h-22h; dom. 11h-20h. Fonte: [site oficial — Alimentação](https://capimdouradosc.com.br/alimentacao/).
* **Inauguração:** 17/08/2010. Fontes: [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping), [Prefeitura de Palmas](https://www.palmas.to.gov.br/core/noticias/capim-dourado-shopping-e-inaugurado-com-a-presenca-do-prefeito-raul-filho/), [Conexão Tocantins](https://conexaoto.com.br/2010/08/12/capim-dourado-shopping-sera-inaugurado-na-terca-17).
* **Estrutura:** 1 piso; ABL de aproximadamente 39 mil m²; 10 âncoras e megalojas; 6 salas de cinema; 967 vagas de estacionamento. Fonte: [Soul Malls — ficha técnica](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping).
* **Número de lojas:** 147 lojas (Soul Malls) ou 153 operações (Hedge Brasil Shopping FII). Fontes: [Soul Malls](https://soulmalls.com.br/cliente/?cliente=capim-dourado-shopping), [Hedge Investments](https://www.hedgeinvest.com.br/en/ativos/capim-dourado-shopping/).
* **Administração:** Soul Malls. Fontes: as mesmas do item anterior.
* **Histórico:** Desenvolvido pelo Grupo Skipton e depois adquirido pela BRMalls (R$ 177,1 milhões). Fontes: [Exame](https://exame.com/negocios/br-malls-adquire-seu-50o-shopping/), [Fusões & Aquisições](https://fusoesaquisicoes.com/acontece-no-setor/brmallscia-compra-shopping-capim/).
* **Mix (exemplos):** Vestuário, esportes, brinquedos, cinema, lazer infantil, alimentação e serviços (ex: Detran e Resolve Palmas). Fonte: [site oficial — Lojas](https://www.capimdouradosc.com.br/lojas/).
* **Estacionamento:** Pago; diária sem pernoite R$ 15,00 (R$ 14,00 pelo app); pernoite R$ 50,00; tolerância de 15 min. Fonte: [site oficial — Estacionamento](https://www.capimdouradosc.com.br/servico/?servico=estacionamento).

### Como Esses Fatos Aparecem nas Telas
* **Cabeçalhos:** Nome do shopping e "Palmas – TO" nas 3 telas; "Administração Capim Dourado" na Tela 3.
* **ReN04:** O voucher vale até o fechamento das lojas no dia (seg. a sáb. 22h; dom. 20h). Feriados não foram modelados.
* **Tela 1:** Linha "Economia de R$ 15,00 no estacionamento" no voucher; chaves NFC-e simuladas com cUF 17 (Tocantins).
* **Telas 2 e 3:** Loja no "Piso único"; segmento "Lazer" (cinema e diversões); "967 vagas" no card de estacionamento.

### O Que Não Foi Usado ou Confirmado
* **Marca:** Logotipo e imagens do shopping não foram usados.
* **Lojas:** As lojas citadas nas telas (ex: Passo Firme Calçados, Sabor da Serra Café) são **fictícias**; nenhum faturamento, venda ou resultado de campanha é atribuído a marcas reais.
* **Não confirmado:** Horários de feriados, supermercado atual do shopping (as fontes citam Mateus e Mercado&Cia) e contagem exata de lojas.

---

## 7. Sugestões para a Implementação

Sugestões não decididas pela equipe, apenas para facilitar a transição do protótipo para React + TypeScript + Tailwind CSS + shadcn/ui + Recharts.

### Ordem de Validação do Cadastro de Nota (Módulos `fiscal` → `beneficios`)
1. CPF válido e consentimento LGPD registrado (RN04).
2. Chave com 44 dígitos e dígito verificador correto (RF01).
3. Chave ainda não cadastrada no sistema (ReN01).
4. Consulta via `ConsultaNotaFiscalGateway` / `MockSefazGateway` (RF02).
5. CNPJ emissor pertence a lojista ativo (RF03).
6. Emissão há no máximo 72h (ReN02).
7. Soma das notas **do dia** maior ou igual a R$ 150,00 e sem voucher no dia: emite voucher (ReN03/ReN04).

Mensagens de erro exibidas (podem virar códigos de erro da API): "Nota já cadastrada", "Prazo de envio expirado", "Loja não participante", "Chave incompleta", "Chave inválida", "CPF inválido", "Consentimento necessário".

### Identidade Visual Usada
* **Cor primária:** Indigo (`#4f46e5`) com neutros `zinc`; pode virar `--primary` no tema do shadcn/ui.
* **Componentes:** Cards com bordas arredondadas, abas no estilo `Tabs` do shadcn/ui e badges arredondados.
* **Gráficos:** Série principal azul (`#2a78d6`), comparação em cinza, mapa de calor em escala de azul.
* **Marca "SA":** Sigla provisória do produto (Shopping Analytics), criada só para o protótipo.

### Componentes Sugeridos (Nomes de Domínio em Português)
* **Layout comum:** `LayoutPortal`, `MenuLateral`, `CabecalhoPagina`, `SeloPrototipo`.
* **Tela 1 — Consumidor:** `CampoCpf`, `CampoChaveNfce`, `BotaoLerQrCode`, `ConsentimentoLgpd`, `CardProgressoDiario`, `CardVoucherEstacionamento`, `ListaNotasDoDia`, `AlertaErroValidacao`.
* **Tela 2 — Lojista:** `CardIndicador`, `CardBenchmarking`, `AvisoKAnonymity`, `GraficoHorariosPico`, `ListaAfinidadeCompras`, `FormularioCampanha`, `ListaCampanhasRecentes`.
* **Tela 3 — Shopping:** `FiltroPeriodo`, `GraficoFaturamentoSegmento`, `GraficoVolumeNotas`, `MapaCalorNotas`, `CardAdesaoEstacionamento`, `TabelaRoiCampanhas`.

### Hooks do TanStack Query Sugeridos
* **Consumidor:** `useNotasDoDia(cpf)`, `useCadastrarNota()`, `useVoucherEstacionamento(cpf)`.
* **Lojista:** `useIndicadoresLoja(periodo)`, `useBenchmarking(categoria)`, `useHorariosPico(dias)`, `useAfinidadeCompras()`, `useCriarCampanha()`.
* **Shopping:** `useVisaoExecutiva(periodo)`.
