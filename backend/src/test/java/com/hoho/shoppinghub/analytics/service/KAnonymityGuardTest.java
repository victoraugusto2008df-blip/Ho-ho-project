package com.hoho.shoppinghub.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.analytics.dto.DashboardResponse;
import com.hoho.shoppinghub.analytics.repository.AnalyticsRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class KAnonymityGuardTest {

    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID CATEGORIA_ID = UUID.fromString("11111111-1111-1111-1111-111111111101");

    @Mock
    private AnalyticsRepository repository;

    @Test
    void benchmarkAvailableOnlyFromThreeActiveStores() {
        when(repository.valoresNotasDaLoja(LOJA_ID)).thenReturn(List.of(new BigDecimal("100.00")));
        when(repository.categoriaDaLoja(LOJA_ID)).thenReturn(CATEGORIA_ID);
        when(repository.valoresNotasDaCategoria(CATEGORIA_ID)).thenReturn(List.of(new BigDecimal("100.00")));
        when(repository.picosPorHora(LOJA_ID)).thenReturn(List.of());
        when(repository.picosPorDia(LOJA_ID)).thenReturn(List.of());
        when(repository.crossShopping(LOJA_ID, CATEGORIA_ID)).thenReturn(List.of());

        AnalyticsService service = new AnalyticsService(repository);

        when(repository.lojasAtivasNaCategoria(CATEGORIA_ID)).thenReturn(2L);
        DashboardResponse abaixo = service.montarDashboard(LOJA_ID);
        assertThat(abaixo.benchmarkingDisponivel()).isFalse();
        assertThat(abaixo.mediaCategoria()).isNull();

        when(repository.lojasAtivasNaCategoria(CATEGORIA_ID)).thenReturn(3L);
        DashboardResponse tres = service.montarDashboard(LOJA_ID);
        assertThat(tres.benchmarkingDisponivel()).isTrue();
        assertThat(tres.mediaCategoria()).isEqualByComparingTo("100.00");
    }
}
