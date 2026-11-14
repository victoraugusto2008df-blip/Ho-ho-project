package com.hoho.shoppinghub.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.analytics.dto.DashboardResponse;
import com.hoho.shoppinghub.analytics.repository.AnalyticsRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

/** ReN05: com menos de 3 lojas ativas na categoria, a média da categoria fica oculta. */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class KAnonymityRegraTest {

    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID CATEGORIA_ID = UUID.fromString("11111111-1111-1111-1111-111111111101");

    @Mock
    private AnalyticsRepository repository;

    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        when(repository.valoresNotasDaLoja(LOJA_ID)).thenReturn(List.of(new BigDecimal("80.00")));
        when(repository.categoriaDaLoja(LOJA_ID)).thenReturn(CATEGORIA_ID);
        when(repository.valoresNotasDaCategoria(CATEGORIA_ID))
                .thenReturn(List.of(new BigDecimal("100.00"), new BigDecimal("200.01")));
        service = new AnalyticsService(repository);
    }

    @Test
    void belowThreeActiveStoresHidesTheCategoryAverage() {
        for (long lojasAtivas : new long[] {0, 1, 2}) {
            when(repository.lojasAtivasNaCategoria(CATEGORIA_ID)).thenReturn(lojasAtivas);

            DashboardResponse dashboard = service.montarDashboard(LOJA_ID);

            assertThat(dashboard.benchmarkingDisponivel()).as("k = %d", lojasAtivas).isFalse();
            assertThat(dashboard.mediaCategoria()).as("k = %d", lojasAtivas).isNull();
        }
        verify(repository, never()).valoresNotasDaCategoria(CATEGORIA_ID);
    }

    @Test
    void fromThreeActiveStoresShowsTheCategoryAverage() {
        for (long lojasAtivas : new long[] {3, 4}) {
            when(repository.lojasAtivasNaCategoria(CATEGORIA_ID)).thenReturn(lojasAtivas);

            DashboardResponse dashboard = service.montarDashboard(LOJA_ID);

            assertThat(dashboard.benchmarkingDisponivel()).as("k = %d", lojasAtivas).isTrue();
            assertThat(dashboard.mediaCategoria()).as("k = %d", lojasAtivas).isEqualTo(new BigDecimal("150.01"));
        }
    }
}
