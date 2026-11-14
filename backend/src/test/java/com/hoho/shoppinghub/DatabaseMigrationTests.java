package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class DatabaseMigrationTests {

    private static final UUID SEEDED_CLIENTE_ID =
            UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID SEEDED_LOJA_ID =
            UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final String SEEDED_CHAVE_ACESSO =
            "35261111111111000101650010000000010000000001";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void allTablesCreatedSuccessfully() {
        List<String> tables = jdbcTemplate.queryForList(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_type = 'BASE TABLE'
                """,
                String.class);

        assertThat(tables).contains(
                "categorias",
                "lojas",
                "clientes",
                "usuarios",
                "notas_fiscais",
                "vouchers_estacionamento",
                "campanhas");
    }

    @Test
    void duplicateChaveAcessoIsRejected() {
        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                SEEDED_CHAVE_ACESSO,
                SEEDED_CLIENTE_ID,
                SEEDED_LOJA_ID,
                new BigDecimal("100.00"),
                Timestamp.from(Instant.now()),
                "APROVADA"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void duplicateVoucherPerDayIsRejected() {
        LocalDate dataReferencia = LocalDate.of(2026, 11, 13);
        String codigoQr1 = "QR-TEST-UNIQUE-01";
        String codigoQr2 = "QR-TEST-UNIQUE-02";

        try {
            jdbcTemplate.update(
                    """
                    INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    SEEDED_CLIENTE_ID,
                    Date.valueOf(dataReferencia),
                    new BigDecimal("220.00"),
                    codigoQr1,
                    "LIBERADO");

            assertThatThrownBy(() -> jdbcTemplate.update(
                    """
                    INSERT INTO vouchers_estacionamento (cliente_id, data_referencia, valor_acumulado, codigo_qr, status)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    SEEDED_CLIENTE_ID,
                    Date.valueOf(dataReferencia),
                    new BigDecimal("250.00"),
                    codigoQr2,
                    "LIBERADO"))
                    .isInstanceOf(DataIntegrityViolationException.class);
        } finally {
            jdbcTemplate.update(
                    "DELETE FROM vouchers_estacionamento WHERE codigo_qr IN (?, ?)",
                    codigoQr1,
                    codigoQr2);
        }
    }

    @Test
    void invalidDiscountPercentageIsRejected() {
        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo)
                VALUES (?, ?, ?, ?)
                """,
                SEEDED_LOJA_ID,
                "Campanha Desconto Zero",
                0,
                "FREQUENCIA"))
                .isInstanceOf(DataIntegrityViolationException.class);

        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo)
                VALUES (?, ?, ?, ?)
                """,
                SEEDED_LOJA_ID,
                "Campanha Desconto Acima de Cem",
                101,
                "FREQUENCIA"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void negativeOrZeroReceiptValueIsRejected() {
        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                "35269999999999000199650010000000990000000001",
                SEEDED_CLIENTE_ID,
                SEEDED_LOJA_ID,
                new BigDecimal("0.00"),
                Timestamp.from(Instant.now()),
                "APROVADA"))
                .isInstanceOf(DataIntegrityViolationException.class);

        assertThatThrownBy(() -> jdbcTemplate.update(
                """
                INSERT INTO notas_fiscais (chave_acesso, cliente_id, loja_id, valor_total, data_emissao, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                "35269999999999000199650010000000990000000002",
                SEEDED_CLIENTE_ID,
                SEEDED_LOJA_ID,
                new BigDecimal("-10.00"),
                Timestamp.from(Instant.now()),
                "APROVADA"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void allCategoriesSeeded() {
        List<String> categorias = jdbcTemplate.queryForList(
                "SELECT nome FROM categorias ORDER BY nome",
                String.class);

        assertThat(categorias).containsExactlyInAnyOrder(
                "Vestuário",
                "Alimentação",
                "Eletrônicos",
                "Farmácia & Beleza");
    }

    @Test
    void kAnonymityStoreConditionSatisfied() {
        Integer activeClothingStores = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM lojas l
                JOIN categorias c ON l.categoria_id = c.id
                WHERE c.nome = ?
                  AND l.ativa = TRUE
                """,
                Integer.class,
                "Vestuário");

        assertThat(activeClothingStores).isGreaterThanOrEqualTo(3);
    }

    @Test
    void demoUsersWithBcryptPasswordExist() {
        List<Map<String, Object>> users = jdbcTemplate.queryForList(
                """
                SELECT email, role, senha_hash, cliente_id, loja_id
                FROM usuarios
                ORDER BY email
                """);

        assertThat(users).hasSize(3);

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        for (Map<String, Object> user : users) {
            String senhaHash = (String) user.get("senha_hash");
            assertThat(encoder.matches("demo123", senhaHash)).isTrue();
        }

        assertThat(users)
                .extracting(u -> (String) u.get("email") + ":" + (String) u.get("role"))
                .containsExactlyInAnyOrder(
                        "consumidor@shopping.com:CONSUMIDOR",
                        "lojista@shopping.com:LOJISTA",
                        "admin@shopping.com:ADMIN_SHOPPING");

        Map<String, Object> consumidor = users.stream()
                .filter(u -> "CONSUMIDOR".equals(u.get("role")))
                .findFirst()
                .orElseThrow();
        assertThat(consumidor.get("cliente_id")).isNotNull();

        Map<String, Object> lojista = users.stream()
                .filter(u -> "LOJISTA".equals(u.get("role")))
                .findFirst()
                .orElseThrow();
        assertThat(lojista.get("loja_id")).isNotNull();
    }

    @Test
    void historicalReceiptsAreSeeded() {
        Integer totalReceipts = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notas_fiscais",
                Integer.class);
        Integer validKeyLengthCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notas_fiscais WHERE LENGTH(chave_acesso) = 44",
                Integer.class);

        assertThat(totalReceipts).isEqualTo(15);
        assertThat(validKeyLengthCount).isEqualTo(15);
    }
}

