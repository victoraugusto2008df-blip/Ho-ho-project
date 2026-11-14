package com.hoho.shoppinghub.campanhas.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CampanhaRequest(
        @NotBlank(message = "Título da campanha é obrigatório")
        @Size(max = 150, message = "Título deve ter no máximo 150 caracteres")
        String titulo,

        @NotNull(message = "Percentual de desconto é obrigatório")
        @Min(value = 1, message = "Desconto deve ser no mínimo 1%")
        @Max(value = 100, message = "Desconto deve ser no máximo 100%")
        Integer descontoPercentual,

        @NotBlank(message = "Critério alvo é obrigatório")
        @Size(max = 100, message = "Critério alvo deve ter no máximo 100 caracteres")
        String criterioAlvo) {
}
