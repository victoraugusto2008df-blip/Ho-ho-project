package com.hoho.shoppinghub.fiscal.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LojaRepository extends JpaRepository<Loja, UUID> {

    Optional<Loja> findByCnpj(String cnpj);
}
