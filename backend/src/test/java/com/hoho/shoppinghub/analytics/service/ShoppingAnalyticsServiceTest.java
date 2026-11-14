package com.hoho.shoppinghub.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.analytics.dto.CategoriaTotal;
import com.hoho.shoppinghub.analytics.dto.ShoppingDashboardResponse;
import com.hoho.shoppinghub.analytics.repository.ShoppingAnalyticsRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ShoppingAnalyticsServiceTest {

    @Mock
    private ShoppingAnalyticsRepository repository;

    @Test
    void faturamentoTotalIsSumOfAprovada() {
        when(repository.totaisPorCategoria()).thenReturn(List.of(
                new CategoriaTotal("Vestuário", new BigDecimal("1678.20")),
                new CategoriaTotal("Alimentação", new BigDecimal("167.70")),
                new CategoriaTotal("Eletrônicos", new BigDecimal("1349.00"))));
        when(repository.volumePorDiaHora()).thenReturn(List.of());
        when(repository.totalVouchersLiberados()).thenReturn(0L);
        when(repository.totalCampanhasAtivas()).thenReturn(0L);

        ShoppingAnalyticsService service = new ShoppingAnalyticsService(repository);
        ShoppingDashboardResponse response = service.montarDashboard();

        assertThat(response.faturamentoTotal()).isEqualByComparingTo("3194.90");
    }

    @Test
    void distribuicaoPercentualSomaCem() {
        when(repository.totaisPorCategoria()).thenReturn(List.of(
                new CategoriaTotal("Vestuário", new BigDecimal("1678.20")),
                new CategoriaTotal("Alimentação", new BigDecimal("167.70")),
                new CategoriaTotal("Eletrônicos", new BigDecimal("1349.00"))));
        when(repository.volumePorDiaHora()).thenReturn(List.of());
        when(repository.totalVouchersLiberados()).thenReturn(0L);
        when(repository.totalCampanhasAtivas()).thenReturn(0L);

        ShoppingAnalyticsService service = new ShoppingAnalyticsService(repository);
        ShoppingDashboardResponse response = service.montarDashboard();

        BigDecimal soma = response.distribuicaoPorCategoria().stream()
                .map(dist -> dist.percentual())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertThat(soma).isEqualByComparingTo("100.00");
    }
}
