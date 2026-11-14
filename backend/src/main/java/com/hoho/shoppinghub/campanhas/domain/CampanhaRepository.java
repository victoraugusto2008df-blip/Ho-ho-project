package com.hoho.shoppinghub.campanhas.domain;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampanhaRepository extends JpaRepository<Campanha, UUID> {
}
