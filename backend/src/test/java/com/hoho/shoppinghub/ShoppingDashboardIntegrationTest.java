package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import java.math.BigDecimal;
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
import org.springframework.test.web.servlet.MvcResult;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ShoppingDashboardIntegrationTest {

    private static final UUID CLIENTE_A = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID CLIENTE_B = UUID.fromString("33333333-3333-3333-3333-333333333302");
    private static final UUID LOJA = UUID.fromString("22222222-2222-2222-2222-222222222201");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    @AfterEach
    void cleanupCounters() {
        jdbcTemplate.update("DELETE FROM campanhas");
        jdbcTemplate.update("DELETE FROM vouchers_estacionamento");
    }

    @Test
    void shoppingDashboardReturns200ForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.faturamentoTotal").isNumber())
                .andExpect(jsonPath("$.distribuicaoPorCategoria").isArray());
    }

    @Test
    void shoppingDashboardForbiddenForConsumidorAndLojista() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + token("CONSUMIDOR", null, CLIENTE_A)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + token("LOJISTA", LOJA, null)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shoppingDashboardUnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void faturamentoTotalMatchesAprovadaNotes() throws Exception {
        BigDecimal esperado = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(valor_total), 0) FROM notas_fiscais WHERE status = 'APROVADA'",
                BigDecimal.class);

        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.faturamentoTotal").value(esperado.doubleValue()));
    }

    @Test
    void shoppingDashboardContainsNoPii() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        assertThat(body)
                .doesNotContain("clienteId")
                .doesNotContain("cpf")
                .doesNotContain("nome");
    }

    @Test
    void shoppingDashboardReturnsVolumePorDiaHora() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.volumePorDiaHora").isArray())
                .andExpect(jsonPath("$.volumePorDiaHora").isNotEmpty())
                .andExpect(jsonPath("$.volumePorDiaHora[0].diaSemana").isNotEmpty())
                .andExpect(jsonPath("$.volumePorDiaHora[0].hora").isNumber())
                .andExpect(jsonPath("$.volumePorDiaHora[0].total").isNumber());
    }

    @Test
    void shoppingDashboardCountsLiberadoVouchers() throws Exception {
        jdbcTemplate.update(
                "INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status) "
                        + "VALUES (?, CURRENT_DATE, 150.00, ?, 'LIBERADO')",
                CLIENTE_A, UUID.randomUUID().toString());
        jdbcTemplate.update(
                "INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status) "
                        + "VALUES (?, CURRENT_DATE, 150.00, ?, 'UTILIZADO')",
                CLIENTE_B, UUID.randomUUID().toString());

        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVouchersLiberados").value(1));
    }

    @Test
    void shoppingDashboardCountsCampanhas() throws Exception {
        jdbcTemplate.update(
                "INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo, publico_atingido) "
                        + "VALUES (?, 'Cupom 15%', 15, 'CLIENTES_LOJA', 0)",
                LOJA);
        jdbcTemplate.update(
                "INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo, publico_atingido) "
                        + "VALUES (?, 'Cupom 20%', 20, 'TICKET_ALTO', 0)",
                LOJA);

        mockMvc.perform(get("/api/v1/analytics/shopping/dashboard")
                        .header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCampanhasAtivas").value(2));
    }

    private String adminToken() {
        return token("ADMIN_SHOPPING", null, null);
    }

    private String token(String role, UUID lojaId, UUID clienteId) {
        return jwtService.generateToken(
                new AuthenticatedUser(null, "probe@shopping.com", null, role, lojaId, clienteId));
    }
}
