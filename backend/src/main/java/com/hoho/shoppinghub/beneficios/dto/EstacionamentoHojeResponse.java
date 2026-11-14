package com.hoho.shoppinghub.beneficios.dto;

import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamento;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record EstacionamentoHojeResponse(
        BigDecimal valorAcumulado,
        BigDecimal meta,
        int percentual,
        BigDecimal valorFaltante,
        boolean voucherLiberado,
        String cpfMascarado,
        VoucherResponse voucher) {

    public record VoucherResponse(
            UUID id,
            String codigoQr,
            String status,
            LocalDate dataReferencia,
            Instant criadoEm) {

        public static VoucherResponse from(VoucherEstacionamento voucher) {
            return new VoucherResponse(
                    voucher.getId(),
                    voucher.getCodigoQr(),
                    voucher.getStatus(),
                    voucher.getDataReferencia(),
                    voucher.getCriadoEm());
        }
    }
}
