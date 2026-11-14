package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import com.hoho.shoppinghub.campanhas.domain.Campanha;
import com.hoho.shoppinghub.campanhas.domain.CampanhaRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class CampanhaIntegrationTest {

    private static final UUID ZARA_LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID FAST_SHOP_LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222205");
    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CampanhaRepository campanhaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    @AfterEach
    void cleanupCampanhas() {
        jdbcTemplate.update("DELETE FROM campanhas");
    }

    @Test
    void createCampanhaPersistsAndBindsToJwtLojaId() throws Exception {
        String payload =
                """
                {
                  "titulo": "Semana VIP Vestuario",
                  "descontoPercentual": 15,
                  "criterioAlvo": "CLIENTES_LOJA"
                }
                """;

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, ZARA_LOJA_ID))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.lojaId").value(ZARA_LOJA_ID.toString()))
                .andExpect(jsonPath("$.titulo").value("Semana VIP Vestuario"))
                .andExpect(jsonPath("$.descontoPercentual").value(15))
                .andExpect(jsonPath("$.criterioAlvo").value("CLIENTES_LOJA"))
                .andExpect(jsonPath("$.publicoAtingido").value(3))
                .andExpect(jsonPath("$.criadoEm").isNotEmpty());

        List<Campanha> salvas = campanhaRepository.findAll();
        assertThat(salvas).hasSize(1);
        assertThat(salvas.getFirst().getLojaId()).isEqualTo(ZARA_LOJA_ID);
        assertThat(salvas.getFirst().getTitulo()).isEqualTo("Semana VIP Vestuario");
        assertThat(salvas.getFirst().getDescontoPercentual()).isEqualTo(15);
        assertThat(salvas.getFirst().getCriterioAlvo()).isEqualTo("CLIENTES_LOJA");
        assertThat(salvas.getFirst().getPublicoAtingido()).isEqualTo(3);
    }

    @Test
    void responseContainsOnlyAnonymousAudienceCountWithoutPii() throws Exception {
        String payload =
                """
                {
                  "titulo": "Campanha LGPD Segura",
                  "descontoPercentual": 10,
                  "criterioAlvo": "CLIENTES_LOJA"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, ZARA_LOJA_ID))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").isNumber())
                .andExpect(jsonPath("$.clientes").doesNotExist())
                .andExpect(jsonPath("$.clienteId").doesNotExist())
                .andExpect(jsonPath("$.cpf").doesNotExist())
                .andExpect(jsonPath("$.cpfHash").doesNotExist())
                .andExpect(jsonPath("$.nome").doesNotExist())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        assertThat(body).doesNotContain("Ana Silva", "Carlos Souza", "Mariana Lima", "456.789");
    }

    @Test
    void audienceCountReflectsEligibleCriteriaWithoutCrossStoreLeak() throws Exception {
        // Na V2__seed_demo_data.sql para Zara:
        // - TICKET_ALTO (>= 200.00): 2 clientes distintos (Ana 310.00, Carlos 245.00)
        // - RECORRENTES (>= 2 compras): 1 cliente (Ana com 2 notas)
        // Para Fast Shop: 2 clientes distintos no total
        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, ZARA_LOJA_ID))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "VIP Ticket Alto",
                                  "descontoPercentual": 20,
                                  "criterioAlvo": "TICKET_ALTO"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").value(2));

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, ZARA_LOJA_ID))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Fidelidade Recorrentes",
                                  "descontoPercentual": 25,
                                  "criterioAlvo": "RECORRENTES"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").value(1));

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, FAST_SHOP_LOJA_ID))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Oferta Eletronicos",
                                  "descontoPercentual": 12,
                                  "criterioAlvo": "CLIENTES_LOJA"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.lojaId").value(FAST_SHOP_LOJA_ID.toString()))
                .andExpect(jsonPath("$.publicoAtingido").value(2));
    }

    @Test
    void invalidPayloadReturnsBadRequest() throws Exception {
        String token = tokenFor("LOJISTA", null, ZARA_LOJA_ID);

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Desconto Zero",
                                  "descontoPercentual": 0,
                                  "criterioAlvo": "CLIENTES_LOJA"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("validation_error"));

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Desconto Excessivo",
                                  "descontoPercentual": 101,
                                  "criterioAlvo": "CLIENTES_LOJA"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("validation_error"));

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "   ",
                                  "descontoPercentual": 15,
                                  "criterioAlvo": "CLIENTES_LOJA"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("validation_error"));

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Sem Criterio",
                                  "descontoPercentual": 15,
                                  "criterioAlvo": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("validation_error"));

        assertThat(campanhaRepository.count()).isZero();
    }

    @Test
    void createCampanhaEnforcesLojistaAuthorization() throws Exception {
        String payload =
                """
                {
                  "titulo": "Campanha Nao Autorizada",
                  "descontoPercentual": 15,
                  "criterioAlvo": "CLIENTES_LOJA"
                }
                """;

        mockMvc.perform(post("/api/v1/campanhas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("CONSUMIDOR", CLIENTE_ID, null))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/v1/campanhas")
                        .header("Authorization", "Bearer " + tokenFor("ADMIN_SHOPPING", null, null))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden());
    }

    private String tokenFor(String role, UUID clienteId, UUID lojaId) {
        AuthenticatedUser user = new AuthenticatedUser(
                UUID.randomUUID(),
                role.toLowerCase() + "@shopping.com",
                "unused",
                role,
                lojaId,
                clienteId);
        return jwtService.generateToken(user);
    }
}
