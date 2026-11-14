package com.hoho.shoppinghub.campanhas.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** A loja nunca vem no corpo: é a do token. */
public record CampanhaRequest(
        @NotBlank @Size(max = 150) String titulo,
        @NotNull @Min(1) @Max(100) Integer descontoPercentual,
        @NotNull @Pattern(regexp = "INATIVOS_60_DIAS") String criterioAlvo) {
}
