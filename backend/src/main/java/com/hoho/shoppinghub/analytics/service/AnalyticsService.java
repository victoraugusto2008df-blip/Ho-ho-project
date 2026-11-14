package com.hoho.shoppinghub.analytics.service;

import com.hoho.shoppinghub.analytics.dto.DashboardResponse;
import com.hoho.shoppinghub.analytics.repository.AnalyticsRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    static final int K_ANONYMITY_MIN_STORES = 3;

    private final AnalyticsRepository repository;

    public AnalyticsService(AnalyticsRepository repository) {
        this.repository = repository;
    }

    public DashboardResponse montarDashboard(UUID lojaId) {
        BigDecimal ticketMedio = media(repository.valoresNotasDaLoja(lojaId));
        UUID categoriaId = repository.categoriaDaLoja(lojaId);
        long lojasAtivas = repository.lojasAtivasNaCategoria(categoriaId);
        boolean benchmarkingDisponivel = lojasAtivas >= K_ANONYMITY_MIN_STORES;
        BigDecimal mediaCategoria =
                benchmarkingDisponivel ? media(repository.valoresNotasDaCategoria(categoriaId)) : null;

        return new DashboardResponse(
                ticketMedio,
                benchmarkingDisponivel,
                mediaCategoria,
                repository.picosPorHora(lojaId),
                repository.picosPorDia(lojaId),
                repository.crossShopping(lojaId, categoriaId));
    }

    private static BigDecimal media(List<BigDecimal> valores) {
        if (valores.isEmpty()) {
            return BigDecimal.ZERO.setScale(2);
        }
        BigDecimal soma = valores.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return soma.divide(BigDecimal.valueOf(valores.size()), 2, RoundingMode.HALF_UP);
    }
}
