package com.hoho.shoppinghub.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record ShoppingDashboardResponse(
        BigDecimal faturamentoTotal,
        long vouchersLiberados,
        long campanhasAtivas,
        List<FaturamentoCategoria> faturamentoPorCategoria) {
}
