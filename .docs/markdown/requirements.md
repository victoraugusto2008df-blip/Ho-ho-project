# Documento de Requisitos: Plataforma de Inteligência Fiscal e Benefícios para Shopping Centers

---

## 1. Requisitos de Negócio (RN) - O "Porquê"
Definem os objetivos estratégicos do projeto e o valor entregue aos três atores (Consumidor, Lojista e Shopping).

* **RN01 (Engajamento do Consumidor):** O sistema deve incentivar o consumidor a cadastrar suas notas fiscais (NFC-e) voluntariamente através de benefícios imediatos e de alto valor percebido (isenção do estacionamento, clube de vantagens e cupons personalizados).
* **RN02 (Empoderamento do Lojista):** O sistema deve fornecer aos lojistas inteligência transacional acionável (benchmarking de categoria, correlações de compras e ferramentas de campanhas direcionadas), elevando o ticket médio e as vendas cruzadas.
* **RN03 (Inteligência e Monetização para o Shopping):** O sistema deve fornecer à administração uma visão consolidada do fluxo real de faturamento por segmento/corredor, viabilizando novas linhas de receita B2B (assinatura de módulos do portal e taxa por conversão de campanhas).
* **RN04 (Conformidade Legal e Privacidade):** O sistema deve estar em total conformidade com a LGPD (Lei Geral de Proteção de Dados), operando sob consentimento explícito e garantindo que dados confidenciais de faturamento de uma loja jamais sejam expostos a concorrentes.

---

## 2. Requisitos Funcionais (RF) - O "O Quê"
Funcionalidades e operações que o sistema deve executar, organizadas por módulos de domínio.

### Módulo de Ingestão e Validação Fiscal
* **RF01:** O sistema deve permitir que o consumidor envie sua NFC-e via leitura do QR Code pela câmera/upload de imagem ou digitação manual da chave de acesso de 44 dígitos da SEFAZ.
* **RF02:** O sistema deve integrar-se a serviços da SEFAZ/APIs fiscais para extrair os dados oficiais da nota: CNPJ emissor, data/hora da emissão, itens comprados (descrição, SKU, NCM, quantidade, valor unitário) e valor total.
* **RF03:** O sistema deve validar a unicidade da nota fiscal (impedindo cadastros duplicados) e checar se o CNPJ emissor pertence a um lojista ativo no shopping.

### Módulo de Benefícios e Estacionamento
* **RF04:** O sistema deve calcular automaticamente o progresso diário de consumo do cliente para concessão de isenção de estacionamento com base nas notas cadastradas no dia.
* **RF05:** O sistema deve gerar um comprovante digital / QR Code de liberação do estacionamento assim que a meta de consumo diário for atingida, com validação de status (pendente, utilizado, expirado).
* **RF06:** O sistema deve gerenciar a carteira de pontos/créditos do cliente acumulados por compras, permitindo o resgate de benefícios do catálogo.

### Módulo de Inteligência Analítica e Insights
* **RF07:** O sistema deve calcular métricas transacionais agregadas por cliente, loja e setor: Ticket Médio, dias e horários com maior volume de compras e frequência de retorno.
* **RF08:** O sistema deve identificar padrões de compras cruzadas (*Market Basket Analysis* / afinidade entre categorias) correlacionando compras realizadas em lojas distintas no mesmo ciclo de visita.
* **RF09:** O sistema deve calcular indicadores de benchmarking setorial (ex: mediana do ticket médio da categoria vs. ticket médio da loja específica).

### Módulo de Portais Web e Ações (Lojista, Gestão e Cliente)
* **RF10 (Portal do Lojista - Dashboard):** O sistema deve disponibilizar um portal web onde o lojista visualize métricas de desempenho da sua própria loja, benchmarking contra a média da categoria e perfil de consumo dos seus compradores.
* **RF11 (Portal do Lojista - Campanhas):** O sistema deve permitir que o lojista crie campanhas de cupons de desconto direcionadas a segmentos pré-qualificados pelo shopping (ex: *"Clientes do setor de calçados inativos na sua loja há 60 dias"*), com disparo automático via app do shopping.
* **RF12 (Portal Administrativo - Shopping):** O sistema deve oferecer um painel executivo para a gestão do shopping visualizar o faturamento global por segmento, adesão ao programa de estacionamento e ROI das campanhas ativas.
* **RF13 (Portal/App do Consumidor):** O sistema deve fornecer uma interface para o cliente consultar seu extrato de notas cadastradas, saldo de benefícios, status de liberação do estacionamento e ofertas disponíveis.

---

## 3. Requisitos Não Funcionais (RNF) - O "Como"
Critérios de qualidade técnica, arquiteturais e de infraestrutura.

* **RNF01 (Tecnologia Backend):** O backend deve ser desenvolvido em **Java 21 LTS** utilizando o framework **Spring Boot 3.x**, adotando os princípios de **Clean Architecture** e aproveitando recursos modernos como **Virtual Threads (Project Loom)** para chamadas I/O assíncronas com APIs fiscais.
* **RNF02 (Tecnologia Frontend):** As interfaces web (Portal do Lojista e Dashboard do Shopping) devem ser construídas em **React com TypeScript**, estruturadas com componentes modulares e contratos tipados baseados no OpenAPI/Swagger da API.
* **RNF03 (Segurança e LGPD):** O CPF do usuário deve ser protegido com criptografia e técnicas de hashing seguro. O acesso aos dados deve seguir controle baseado em perfis (RBAC), aplicando isolamento rigoroso entre inquilinos (*Multi-tenancy* lógico) para que um lojista jamais acesse transações brutas de outra loja.
* **RNF04 (Desempenho e Resiliência):** A ingestão e validação das notas fiscais devem ocorrer de forma assíncrona (com mensageria ou background tasks), garantindo resposta imediata ao usuário na submissão da nota e tolerância a lentidões ocasionais da SEFAZ.
* **RNF05 (Disponibilidade e Escalabilidade):** O sistema deve manter 99,5% de disponibilidade, com suporte a picos de tráfego típicos de datas comerciais (ex: Black Friday, Natal e fins de semana).

---

## 4. Regras de Negócio (ReN) - As Leis do Sistema
Lógicas e restrições que governam o funcionamento das regras de domínio.

* **ReN01 (Unicidade Fiscal):** Uma nota fiscal (identificada unicamente pela chave de 44 dígitos da NFC-e) só pode ser processada e pontuada uma única vez em todo o sistema.
* **ReN02 (Prazo de Envio):** As notas fiscais só serão aceitas se forem cadastradas em até **72 horas** a partir da data/hora de emissão impressa no cupom.
* **ReN03 (Regra do Estacionamento Grátis):** O cliente terá direito a 1 isenção de estacionamento no dia ao acumular no mínimo **R$ 150,00** em notas fiscais cadastradas e validadas, emitidas no **mesmo dia** por lojas físicas do shopping.
* **ReN04 (Limite de Isenção):** O benefício de isenção de estacionamento é limitado a 1 resgate por CPF por dia civil e possui validade para saída até o horário de fechamento do shopping no mesmo dia.
* **ReN05 (Privacidade de Benchmarking / K-Anonymity):** O portal só exibirá a média/mediana de benchmarking de uma categoria se houver pelo menos **3 lojistas distintos e ativos** registrados naquele mesmo segmento, impedindo a dedução indireta de dados de um concorrente único.
