package com.hoho.shoppinghub.fiscal.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotaFiscalValidadaEvent(
        UUID notaFiscalId,
        String chaveAcesso,
        UUID clienteId,
        UUID lojaId,
        BigDecimal valorTotal,
        Instant dataEmissao) {
}
