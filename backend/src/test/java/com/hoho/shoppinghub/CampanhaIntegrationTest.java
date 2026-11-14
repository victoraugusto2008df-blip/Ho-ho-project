package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/** `POST /api/v1/campanhas`: contrato, regra do público (60 dias), validação e autorização. */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class CampanhaIntegrationTest {

    private static final UUID CATEGORIA_FARMACIA = UUID.fromString("11111111-1111-1111-1111-111111111104");
    private static final UUID LOJA_ZARA = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID LOJA = UUID.fromString("aaaaaaaa-0000-4000-8000-000000000001");
    private static final UUID OUTRA_LOJA = UUID.fromString("aaaaaaaa-0000-4000-8000-000000000002");
    private static final UUID LOJA_SEM_NOTAS = UUID.fromString("aaaaaaaa-0000-4000-8000-000000000003");
    private static final String CORPO_VALIDO =
            "{\"titulo\":\"Cupom 15% OFF\",\"descontoPercentual\":15,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void criarLojasDoTeste() {
        limpar();
        criarLoja(LOJA, "77777777000171");
        criarLoja(OUTRA_LOJA, "77777777000172");
        criarLoja(LOJA_SEM_NOTAS, "77777777000173");
    }

    @AfterEach
    void limpar() {
        jdbcTemplate.update("DELETE FROM campanhas");
        jdbcTemplate.update("DELETE FROM notas_fiscais WHERE chave_acesso LIKE '352677%'");
        jdbcTemplate.update("DELETE FROM lojas WHERE id IN (?, ?, ?)", LOJA, OUTRA_LOJA, LOJA_SEM_NOTAS);
    }

    @Test
    void campaignIsSavedForTheTokenStoreAndReturns201() throws Exception {
        String corpoComOutraLoja = "{\"titulo\":\"Cupom 15% OFF\",\"descontoPercentual\":15,"
                + "\"criterioAlvo\":\"INATIVOS_60_DIAS\",\"lojaId\":\"" + OUTRA_LOJA + "\"}";

        mockMvc.perform(postCampanha(corpoComOutraLoja, lojista(LOJA)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.titulo").value("Cupom 15% OFF"))
                .andExpect(jsonPath("$.descontoPercentual").value(15))
                .andExpect(jsonPath("$.criterioAlvo").value("INATIVOS_60_DIAS"))
                .andExpect(jsonPath("$.publicoAtingido").value(0))
                .andExpect(jsonPath("$.criadoEm").isNotEmpty());

        Map<String, Object> gravada = jdbcTemplate.queryForMap("SELECT * FROM campanhas");
        assertThat(gravada.get("loja_id")).isEqualTo(LOJA);
        assertThat(gravada.get("titulo")).isEqualTo("Cupom 15% OFF");
        assertThat(gravada.get("desconto_percentual")).isEqualTo(15);
        assertThat(gravada.get("criterio_alvo")).isEqualTo("INATIVOS_60_DIAS");
        assertThat(gravada.get("publico_atingido")).isEqualTo(0);
    }

    @Test
    void publicoCountsOnlyClientsInactiveForMoreThan60DaysAtTheStore() throws Exception {
        inserirNota(1, cliente(1), LOJA, 61, "APROVADA");
        inserirNota(2, cliente(2), LOJA, 59, "APROVADA");
        inserirNota(3, cliente(3), LOJA, 90, "APROVADA");
        inserirNota(4, cliente(3), LOJA, 5, "APROVADA");
        inserirNota(5, cliente(4), OUTRA_LOJA, 90, "APROVADA");
        inserirNota(6, cliente(5), LOJA, 90, "REJEITADA");

        mockMvc.perform(postCampanha(CORPO_VALIDO, lojista(LOJA)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").value(1));
        mockMvc.perform(postCampanha(CORPO_VALIDO, lojista(LOJA_SEM_NOTAS)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").value(0));
        assertThat(jdbcTemplate.queryForObject(
                        "SELECT publico_atingido FROM campanhas WHERE loja_id = ?", Integer.class, LOJA))
                .isEqualTo(1);
    }

    @Test
    void invalidBodyReturns400AndSavesNothing() throws Exception {
        String[] invalidos = {
            "{\"titulo\":\"\",\"descontoPercentual\":15,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"titulo\":\"   \",\"descontoPercentual\":15,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"descontoPercentual\":15,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"titulo\":\"Cupom\",\"descontoPercentual\":0,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"titulo\":\"Cupom\",\"descontoPercentual\":101,\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"titulo\":\"Cupom\",\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
            "{\"titulo\":\"Cupom\",\"descontoPercentual\":15,\"criterioAlvo\":\"TODOS\"}",
            "{\"titulo\":\"Cupom\",\"descontoPercentual\":15}",
        };
        for (String corpo : invalidos) {
            mockMvc.perform(postCampanha(corpo, lojista(LOJA))).andExpect(status().isBadRequest());
        }
        assertThat(totalDeCampanhas()).isZero();

        for (int desconto : new int[] {1, 100}) {
            mockMvc.perform(postCampanha(
                            "{\"titulo\":\"Cupom\",\"descontoPercentual\":" + desconto
                                    + ",\"criterioAlvo\":\"INATIVOS_60_DIAS\"}",
                            lojista(LOJA)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.descontoPercentual").value(desconto));
        }
        assertThat(totalDeCampanhas()).isEqualTo(2);
    }

    @Test
    void onlyLojistaMayDispatchACampaign() throws Exception {
        mockMvc.perform(post("/api/v1/campanhas").contentType(MediaType.APPLICATION_JSON).content(CORPO_VALIDO))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(postCampanha(CORPO_VALIDO, bearer("CONSUMIDOR", cliente(1), null)))
                .andExpect(status().isForbidden());
        mockMvc.perform(postCampanha(CORPO_VALIDO, bearer("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isForbidden());

        assertThat(totalDeCampanhas()).isZero();
    }

    @Test
    void freshSeedGivesTheDemoStoreAPublicoOf2() throws Exception {
        mockMvc.perform(postCampanha(CORPO_VALIDO, lojista(LOJA_ZARA)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicoAtingido").value(2));
    }

    private MockHttpServletRequestBuilder postCampanha(String corpo, String authorization) {
        return post("/api/v1/campanhas")
                .header("Authorization", authorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo);
    }

    private void criarLoja(UUID id, String cnpj) {
        jdbcTemplate.update(
                "INSERT INTO lojas (id, cnpj, nome, categoria_id, ativa) VALUES (?, ?, ?, ?, TRUE)",
                id,
                cnpj,
                "Loja de teste " + cnpj,
                CATEGORIA_FARMACIA);
    }

    private void inserirNota(int numero, UUID clienteId, UUID lojaId, int diasAtras, String status) {
        jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                String.format("352677%038d", numero),
                clienteId,
                lojaId,
                new BigDecimal("50.00"),
                Timestamp.from(Instant.now().minus(diasAtras, ChronoUnit.DAYS)),
                status);
    }

    private int totalDeCampanhas() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM campanhas", Integer.class);
    }

    private static UUID cliente(int n) {
        return UUID.fromString("33333333-3333-3333-3333-33333333330" + n);
    }

    private String lojista(UUID lojaId) {
        return bearer("LOJISTA", null, lojaId);
    }

    private String bearer(String role, UUID clienteId, UUID lojaId) {
        AuthenticatedUser user = new AuthenticatedUser(
                UUID.randomUUID(), role.toLowerCase() + "@shopping.com", "unused", role, lojaId, clienteId);
        return "Bearer " + jwtService.generateToken(user);
    }
}
