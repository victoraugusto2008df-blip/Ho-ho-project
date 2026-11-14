package com.hoho.shoppinghub.fiscal.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, UUID> {

    boolean existsByChaveAcesso(String chaveAcesso);

    @Query("""
            SELECT COALESCE(SUM(n.valorTotal), 0)
            FROM NotaFiscal n
            WHERE n.clienteId = :clienteId
              AND n.status = 'APROVADA'
              AND n.dataEmissao >= :inicioDia
              AND n.dataEmissao < :fimDia
            """)
    BigDecimal sumValorAprovadoNoDia(
            @Param("clienteId") UUID clienteId,
            @Param("inicioDia") Instant inicioDia,
            @Param("fimDia") Instant fimDia);
}
