package com.hoho.shoppinghub.analytics.service;

import com.hoho.shoppinghub.analytics.dto.CategoriaTotal;
import com.hoho.shoppinghub.analytics.dto.DistribuicaoCategoria;
import com.hoho.shoppinghub.analytics.dto.ShoppingDashboardResponse;
import com.hoho.shoppinghub.analytics.repository.ShoppingAnalyticsRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ShoppingAnalyticsService {

    private static final BigDecimal CEM = new BigDecimal("100");

    private final ShoppingAnalyticsRepository repository;

    public ShoppingAnalyticsService(ShoppingAnalyticsRepository repository) {
        this.repository = repository;
    }

    public ShoppingDashboardResponse montarDashboard() {
        List<CategoriaTotal> totais = repository.totaisPorCategoria();
        BigDecimal faturamentoTotal = totais.stream()
                .map(CategoriaTotal::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        return new ShoppingDashboardResponse(
                faturamentoTotal,
                distribuicao(totais, faturamentoTotal),
                repository.volumePorDiaHora(),
                repository.totalVouchersLiberados(),
                repository.totalCampanhasAtivas());
    }

    private List<DistribuicaoCategoria> distribuicao(List<CategoriaTotal> totais, BigDecimal faturamentoTotal) {
        if (faturamentoTotal.compareTo(BigDecimal.ZERO) == 0) {
            return List.of();
        }
        List<CategoriaTotal> ordenados = totais.stream()
                .sorted(Comparator.comparing(CategoriaTotal::total))
                .toList();
        List<DistribuicaoCategoria> resultado = new ArrayList<>();
        BigDecimal acumulado = BigDecimal.ZERO;
        for (int i = 0; i < ordenados.size(); i++) {
            CategoriaTotal item = ordenados.get(i);
            BigDecimal percentual;
            if (i == ordenados.size() - 1) {
                percentual = CEM.subtract(acumulado);
            } else {
                percentual = item.total()
                        .multiply(CEM)
                        .divide(faturamentoTotal, 2, RoundingMode.HALF_UP);
                acumulado = acumulado.add(percentual);
            }
            resultado.add(new DistribuicaoCategoria(item.categoria(), percentual));
        }
        return resultado;
    }
}
