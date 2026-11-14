package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hoho.shoppinghub.fiscal.gateway.MockSefazGateway;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

/**
 * ORD-14: o roteiro da banca, pela API, com login real dos 3 usuários de demonstração.
 * Roda 2 vezes seguidas, cada uma sobre um banco recriado do zero pelas migrations.
 *
 * <p>O relógio da aplicação fica fixo em amanhã ao meio-dia: a nota da SEFAZ simulada, o prazo de
 * 72h, a meta do dia e a lista de hoje só fecham se todos lerem o mesmo relógio, e o teste não
 * depende da hora em que roda (perto da meia-noite, a nota "de 2h atrás" cairia no dia anterior).
 */
@Import({TestcontainersConfiguration.class, RoteiroDemoE2ETest.RelogioFixo.class})
@SpringBootTest
@AutoConfigureMockMvc
class RoteiroDemoE2ETest {

    private static final UUID LOJA_ZARA = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final String SENHA = "demo123";

    @TestConfiguration(proxyBeanMethods = false)
    static class RelogioFixo {

        @Bean
        @Primary
        Clock relogioDoEnsaio() {
            ZoneId zona = ZoneId.systemDefault();
            return Clock.fixed(LocalDate.now(zona).plusDays(1).atTime(LocalTime.NOON).atZone(zona).toInstant(), zona);
        }
    }

    private final ObjectMapper json = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Flyway flyway;

    @Test
    void roteiroDaBancaRodaDuasVezesAPartirDeBancoLimpo() throws Exception {
        for (int rodada = 1; rodada <= 2; rodada++) {
            recriarBancoDoZero();
            executarRoteiro(rodada);
        }
    }

    private void recriarBancoDoZero() {
        jdbcTemplate.execute("DROP SCHEMA public CASCADE");
        jdbcTemplate.execute("CREATE SCHEMA public");
        flyway.migrate();
        assertThat(contar("notas_fiscais")).isEqualTo(17);
        assertThat(contar("vouchers_estacionamento")).isZero();
        assertThat(contar("campanhas")).isZero();
    }

    private void executarRoteiro(int rodada) throws Exception {
        String consumidor = login("consumidor@shopping.com", "CONSUMIDOR");
        String lojista = login("lojista@shopping.com", "LOJISTA");
        String admin = login("admin@shopping.com", "ADMIN_SHOPPING");

        JsonNode shoppingAntes = getOk("/api/v1/analytics/shopping/dashboard", admin);
        BigDecimal faturamentoAntes = shoppingAntes.path("faturamentoTotal").decimalValue();
        assertThat(faturamentoAntes).as("rodada %d", rodada).isPositive();
        assertThat(shoppingAntes.path("vouchersLiberados").asLong(-1)).isZero();
        assertThat(shoppingAntes.path("campanhasAtivas").asLong(-1)).isZero();
        BigDecimal somaDaLojaAntes = jdbcTemplate.queryForObject(
                "SELECT SUM(valor_total) FROM notas_fiscais WHERE loja_id = ? AND status = 'APROVADA'",
                BigDecimal.class,
                LOJA_ZARA);
        long notasDaLojaAntes = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notas_fiscais WHERE loja_id = ? AND status = 'APROVADA'", Long.class, LOJA_ZARA);

        // Passo 1: consumidor envia a nota emitida há 96h e é bloqueado.
        MockHttpServletResponse bloqueio = postNota(MockSefazGateway.CHAVE_EXPIRADA_96H, consumidor);
        assertThat(bloqueio.getStatus()).isEqualTo(422);
        JsonNode erro = json.readTree(bloqueio.getContentAsString(java.nio.charset.StandardCharsets.UTF_8));
        assertThat(erro.path("code").asText()).isEqualTo("NOTA_EXPIRADA_72H");
        assertThat(erro.path("message").asText()).isEqualTo("Nota emitida há mais de 72 horas.");
        assertThat(contar("notas_fiscais")).isEqualTo(17);

        // Passo 2: duas notas válidas somam R$ 150,00 e liberam o voucher.
        assertThat(postNota(MockSefazGateway.CHAVE_ZARA_65, consumidor).getStatus()).isEqualTo(201);
        assertThat(postNota(MockSefazGateway.CHAVE_RENNER_85, consumidor).getStatus()).isEqualTo(201);
        JsonNode beneficio = getOk("/api/v1/beneficios/estacionamento/hoje", consumidor);
        assertThat(beneficio.path("valorAcumulado").decimalValue()).isEqualByComparingTo("150.00");
        assertThat(beneficio.path("percentual").asInt(-1)).isEqualTo(100);
        assertThat(beneficio.path("valorFaltante").decimalValue()).isEqualByComparingTo("0.00");
        assertThat(beneficio.path("voucherLiberado").asBoolean(false)).isTrue();
        assertThat(beneficio.path("voucher").path("codigoQr").asText()).startsWith("HOHO-PARK-");
        JsonNode notasDeHoje = getOk("/api/v1/notas/hoje", consumidor);
        assertThat(notasDeHoje).hasSize(2);
        assertThat(contar("vouchers_estacionamento")).isEqualTo(1);

        // Passo 3: o lojista vê o ticket médio com a nota nova e dispara a campanha de 15%.
        BigDecimal ticketEsperado = somaDaLojaAntes
                .add(new BigDecimal("65.00"))
                .divide(BigDecimal.valueOf(notasDaLojaAntes + 1), 2, RoundingMode.HALF_UP);
        JsonNode painel = getOk("/api/v1/analytics/lojista/dashboard", lojista);
        assertThat(painel.path("ticketMedio").decimalValue()).isEqualByComparingTo(ticketEsperado);
        MockHttpServletResponse campanha = mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", lojista)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Cupom 15% OFF\",\"descontoPercentual\":15,"
                                + "\"criterioAlvo\":\"INATIVOS_60_DIAS\"}"))
                .andReturn()
                .getResponse();
        assertThat(campanha.getStatus()).isEqualTo(201);
        JsonNode disparada = json.readTree(campanha.getContentAsString());
        assertThat(disparada.path("descontoPercentual").asInt(-1)).isEqualTo(15);
        assertThat(disparada.path("publicoAtingido").asInt(-1)).isEqualTo(2);

        // Passo 4: o Admin Shopping vê o faturamento atualizado, o voucher e a campanha.
        JsonNode shopping = getOk("/api/v1/analytics/shopping/dashboard", admin);
        assertThat(shopping.path("faturamentoTotal").decimalValue())
                .isEqualByComparingTo(faturamentoAntes.add(new BigDecimal("150.00")));
        assertThat(shopping.path("vouchersLiberados").asLong(-1)).isEqualTo(1);
        assertThat(shopping.path("campanhasAtivas").asLong(-1)).isEqualTo(1);
    }

    /** Login real: `POST /api/v1/auth/login` com o usuário do seed; devolve o cabeçalho Bearer. */
    private String login(String email, String perfil) throws Exception {
        MockHttpServletResponse resposta = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"senha\":\"" + SENHA + "\"}"))
                .andReturn()
                .getResponse();
        assertThat(resposta.getStatus()).as(email).isEqualTo(200);
        JsonNode corpo = json.readTree(resposta.getContentAsString());
        assertThat(corpo.path("role").asText()).isEqualTo(perfil);
        return "Bearer " + corpo.path("token").asText();
    }

    private MockHttpServletResponse postNota(String chave, String authorization) throws Exception {
        return mockMvc.perform(post("/api/v1/notas")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"chaveAcesso\":\"" + chave + "\"}"))
                .andReturn()
                .getResponse();
    }

    private JsonNode getOk(String rota, String authorization) throws Exception {
        MockHttpServletResponse resposta =
                mockMvc.perform(get(rota).header("Authorization", authorization)).andReturn().getResponse();
        assertThat(resposta.getStatus()).as(rota).isEqualTo(200);
        return json.readTree(resposta.getContentAsString());
    }

    private long contar(String tabela) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tabela, Long.class);
    }
}
