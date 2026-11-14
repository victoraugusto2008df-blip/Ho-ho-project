package com.hoho.shoppinghub.analytics.repository;

import com.hoho.shoppinghub.analytics.dto.CategoriaTotal;
import com.hoho.shoppinghub.analytics.dto.VolumeDiaHora;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ShoppingAnalyticsRepository {

    private static final Map<Integer, String> DIAS_SEMANA = Map.of(
            1, "SEGUNDA",
            2, "TERÇA",
            3, "QUARTA",
            4, "QUINTA",
            5, "SEXTA",
            6, "SÁBADO",
            7, "DOMINGO");

    private final JdbcTemplate jdbcTemplate;

    public ShoppingAnalyticsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CategoriaTotal> totaisPorCategoria() {
        return jdbcTemplate.query(
                """
                SELECT c.nome AS categoria, COALESCE(SUM(n.valor_total), 0) AS total
                FROM notas_fiscais n
                JOIN lojas l ON n.loja_id = l.id
                JOIN categorias c ON l.categoria_id = c.id
                WHERE n.status = 'APROVADA'
                GROUP BY c.nome
                ORDER BY c.nome
                """,
                (rs, i) -> new CategoriaTotal(rs.getString("categoria"), rs.getBigDecimal("total")));
    }

    public List<VolumeDiaHora> volumePorDiaHora() {
        return jdbcTemplate.query(
                """
                SELECT EXTRACT(ISODOW FROM data_emissao) AS dia, EXTRACT(HOUR FROM data_emissao) AS hora, COUNT(*) AS total
                FROM notas_fiscais
                WHERE status = 'APROVADA'
                GROUP BY dia, hora
                ORDER BY dia, hora
                """,
                (rs, i) -> new VolumeDiaHora(
                        DIAS_SEMANA.getOrDefault(rs.getInt("dia"), "?"),
                        rs.getInt("hora"),
                        rs.getInt("total")));
    }

    public long totalVouchersLiberados() {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM vouchers_estacionamento WHERE status = 'LIBERADO'",
                Long.class);
        return count != null ? count : 0L;
    }

    public long totalCampanhasAtivas() {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM campanhas",
                Long.class);
        return count != null ? count : 0L;
    }
}
