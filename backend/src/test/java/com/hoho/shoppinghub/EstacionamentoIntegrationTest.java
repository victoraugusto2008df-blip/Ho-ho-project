package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamento;
import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamentoRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class EstacionamentoIntegrationTest {

    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private VoucherEstacionamentoRepository voucherRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    @AfterEach
    void cleanupTestData() {
        jdbcTemplate.update("DELETE FROM vouchers_estacionamento WHERE cliente_id = ?", CLIENTE_ID);
        jdbcTemplate.update("DELETE FROM notas_fiscais WHERE chave_acesso LIKE '352688%'");
    }

    @Test
    void twoReceiptsOf80EmitExactlyOneVoucher() {
        registrarNotaAprovada("35268811111111000101650010000008010000000801", new BigDecimal("80.00"), Instant.now());
        registrarNotaAprovada("35268811111111000101650010000008020000000802", new BigDecimal("80.00"), Instant.now());

        List<VoucherEstacionamento> vouchers = voucherRepository.findAll().stream()
                .filter(v -> v.getClienteId().equals(CLIENTE_ID))
                .toList();

        assertThat(vouchers).hasSize(1);
        assertThat(vouchers.getFirst().getStatus()).isEqualTo("LIBERADO");
        assertThat(vouchers.getFirst().getValorAcumulado()).isEqualByComparingTo("160.00");
        assertThat(vouchers.getFirst().getCodigoQr()).startsWith("HOHO-PARK-");
    }

    @Test
    void thirdReceiptSameDayDoesNotEmitSecondVoucher() {
        registrarNotaAprovada("35268811111111000101650010000008030000000803", new BigDecimal("80.00"), Instant.now());
        registrarNotaAprovada("35268811111111000101650010000008040000000804", new BigDecimal("80.00"), Instant.now());
        registrarNotaAprovada("35268811111111000101650010000008050000000805", new BigDecimal("50.00"), Instant.now());

        long voucherCount = voucherRepository.findAll().stream()
                .filter(v -> v.getClienteId().equals(CLIENTE_ID)
                        && v.getDataReferencia().equals(LocalDate.now()))
                .count();

        assertThat(voucherCount).isEqualTo(1);
    }

    @Test
    void onlyApprovedReceiptsFromTodayAreSummed() throws Exception {
        registrarNotaAprovada(
                "35268811111111000101650010000008060000000806",
                new BigDecimal("140.00"),
                Instant.now().minus(1, ChronoUnit.DAYS));

        jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                "35268811111111000101650010000008070000000807",
                CLIENTE_ID,
                LOJA_ID,
                new BigDecimal("200.00"),
                Timestamp.from(Instant.now()),
                "REJEITADA");

        registrarNotaAprovada("35268811111111000101650010000008080000000808", new BigDecimal("50.00"), Instant.now());

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("CONSUMIDOR", CLIENTE_ID, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valorAcumulado").value(50.00))
                .andExpect(jsonPath("$.percentual").value(33))
                .andExpect(jsonPath("$.valorFaltante").value(100.00))
                .andExpect(jsonPath("$.voucherLiberado").value(false))
                .andExpect(jsonPath("$.voucher").isEmpty());
    }

    @Test
    void duplicateVoucherSameDayIsRejectedByDatabaseConstraint() {
        LocalDate hoje = LocalDate.now();
        jdbcTemplate.update(
                """
                INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status)
                VALUES (?, ?, ?, ?, ?)
                """,
                CLIENTE_ID,
                Date.valueOf(hoje),
                new BigDecimal("150.00"),
                "QR-TEST-DUP-01",
                "LIBERADO");

        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status)
                VALUES (?, ?, ?, ?, ?)
                """,
                CLIENTE_ID,
                Date.valueOf(hoje),
                new BigDecimal("200.00"),
                "QR-TEST-DUP-02",
                "LIBERADO"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void getHojeReturnsZeroProgressWhenNoReceiptsToday() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("CONSUMIDOR", CLIENTE_ID, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valorAcumulado").value(0.00))
                .andExpect(jsonPath("$.meta").value(150.00))
                .andExpect(jsonPath("$.percentual").value(0))
                .andExpect(jsonPath("$.valorFaltante").value(150.00))
                .andExpect(jsonPath("$.voucherLiberado").value(false))
                .andExpect(jsonPath("$.voucher").isEmpty());
    }

    @Test
    void getHojeReturnsPartialProgress() throws Exception {
        registrarNotaAprovada("35268811111111000101650010000008090000000809", new BigDecimal("65.00"), Instant.now());

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("CONSUMIDOR", CLIENTE_ID, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valorAcumulado").value(65.00))
                .andExpect(jsonPath("$.meta").value(150.00))
                .andExpect(jsonPath("$.percentual").value(43))
                .andExpect(jsonPath("$.valorFaltante").value(85.00))
                .andExpect(jsonPath("$.voucherLiberado").value(false))
                .andExpect(jsonPath("$.voucher").isEmpty());
    }

    @Test
    void getHojeReturnsLiberatedVoucherAndQrCode() throws Exception {
        registrarNotaAprovada("35268811111111000101650010000008100000000810", new BigDecimal("80.00"), Instant.now());
        registrarNotaAprovada("35268811111111000101650010000008110000000811", new BigDecimal("80.00"), Instant.now());

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("CONSUMIDOR", CLIENTE_ID, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valorAcumulado").value(160.00))
                .andExpect(jsonPath("$.meta").value(150.00))
                .andExpect(jsonPath("$.percentual").value(100))
                .andExpect(jsonPath("$.valorFaltante").value(0.00))
                .andExpect(jsonPath("$.voucherLiberado").value(true))
                .andExpect(jsonPath("$.voucher.id").isNotEmpty())
                .andExpect(jsonPath("$.voucher.codigoQr").isNotEmpty())
                .andExpect(jsonPath("$.voucher.status").value("LIBERADO"))
                .andExpect(jsonPath("$.voucher.dataReferencia").value(LocalDate.now().toString()));
    }

    @Test
    void getHojeEnforcesConsumidorAuthorization() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("LOJISTA", null, LOJA_ID)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/beneficios/estacionamento/hoje")
                        .header("Authorization", "Bearer " + tokenFor("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isForbidden());
    }

    private void registrarNotaAprovada(String chaveAcesso, BigDecimal valorTotal, Instant dataEmissao) {
        NotaFiscal salva = notaFiscalRepository.saveAndFlush(
                new NotaFiscal(chaveAcesso, CLIENTE_ID, LOJA_ID, valorTotal, dataEmissao));
        eventPublisher.publishEvent(new NotaFiscalValidadaEvent(
                salva.getId(),
                salva.getChaveAcesso(),
                salva.getClienteId(),
                salva.getLojaId(),
                salva.getValorTotal(),
                salva.getDataEmissao()));
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
