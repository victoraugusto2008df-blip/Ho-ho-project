package com.hoho.shoppinghub.analytics.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.RecordComponent;
import org.junit.jupiter.api.Test;

class ShoppingDashboardResponseTest {

    @Test
    void recordCarriesContractFields() {
        assertThat(ShoppingDashboardResponse.class.getRecordComponents())
                .extracting(RecordComponent::getName)
                .containsExactly(
                        "faturamentoTotal",
                        "distribuicaoPorCategoria",
                        "volumePorDiaHora",
                        "totalVouchersLiberados",
                        "totalCampanhasAtivas");
    }
}
