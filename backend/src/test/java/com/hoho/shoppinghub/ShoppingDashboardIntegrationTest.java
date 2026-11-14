package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/** `GET /api/v1/analytics/shopping/dashboard`: somas, contagens, categorias e autorização. */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ShoppingDashboardIntegrationTest {

    private static final String ROTA = "/api/v1/analytics/shopping/dashboard";
    private static final UUID CLIENTE = UUID.fromString("33333333-3333-3333-3333-333333333302");
    private static final UUID LOJA_ZARA = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID LOJA_BURGER_KING = UUID.fromString("22222222-2222-2222-2222-222222222204");

    private final ObjectMapper json = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Clock clock;

    @BeforeEach
    @AfterEach
    void limparDadosDoTeste() {
        jdbcTemplate.update("DELETE FROM notas_fiscais WHERE chave_acesso LIKE '352699%'");
        jdbcTemplate.update("DELETE FROM campanhas WHERE titulo = 'Campanha do teste'");
        jdbcTemplate.update("DELETE FROM vouchers_estacionamento WHERE codigo_qr = 'QR-DO-TESTE'");
    }

    @Test
    void faturamentoSumsOnlyApprovedReceipts() throws Exception {
        BigDecimal antes = decimal(dashboard(), "faturamentoTotal");
        assertThat(antes).isEqualByComparingTo(jdbcTemplate.queryForObject(
                "SELECT SUM(valor_total) FROM notas_fiscais WHERE status = 'APROVADA'", BigDecimal.class));
        assertThat(antes).isPositive();

        inserirNota(1, LOJA_ZARA, "500.00", "REJEITADA");
        assertThat(decimal(dashboard(), "faturamentoTotal")).isEqualByComparingTo(antes);

        inserirNota(2, LOJA_ZARA, "65.00", "APROVADA");
        inserirNota(3, LOJA_BURGER_KING, "85.00", "APROVADA");
        BigDecimal depois = antes.add(new BigDecimal("150.00"));
        assertThat(decimal(dashboard(), "faturamentoTotal")).isEqualByComparingTo(depois);
        // Sempre com 2 casas no corpo, mesmo quando a soma termina em zero.
        assertThat(depois.scale()).isEqualTo(2);
        assertThat(corpoDoDashboard()).contains("\"faturamentoTotal\":" + depois.toPlainString() + ",");

        inserirNota(6, LOJA_ZARA, String.valueOf(new BigDecimal("1000.00").subtract(depois.remainder(BigDecimal.ONE))), "APROVADA");
        String redondo = corpoDoDashboard();
        assertThat(redondo).containsPattern("\"faturamentoTotal\":\\d+\\.00,");
    }

    @Test
    @Transactional
    void emptyDatabaseYieldsZerosAndNoCategories() throws Exception {
        jdbcTemplate.update("DELETE FROM notas_fiscais");
        jdbcTemplate.update("DELETE FROM vouchers_estacionamento");
        jdbcTemplate.update("DELETE FROM campanhas");

        String corpo = corpoDoDashboard();
        JsonNode vazio = json.readTree(corpo);

        assertThat(corpo).contains("\"faturamentoTotal\":0.00");
        assertThat(vazio.path("vouchersLiberados").asLong(-1)).isZero();
        assertThat(vazio.path("campanhasAtivas").asLong(-1)).isZero();
        assertThat(vazio.path("faturamentoPorCategoria").isArray()).isTrue();
        assertThat(vazio.path("faturamentoPorCategoria")).isEmpty();
    }

    @Test
    void countsEveryVoucherAndEveryCampaign() throws Exception {
        JsonNode antes = dashboard();
        long vouchers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM vouchers_estacionamento", Long.class);
        long campanhas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM campanhas", Long.class);
        assertThat(antes.path("vouchersLiberados").asLong(-1)).isEqualTo(vouchers);
        assertThat(antes.path("campanhasAtivas").asLong(-1)).isEqualTo(campanhas);

        jdbcTemplate.update(
                """
                INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status)
                VALUES (?, ?, 150.00, 'QR-DO-TESTE', 'UTILIZADO')
                """,
                CLIENTE,
                LocalDate.now().minusYears(1));
        jdbcTemplate.update(
                """
                INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo, publico_atingido)
                VALUES (?, 'Campanha do teste', 15, 'INATIVOS_60_DIAS', 0)
                """,
                LOJA_ZARA);

        JsonNode depois = dashboard();
        assertThat(depois.path("vouchersLiberados").asLong(-1)).isEqualTo(vouchers + 1);
        assertThat(depois.path("campanhasAtivas").asLong(-1)).isEqualTo(campanhas + 1);
    }

    @Test
    void faturamentoPorCategoriaIsSortedAndAddsUpToTheTotal() throws Exception {
        inserirNota(4, LOJA_BURGER_KING, "40.00", "APROVADA");
        inserirNota(5, LOJA_BURGER_KING, "900.00", "REJEITADA");
        JsonNode doc = dashboard();

        List<String> nomes = new ArrayList<>();
        List<BigDecimal> valores = new ArrayList<>();
        doc.path("faturamentoPorCategoria").forEach(linha -> {
            nomes.add(linha.path("categoria").asText());
            valores.add(linha.path("valor").decimalValue());
        });

        assertThat(nomes).containsExactlyInAnyOrder("Vestuário", "Alimentação", "Eletrônicos");

        // Empate: Alimentação e Eletrônicos com a mesma soma saem em ordem de nome.
        BigDecimal alimentacao = valores.get(nomes.indexOf("Alimentação"));
        BigDecimal eletronicos = valores.get(nomes.indexOf("Eletrônicos"));
        assertThat(eletronicos).isGreaterThan(alimentacao);
        inserirNota(7, LOJA_BURGER_KING, eletronicos.subtract(alimentacao).toPlainString(), "APROVADA");
        List<String> comEmpate = new ArrayList<>();
        dashboard().path("faturamentoPorCategoria").forEach(linha -> comEmpate.add(linha.path("categoria").asText()));
        assertThat(comEmpate.indexOf("Alimentação")).isEqualTo(comEmpate.indexOf("Eletrônicos") - 1);
        jdbcTemplate.update("DELETE FROM notas_fiscais WHERE chave_acesso = ?", String.format("352699%038d", 7));
        assertThat(nomes).doesNotContain("Farmácia & Beleza");
        assertThat(valores).isSortedAccordingTo((a, b) -> b.compareTo(a));
        assertThat(valores.stream().reduce(BigDecimal.ZERO, BigDecimal::add))
                .isEqualByComparingTo(decimal(doc, "faturamentoTotal"));
        for (int i = 0; i < nomes.size(); i++) {
            BigDecimal esperado = jdbcTemplate.queryForObject(
                    """
                    SELECT SUM(n.valor_total)
                    FROM notas_fiscais n
                    JOIN lojas l ON n.loja_id = l.id
                    JOIN categorias c ON l.categoria_id = c.id
                    WHERE n.status = 'APROVADA' AND c.nome = ?
                    """,
                    BigDecimal.class,
                    nomes.get(i));
            assertThat(valores.get(i)).as(nomes.get(i)).isEqualByComparingTo(esperado);
        }
    }

    @Test
    void applicationClockIsTheSystemClock() {
        assertThat(clock).isEqualTo(Clock.systemDefaultZone());
        assertThat(Duration.between(clock.instant(), Instant.now()).abs()).isLessThan(Duration.ofSeconds(5));
    }

    @Test
    void onlyAdminShoppingMaySeeTheDashboard() throws Exception {
        mockMvc.perform(get(ROTA).header("Authorization", bearer("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isOk());
        mockMvc.perform(get(ROTA)).andExpect(status().isUnauthorized());
        mockMvc.perform(get(ROTA).header("Authorization", bearer("CONSUMIDOR", CLIENTE, null)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get(ROTA).header("Authorization", bearer("LOJISTA", null, LOJA_ZARA)))
                .andExpect(status().isForbidden());
    }

    private String corpoDoDashboard() throws Exception {
        return mockMvc.perform(get(ROTA).header("Authorization", bearer("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    private JsonNode dashboard() throws Exception {
        return json.readTree(corpoDoDashboard());
    }

    private static BigDecimal decimal(JsonNode doc, String campo) {
        assertThat(doc.path(campo).isNumber()).as(campo).isTrue();
        return doc.path(campo).decimalValue();
    }

    private void inserirNota(int numero, UUID lojaId, String valor, String status) {
        jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                String.format("352699%038d", numero),
                CLIENTE,
                lojaId,
                new BigDecimal(valor),
                Timestamp.from(Instant.now().minus(3, ChronoUnit.DAYS)),
                status);
    }

    private String bearer(String role, UUID clienteId, UUID lojaId) {
        AuthenticatedUser user = new AuthenticatedUser(
                UUID.randomUUID(), role.toLowerCase() + "@shopping.com", "unused", role, lojaId, clienteId);
        return "Bearer " + jwtService.generateToken(user);
    }
}
