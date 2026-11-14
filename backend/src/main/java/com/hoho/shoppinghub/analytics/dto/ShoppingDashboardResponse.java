package com.hoho.shoppinghub.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record ShoppingDashboardResponse(
        BigDecimal faturamentoTotal,
        List<DistribuicaoCategoria> distribuicaoPorCategoria,
        List<VolumeDiaHora> volumePorDiaHora,
        long totalVouchersLiberados,
        long totalCampanhasAtivas) {
}
