package com.hoho.shoppinghub.analytics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public record ShoppingDashboardResponse(
        BigDecimal faturamentoTotal,
        List<DistribuicaoCategoria> distribuicaoPorCategoria,
        List<VolumeDiaHora> volumePorDiaHora,
        long totalVouchersLiberados,
        long totalCampanhasAtivas) {

    @JsonProperty("vouchersLiberados")
    public long vouchersLiberados() {
        return totalVouchersLiberados;
    }

    @JsonProperty("campanhasAtivas")
    public long campanhasAtivas() {
        return totalCampanhasAtivas;
    }

    @JsonProperty("faturamentoPorCategoria")
    public List<FaturamentoCategoria> faturamentoPorCategoria() {
        if (distribuicaoPorCategoria == null || faturamentoTotal == null) {
            return List.of();
        }
        return distribuicaoPorCategoria.stream()
                .map(d -> new FaturamentoCategoria(
                        d.categoria(),
                        faturamentoTotal.multiply(d.percentual())
                                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)))
                .toList();
    }
}
