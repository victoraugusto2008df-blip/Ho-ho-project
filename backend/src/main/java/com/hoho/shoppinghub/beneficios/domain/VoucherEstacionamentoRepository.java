package com.hoho.shoppinghub.beneficios.domain;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherEstacionamentoRepository extends JpaRepository<VoucherEstacionamento, UUID> {

    Optional<VoucherEstacionamento> findByClienteIdAndDataReferencia(UUID clienteId, LocalDate dataReferencia);

    boolean existsByClienteIdAndDataReferencia(UUID clienteId, LocalDate dataReferencia);

    /** CPF já mascarado do cliente (LGPD: o CPF claro nunca é guardado). */
    @Query(value = "SELECT cpf_mascarado FROM clientes WHERE id = :clienteId", nativeQuery = true)
    String cpfMascaradoDoCliente(@Param("clienteId") UUID clienteId);
}
