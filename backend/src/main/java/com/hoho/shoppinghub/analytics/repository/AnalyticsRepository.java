package com.hoho.shoppinghub.analytics.repository;

import com.hoho.shoppinghub.analytics.dto.CrossShoppingItem;
import com.hoho.shoppinghub.analytics.dto.FaturamentoCategoria;
import com.hoho.shoppinghub.analytics.dto.PicoDia;
import com.hoho.shoppinghub.analytics.dto.PicoHora;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AnalyticsRepository {

    private static final Map<Integer, String> DIAS_SEMANA = Map.of(
            1, "SEGUNDA",
            2, "TERÇA",
            3, "QUARTA",
            4, "QUINTA",
            5, "SEXTA",
            6, "SÁBADO",
            7, "DOMINGO");

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BigDecimal> valoresNotasDaLoja(UUID lojaId) {
        return jdbcTemplate.query(
                "SELECT valor_total FROM notas_fiscais WHERE loja_id = ? AND status = 'APROVADA'",
                (rs, i) -> rs.getBigDecimal("valor_total"),
                lojaId);
    }

    public UUID categoriaDaLoja(UUID lojaId) {
        return jdbcTemplate.queryForObject(
                "SELECT categoria_id FROM lojas WHERE id = ?", UUID.class, lojaId);
    }

    public long lojasAtivasNaCategoria(UUID categoriaId) {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM lojas WHERE categoria_id = ? AND ativa = TRUE",
                Long.class,
                categoriaId);
        return count != null ? count : 0L;
    }

    public List<BigDecimal> valoresNotasDaCategoria(UUID categoriaId) {
        return jdbcTemplate.query(
                """
                SELECT n.valor_total
                FROM notas_fiscais n
                JOIN lojas l ON n.loja_id = l.id
                WHERE l.categoria_id = ? AND l.ativa = TRUE AND n.status = 'APROVADA'
                """,
                (rs, i) -> rs.getBigDecimal("valor_total"),
                categoriaId);
    }

    public List<PicoHora> picosPorHora(UUID lojaId) {
        return jdbcTemplate.query(
                """
                SELECT EXTRACT(HOUR FROM data_emissao) AS hora, COUNT(*) AS total
                FROM notas_fiscais
                WHERE loja_id = ? AND status = 'APROVADA'
                GROUP BY hora
                ORDER BY hora
                """,
                (rs, i) -> new PicoHora(rs.getInt("hora"), rs.getInt("total")),
                lojaId);
    }

    public List<PicoDia> picosPorDia(UUID lojaId) {
        return jdbcTemplate.query(
                """
                SELECT EXTRACT(ISODOW FROM data_emissao) AS dia, COUNT(*) AS total
                FROM notas_fiscais
                WHERE loja_id = ? AND status = 'APROVADA'
                GROUP BY dia
                ORDER BY dia
                """,
                (rs, i) -> new PicoDia(
                        DIAS_SEMANA.getOrDefault(rs.getInt("dia"), "?"),
                        rs.getInt("total")),
                lojaId);
    }

    public List<CrossShoppingItem> crossShopping(UUID lojaId, UUID categoriaId) {
        return jdbcTemplate.query(
                """
                SELECT c.nome AS categoria, COUNT(*) AS total
                FROM notas_fiscais n
                JOIN lojas l ON n.loja_id = l.id
                JOIN categorias c ON l.categoria_id = c.id
                WHERE n.cliente_id IN (SELECT DISTINCT cliente_id FROM notas_fiscais WHERE loja_id = ?)
                  AND l.categoria_id <> ?
                  AND n.status = 'APROVADA'
                GROUP BY c.nome
                ORDER BY total DESC
                """,
                (rs, i) -> new CrossShoppingItem(rs.getString("categoria"), rs.getInt("total")),
                lojaId,
                categoriaId);
    }

    /** Soma das notas aprovadas por categoria, da maior para a menor; categoria sem nota fica fora. */
    public List<FaturamentoCategoria> faturamentoPorCategoria() {
        return jdbcTemplate.query(
                """
                SELECT c.nome AS categoria, SUM(n.valor_total) AS valor
                FROM notas_fiscais n
                JOIN lojas l ON n.loja_id = l.id
                JOIN categorias c ON l.categoria_id = c.id
                WHERE n.status = 'APROVADA'
                GROUP BY c.nome
                ORDER BY valor DESC, c.nome
                """,
                (rs, i) -> new FaturamentoCategoria(rs.getString("categoria"), rs.getBigDecimal("valor")));
    }

    public long totalVouchers() {
        return contar("SELECT COUNT(*) FROM vouchers_estacionamento");
    }

    public long totalCampanhas() {
        return contar("SELECT COUNT(*) FROM campanhas");
    }

    private long contar(String sql) {
        Long total = jdbcTemplate.queryForObject(sql, Long.class);
        return total != null ? total : 0L;
    }
}
