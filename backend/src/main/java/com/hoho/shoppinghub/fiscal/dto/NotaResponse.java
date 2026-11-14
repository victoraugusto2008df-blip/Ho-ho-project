package com.hoho.shoppinghub.fiscal.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotaResponse(
        String chaveAcesso,
        BigDecimal valorTotal,
        Instant dataEmissao,
        String status,
        UUID clienteId,
        UUID lojaId,
        String estabelecimento,
        String categoria) {
}
