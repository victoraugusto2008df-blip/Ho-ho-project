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
class AnalyticsServiceTest {

    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID CATEGORIA_ID = UUID.fromString("11111111-1111-1111-1111-111111111101");

    @Mock
    private AnalyticsRepository repository;

    @Test
    void ticketMedioIsAverageOfValorTotal() {
        when(repository.valoresNotasDaLoja(LOJA_ID))
                .thenReturn(List.of(new BigDecimal("100.00"), new BigDecimal("200.00"), new BigDecimal("300.00")));
        when(repository.categoriaDaLoja(LOJA_ID)).thenReturn(CATEGORIA_ID);
        when(repository.lojasAtivasNaCategoria(CATEGORIA_ID)).thenReturn(3L);
        when(repository.valoresNotasDaCategoria(CATEGORIA_ID)).thenReturn(List.of(new BigDecimal("150.00")));
        when(repository.picosPorHora(LOJA_ID)).thenReturn(List.of());
        when(repository.picosPorDia(LOJA_ID)).thenReturn(List.of());
        when(repository.crossShopping(LOJA_ID, CATEGORIA_ID)).thenReturn(List.of());

        AnalyticsService service = new AnalyticsService(repository);
        DashboardResponse response = service.montarDashboard(LOJA_ID);

        assertThat(response.ticketMedio()).isEqualByComparingTo("200.00");
    }
}
