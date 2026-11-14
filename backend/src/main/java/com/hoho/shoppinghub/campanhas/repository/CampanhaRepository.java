package com.hoho.shoppinghub.campanhas.repository;

import com.hoho.shoppinghub.campanhas.dto.CampanhaRequest;
import com.hoho.shoppinghub.campanhas.dto.CampanhaResponse;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CampanhaRepository {

    private final JdbcTemplate jdbcTemplate;

    public CampanhaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /** Clientes distintos cuja nota aprovada mais recente na loja foi emitida antes de `corte`. */
    public int clientesComUltimaCompraAntesDe(UUID lojaId, Instant corte) {
        Integer total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FROM (
                    SELECT cliente_id
                    FROM notas_fiscais
                    WHERE loja_id = ? AND status = 'APROVADA'
                    GROUP BY cliente_id
                    HAVING MAX(data_emissao) < ?
                ) inativos
                """,
                Integer.class,
                lojaId,
                Timestamp.from(corte));
        return total != null ? total : 0;
    }

    public CampanhaResponse salvar(UUID lojaId, CampanhaRequest pedido, int publicoAtingido) {
        return jdbcTemplate.queryForObject(
                """
                INSERT INTO campanhas (loja_id, titulo, desconto_percentual, criterio_alvo, publico_atingido)
                VALUES (?, ?, ?, ?, ?)
                RETURNING id, titulo, desconto_percentual, criterio_alvo, publico_atingido, criado_em
                """,
                (rs, i) -> new CampanhaResponse(
                        rs.getObject("id", UUID.class),
                        rs.getString("titulo"),
                        rs.getInt("desconto_percentual"),
                        rs.getString("criterio_alvo"),
                        rs.getInt("publico_atingido"),
                        rs.getTimestamp("criado_em").toInstant()),
                lojaId,
                pedido.titulo(),
                pedido.descontoPercentual(),
                pedido.criterioAlvo(),
                publicoAtingido);
    }
}
