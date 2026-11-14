package com.hoho.shoppinghub.campanhas.dto;

import java.time.Instant;
import java.util.UUID;

public record CampanhaResponse(
        UUID id,
        String titulo,
        int descontoPercentual,
        String criterioAlvo,
        int publicoAtingido,
        Instant criadoEm) {
}
