package com.hoho.shoppinghub.beneficios.domain;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherEstacionamentoRepository extends JpaRepository<VoucherEstacionamento, UUID> {

    Optional<VoucherEstacionamento> findByClienteIdAndDataReferencia(UUID clienteId, LocalDate dataReferencia);

    boolean existsByClienteIdAndDataReferencia(UUID clienteId, LocalDate dataReferencia);
}
