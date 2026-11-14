package com.hoho.shoppinghub.fiscal.domain;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Representação imutável dos dados fiscais retornados pelo gateway da SEFAZ.
 */
public record DadosNotaFiscalSefaz(
        String chaveAcesso,
        String cnpjEmitente,
        BigDecimal valorTotal,
        Instant dataEmissao) {
}
