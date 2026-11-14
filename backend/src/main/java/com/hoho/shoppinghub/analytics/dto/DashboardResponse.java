package com.hoho.shoppinghub.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal ticketMedio,
        boolean benchmarkingDisponivel,
        BigDecimal mediaCategoria,
        List<PicoHora> horariosPico,
        List<PicoDia> diasPico,
        List<CrossShoppingItem> crossShopping) {
}
