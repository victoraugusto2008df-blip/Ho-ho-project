package com.hoho.shoppinghub.campanhas.dto;

import com.hoho.shoppinghub.campanhas.domain.Campanha;
import java.time.Instant;
import java.util.UUID;

public record CampanhaResponse(
        UUID id,
        UUID lojaId,
        String titulo,
        int descontoPercentual,
        String criterioAlvo,
        int publicoAtingido,
        Instant criadoEm) {

    public static CampanhaResponse from(Campanha campanha) {
        return new CampanhaResponse(
                campanha.getId(),
                campanha.getLojaId(),
                campanha.getTitulo(),
                campanha.getDescontoPercentual(),
                campanha.getCriterioAlvo(),
                campanha.getPublicoAtingido(),
                campanha.getCriadoEm());
    }
}
