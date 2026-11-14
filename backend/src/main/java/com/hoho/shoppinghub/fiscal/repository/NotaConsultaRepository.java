package com.hoho.shoppinghub.fiscal.repository;

import com.hoho.shoppinghub.fiscal.dto.NotaResponse;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

/** Leitura das notas com o nome da loja e da categoria, como a Tela 1 as exibe. */
@Repository
public class NotaConsultaRepository {

    private static final String SELECT = """
            SELECT n.chave_acesso, n.valor_total, n.data_emissao, n.status, n.cliente_id, n.loja_id,
                   l.nome AS estabelecimento, c.nome AS categoria
            FROM notas_fiscais n
            JOIN lojas l ON n.loja_id = l.id
            JOIN categorias c ON l.categoria_id = c.id
            """;

    private static final RowMapper<NotaResponse> MAPPER = (rs, i) -> new NotaResponse(
            rs.getString("chave_acesso"),
            rs.getBigDecimal("valor_total"),
            rs.getTimestamp("data_emissao").toInstant(),
            rs.getString("status"),
            rs.getObject("cliente_id", UUID.class),
            rs.getObject("loja_id", UUID.class),
            rs.getString("estabelecimento"),
            rs.getString("categoria"));

    private final JdbcTemplate jdbcTemplate;

    public NotaConsultaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public NotaResponse porChave(String chaveAcesso) {
        return jdbcTemplate.queryForObject(SELECT + "WHERE n.chave_acesso = ?", MAPPER, chaveAcesso);
    }

    /** Notas aprovadas do cliente emitidas em [inicio, fim), a cadastrada por último primeiro. */
    public List<NotaResponse> aprovadasDoCliente(UUID clienteId, Instant inicio, Instant fim) {
        return jdbcTemplate.query(
                SELECT + """
                        WHERE n.cliente_id = ? AND n.status = 'APROVADA'
                          AND n.data_emissao >= ? AND n.data_emissao < ?
                        ORDER BY n.data_cadastro DESC, n.data_emissao DESC
                        """,
                MAPPER,
                clienteId,
                Timestamp.from(inicio),
                Timestamp.from(fim));
    }
}
