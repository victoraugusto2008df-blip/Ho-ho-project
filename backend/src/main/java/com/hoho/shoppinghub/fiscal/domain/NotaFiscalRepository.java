package com.hoho.shoppinghub.fiscal.domain;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, UUID> {

    boolean existsByChaveAcesso(String chaveAcesso);
}
