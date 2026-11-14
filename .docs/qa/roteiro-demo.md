# Roteiro da demonstração (ORD-14)

Roteiro que a Equipe 22 segue na banca, na ordem. O mesmo roteiro roda automatizado, pela API,
em `backend/src/test/java/com/hoho/shoppinghub/RoteiroDemoE2ETest.java`: duas vezes seguidas,
cada uma sobre um banco recriado do zero.

**Responsável pela condução:** _a definir pela equipe_
**Apoio (opera o plano B):** _a definir pela equipe_

## Subida do zero

Cada ensaio começa com o banco limpo. As chaves de teste só valem uma vez: sem zerar o banco, o
passo 2 responde "nota já cadastrada".

```bash
# 1. Banco limpo (apaga o volume e sobe o Postgres de novo)
docker compose down -v
docker compose up -d postgres

# 2. Backend (porta 8080); as migrations criam as tabelas e os dados de demonstração
cd backend
./mvnw spring-boot:run

# 3. Frontend (porta 5173), em outro terminal
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. O Swagger fica em `http://localhost:8080/swagger-ui.html`.

Antes de chamar a banca, confira: a tela de acesso mostra os 3 botões e "Entrar como Consumidor"
abre a Tela 1 com "R$ 0,00" no progresso.

## Chaves de teste

| Uso | Chave de acesso (44 dígitos) | O que é |
| --- | --- | --- |
| Passo 1 | `35261111111111000101650010000001050000000105` | Zara, R$ 120,00, emitida há 96 horas |
| Passo 2 (1ª nota) | `35261111111111000101650010000001010000000101` | Zara, R$ 65,00, emitida há 2 horas |
| Passo 2 (2ª nota) | `35261122222222000102650010000001020000000102` | Renner, R$ 85,00, emitida há 1 hora |
| Reserva | `35261155555555000105650010000001030000000103` | Fast Shop, R$ 55,00 |
| Reserva | `35261144444444000104650010000001040000000104` | Burger King, R$ 95,00 |
| Extra (ReN01) | `35261111111111000101650010000000010000000001` | nota do seed, já cadastrada |
| Extra (RF03) | `35261199999999000199650010000001060000000106` | CNPJ que não é loja do shopping |

Na Tela 1 não é preciso digitar: os botões do "Painel do protótipo" e "Simular leitura de QR Code"
preenchem essas chaves.

## Passo 1 - nota com mais de 72 horas é bloqueada

- **Perfil:** Consumidor ("Entrar como Consumidor").
- **O que fazer:** marcar a autorização LGPD e clicar em "Nota com mais de 72h" no Painel do protótipo.
- **Resultado esperado:** alerta com a pílula "ReN02" e a mensagem "Esta nota foi emitida há mais
  de 72 horas e não pode ser usada."; o progresso continua em R$ 0,00 e a lista de notas, vazia.
- **Plano B:** colar a chave do passo 1 no campo "Chave de acesso (44 dígitos)" e clicar em
  "Enviar nota". Se a tela não responder, mostrar a mesma regra no Swagger: `POST /api/v1/notas`
  com a chave devolve `422` e `NOTA_EXPIRADA_72H`.

## Passo 2 - duas notas somam R$ 150,00 e liberam o voucher

- **Perfil:** Consumidor (o mesmo do passo 1).
- **O que fazer:** clicar em "Simular leitura de QR Code" e em "Enviar nota" (R$ 65,00); repetir
  (R$ 85,00).
- **Resultado esperado:** depois da 1ª nota, "Nota de R$ 65,00 validada." e progresso em R$ 65,00;
  depois da 2ª, progresso em R$ 150,00 (100%) e o card "Voucher de estacionamento grátis" com o
  QR Code e um código que começa por `HOHO-PARK-`.
- **Plano B:** se "Simular leitura de QR Code" não preencher, colar as duas chaves do passo 2 à mão.
  Se uma delas responder "nota já cadastrada" (banco não foi zerado), usar as duas chaves de
  reserva: R$ 55,00 + R$ 95,00 também somam R$ 150,00.

## Passo 3 - o lojista vê o ticket atualizado e dispara a campanha

- **Perfil:** Lojista (aba "2 · Lojista" no topo; 1 clique).
- **O que fazer:** mostrar o card "Ticket médio" e clicar em "Disparar Cupom 15% OFF".
- **Resultado esperado:** o ticket médio da Zara já inclui a nota de R$ 65,00 do passo 2 (no banco
  limpo ele passa de R$ 184,07 para R$ 167,06); a campanha responde "Campanha disparada! Cupom de
  15% OFF enviado a 2 clientes."
- **Plano B:** se o painel mostrar erro, clicar em "Tentar novamente". Se a campanha falhar,
  disparar pelo Swagger: `POST /api/v1/campanhas` com
  `{"titulo":"Cupom 15% OFF","descontoPercentual":15,"criterioAlvo":"INATIVOS_60_DIAS"}` e o token
  do lojista (`POST /api/v1/auth/login` com `lojista@shopping.com` / `demo123`).

## Passo 4 - o Admin Shopping vê o faturamento e o voucher

- **Perfil:** Admin Shopping (item "3 · Shopping" no menu lateral; 1 clique).
- **O que fazer:** mostrar os 3 indicadores e o card "Faturamento consolidado por segmento".
- **Resultado esperado:** "Faturamento identificado" R$ 150,00 acima do valor do banco limpo (de
  R$ 3.394,90 para R$ 3.544,90), "Vouchers de estacionamento" 1 e "Campanhas ativas" 1.
- **Plano B:** clicar em "Tentar novamente" se o card mostrar erro. Se a tela não abrir, mostrar
  os mesmos números no Swagger: `GET /api/v1/analytics/shopping/dashboard` com o token do admin
  (`admin@shopping.com` / `demo123`).

## Plano B geral

- **Algo travou e não há tempo de investigar:** rodar o roteiro automatizado diante da banca,
  `cd backend && ./mvnw test -Dtest=RoteiroDemoE2ETest` (precisa do Docker ligado). Ele executa os
  4 passos pela API, duas vezes, sobre banco limpo.
- **Backend fora do ar:** as telas mostram erro com "Tentar novamente"; subir de novo com
  `./mvnw spring-boot:run` e clicar. O que já foi cadastrado continua no banco.
- **Sessão expirada:** a tela volta para o acesso com o aviso "Sua sessão expirou. Entre
  novamente."; basta entrar de novo (1 clique).

## Limitações conhecidas

- **As chaves valem uma vez por banco.** Não há "reiniciar demonstração" na tela: para ensaiar de
  novo, refazer a subida do zero (`docker compose down -v`).
- **Entre 00h00 e 02h00 o passo 2 não libera o voucher.** A SEFAZ simulada emite as notas "há 1 e
  2 horas"; nessa faixa elas caem no dia anterior e a meta só conta notas emitidas hoje (ReN03).
- **A Tela 3 é mínima** (AD-027): 3 indicadores e o faturamento por segmento, sobre todo o
  histórico. Não há filtro de período, mapa de calor, adesão ao estacionamento nem ROI de campanhas.
- **"Campanhas ativas" conta todas as campanhas disparadas** e "Vouchers de estacionamento" conta
  todos os vouchers emitidos; o banco não guarda validade de campanha.
- **O público da campanha é 2 no banco limpo** porque o seed traz 2 clientes sem compra na Zara há
  mais de 60 dias. Clicar duas vezes em "Disparar Cupom 15% OFF" grava duas campanhas.
- **A página publicada no GitHub Pages deixou de funcionar sem backend**: o frontend não tem mais
  dados simulados (AD-026).
- **O backend não está no `docker compose`**: ele roda com `./mvnw spring-boot:run`. Com JDK mais
  novo que o 21, os testes com Mockito precisam de
  `-DargLine=-Dnet.bytebuddy.experimental=true`.
- **O CPF digitado na Tela 1 não vai para o backend** (AD-013): o campo abre com um CPF fictício, e o
  CPF mascarado do card de progresso (`***.456.789-**`) é o do consumidor de demonstração do banco.
- **O rodapé do menu lateral mostra o e-mail do usuário**, porque o token do backend não traz nome.
- **A consulta à SEFAZ é simulada** (`MockSefazGateway`): só as chaves da tabela acima existem;
  qualquer outra chave de 44 dígitos responde "Chave não localizada na SEFAZ."
