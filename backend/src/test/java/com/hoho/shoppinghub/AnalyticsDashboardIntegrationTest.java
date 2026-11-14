package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class AnalyticsDashboardIntegrationTest {

    private static final UUID ZARA = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID BURGER_KING = UUID.fromString("22222222-2222-2222-2222-222222222204");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    void dashboardReturns200WithTicketMedio() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ticketMedio").isNumber());
    }

    @Test
    void fewerThanThreeActiveStoresHidesBenchmark() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(BURGER_KING)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.benchmarkingDisponivel").value(false))
                .andExpect(jsonPath("$.mediaCategoria").value(nullValue()));
    }

    @Test
    void threeOrMoreActiveStoresReturnsBenchmark() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.benchmarkingDisponivel").value(true))
                .andExpect(jsonPath("$.mediaCategoria").isNumber());
    }

    @Test
    void dashboardUsesPrincipalLojaIdNotQuery() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .param("lojaId", BURGER_KING.toString())
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.benchmarkingDisponivel").value(true));
    }

    @Test
    void dashboardReturnsPeakHoursAndDays() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.horariosPico").isArray())
                .andExpect(jsonPath("$.horariosPico").isNotEmpty())
                .andExpect(jsonPath("$.horariosPico[0].hora").isNumber())
                .andExpect(jsonPath("$.diasPico").isArray())
                .andExpect(jsonPath("$.diasPico").isNotEmpty())
                .andExpect(jsonPath("$.diasPico[0].diaSemana").isNotEmpty());
    }

    @Test
    void dashboardReturnsCrossShopping() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.crossShopping").isArray())
                .andExpect(jsonPath("$.crossShopping").isNotEmpty())
                .andExpect(jsonPath("$.crossShopping[0].categoria").isNotEmpty())
                .andExpect(jsonPath("$.crossShopping[0].total").isNumber());
    }

    @Test
    void responseContainsNoCustomerPii() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/analytics/lojista/dashboard")
                        .header("Authorization", "Bearer " + lojistaToken(ZARA)))
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        assertThat(body)
                .doesNotContain("clienteId")
                .doesNotContain("cpf")
                .doesNotContain("nome");
    }

    private String lojistaToken(UUID lojaId) {
        return jwtService.generateToken(
                new AuthenticatedUser(null, "lojista@shopping.com", null, "LOJISTA", lojaId, null));
    }
}
