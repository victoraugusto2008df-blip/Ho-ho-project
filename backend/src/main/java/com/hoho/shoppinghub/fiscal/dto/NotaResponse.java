package com.hoho.shoppinghub.fiscal.dto;

import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotaResponse(
        String chaveAcesso,
        BigDecimal valorTotal,
        Instant dataEmissao,
        String status,
        UUID clienteId,
        UUID lojaId) {

    public static NotaResponse from(NotaFiscal nota) {
        return new NotaResponse(
                nota.getChaveAcesso(),
                nota.getValorTotal(),
                nota.getDataEmissao(),
                nota.getStatus(),
                nota.getClienteId(),
                nota.getLojaId());
    }
}
