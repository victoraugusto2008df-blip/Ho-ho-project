package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import com.hoho.shoppinghub.fiscal.gateway.MockSefazGateway;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

/** Contrato que a Tela 1 consome: nota com loja e categoria, notas de hoje, duplicidade e benefício. */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class NotasHojeIntegrationTest {

    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID OUTRO_CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333302");
    private static final UUID LOJA_ZARA = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID LOJA_BURGER_KING = UUID.fromString("22222222-2222-2222-2222-222222222204");
    private static final String CHAVE_DO_SEED = "35261111111111000101650010000000010000000001";
    private static final String CHAVE_FORA_DO_CATALOGO = "35267700000000000000000000000000000000000404";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    @AfterEach
    void limparDadosDoTeste() {
        jdbcTemplate.update(
                "DELETE FROM vouchers_estacionamento WHERE cliente_id IN (?, ?)", CLIENTE_ID, OUTRO_CLIENTE_ID);
        jdbcTemplate.update(
                "DELETE FROM notas_fiscais WHERE chave_acesso LIKE '352677%' OR chave_acesso IN (?, ?, ?, ?)",
                MockSefazGateway.CHAVE_ZARA_65,
                MockSefazGateway.CHAVE_RENNER_85,
                MockSefazGateway.CHAVE_FASTSHOP_55,
                MockSefazGateway.CHAVE_BURGER_KING_95);
    }

    @Test
    void validNoteCarriesStoreAndCategoryNames() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_ZARA_65, consumidor()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.chaveAcesso").value(MockSefazGateway.CHAVE_ZARA_65))
                .andExpect(jsonPath("$.valorTotal").value(65.00))
                .andExpect(jsonPath("$.status").value("APROVADA"))
                .andExpect(jsonPath("$.clienteId").value(CLIENTE_ID.toString()))
                .andExpect(jsonPath("$.lojaId").value(LOJA_ZARA.toString()))
                .andExpect(jsonPath("$.dataEmissao").isNotEmpty())
                .andExpect(jsonPath("$.estabelecimento").value("Zara Shopping Hub"))
                .andExpect(jsonPath("$.categoria").value("Vestuário"));

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_BURGER_KING_95, consumidor()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.valorTotal").value(95.00))
                .andExpect(jsonPath("$.lojaId").value(LOJA_BURGER_KING.toString()))
                .andExpect(jsonPath("$.estabelecimento").value("Burger King"))
                .andExpect(jsonPath("$.categoria").value("Alimentação"));
    }

    @Test
    void notasHojeListsOnlyTodaysApprovedNotesOfTheClientNewestFirst() throws Exception {
        mockMvc.perform(get("/api/v1/notas/hoje").header("Authorization", consumidor()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        Instant agora = Instant.now();
        String primeira = "35267700000000000000000000000000000000000001";
        String segunda = "35267700000000000000000000000000000000000002";
        inserirNota(primeira, CLIENTE_ID, LOJA_ZARA, "60.00", agora, agora.minus(10, ChronoUnit.MINUTES), "APROVADA");
        inserirNota(segunda, CLIENTE_ID, LOJA_BURGER_KING, "40.50", agora, agora.minus(5, ChronoUnit.MINUTES), "APROVADA");
        inserirNota(
                "35267700000000000000000000000000000000000003",
                CLIENTE_ID,
                LOJA_ZARA,
                "70.00",
                agora.minus(1, ChronoUnit.DAYS),
                agora.minus(1, ChronoUnit.MINUTES),
                "APROVADA");
        inserirNota(
                "35267700000000000000000000000000000000000004", CLIENTE_ID, LOJA_ZARA, "80.00", agora, agora, "REJEITADA");
        inserirNota(
                "35267700000000000000000000000000000000000005", OUTRO_CLIENTE_ID, LOJA_ZARA, "90.00", agora, agora, "APROVADA");

        mockMvc.perform(get("/api/v1/notas/hoje").header("Authorization", consumidor()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].chaveAcesso").value(segunda))
                .andExpect(jsonPath("$[0].valorTotal").value(40.50))
                .andExpect(jsonPath("$[0].estabelecimento").value("Burger King"))
                .andExpect(jsonPath("$[0].categoria").value("Alimentação"))
                .andExpect(jsonPath("$[0].status").value("APROVADA"))
                .andExpect(jsonPath("$[0].dataEmissao").isNotEmpty())
                .andExpect(jsonPath("$[1].chaveAcesso").value(primeira))
                .andExpect(jsonPath("$[1].valorTotal").value(60.00))
                .andExpect(jsonPath("$[1].estabelecimento").value("Zara Shopping Hub"))
                .andExpect(jsonPath("$[1].categoria").value("Vestuário"));
    }

    @Test
    void notasHojeRequiresConsumidor() throws Exception {
        mockMvc.perform(get("/api/v1/notas/hoje")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/notas/hoje").header("Authorization", bearer("LOJISTA", null, LOJA_ZARA)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/v1/notas/hoje").header("Authorization", bearer("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isForbidden());
    }

    @Test
    void postNotasRequiresConsumidor() throws Exception {
        String corpo = "{\"chaveAcesso\":\"" + MockSefazGateway.CHAVE_ZARA_65 + "\"}";
        mockMvc.perform(post("/api/v1/notas").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_ZARA_65, bearer("LOJISTA", null, LOJA_ZARA)))
                .andExpect(status().isForbidden());
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_ZARA_65, bearer("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isForbidden());

        assertThat(notasComChave(MockSefazGateway.CHAVE_ZARA_65)).isZero();
    }

    @Test
    void registeredKeyReturns409EvenWhenSefazDoesNotKnowIt() throws Exception {
        mockMvc.perform(postNota(CHAVE_DO_SEED, consumidor()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("NOTA_DUPLICADA"));
        assertThat(notasComChave(CHAVE_DO_SEED)).isEqualTo(1);

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_FASTSHOP_55, consumidor())).andExpect(status().isCreated());
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_FASTSHOP_55, consumidor()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("NOTA_DUPLICADA"));
        assertThat(notasComChave(MockSefazGateway.CHAVE_FASTSHOP_55)).isEqualTo(1);

        mockMvc.perform(postNota(CHAVE_FORA_DO_CATALOGO, consumidor()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CHAVE_NAO_ENCONTRADA"));
        assertThat(notasComChave(CHAVE_FORA_DO_CATALOGO)).isZero();
    }

    @Test
    void beneficioCarriesMaskedCpfAndVoucherCreationTime() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje").header("Authorization", consumidor()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cpfMascarado").value("***.456.789-**"))
                .andExpect(jsonPath("$.voucher").value(nullValue()));

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_ZARA_65, consumidor())).andExpect(status().isCreated());
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_RENNER_85, consumidor())).andExpect(status().isCreated());

        String corpo = mockMvc.perform(
                        get("/api/v1/beneficios/estacionamento/hoje").header("Authorization", consumidor()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cpfMascarado").value("***.456.789-**"))
                .andExpect(jsonPath("$.voucherLiberado").value(true))
                .andExpect(jsonPath("$.voucher.codigoQr").isNotEmpty())
                .andExpect(jsonPath("$.voucher.criadoEm").isNotEmpty())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Instant criadoEm = Instant.parse(com.jayway.jsonpath.JsonPath.read(corpo, "$.voucher.criadoEm"));
        assertThat(criadoEm).isBetween(Instant.now().minus(5, ChronoUnit.MINUTES), Instant.now().plusSeconds(5));

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", bearer("CONSUMIDOR", OUTRO_CLIENTE_ID, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cpfMascarado").value("***.111.222-**"));
    }

    private MockHttpServletRequestBuilder postNota(String chave, String authorization) {
        return post("/api/v1/notas")
                .header("Authorization", authorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"chaveAcesso\":\"" + chave + "\"}");
    }

    private void inserirNota(
            String chave, UUID clienteId, UUID lojaId, String valor, Instant emissao, Instant cadastro, String status) {
        jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais
                    (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, data_cadastro, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                chave,
                clienteId,
                lojaId,
                new BigDecimal(valor),
                Timestamp.from(emissao),
                Timestamp.from(cadastro),
                status);
    }

    private int notasComChave(String chave) {
        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notas_fiscais WHERE chave_acesso = ?", Integer.class, chave);
    }

    private String consumidor() {
        return bearer("CONSUMIDOR", CLIENTE_ID, null);
    }

    private String bearer(String role, UUID clienteId, UUID lojaId) {
        AuthenticatedUser user = new AuthenticatedUser(
                UUID.randomUUID(), role.toLowerCase() + "@shopping.com", "unused", role, lojaId, clienteId);
        return "Bearer " + jwtService.generateToken(user);
    }
}
