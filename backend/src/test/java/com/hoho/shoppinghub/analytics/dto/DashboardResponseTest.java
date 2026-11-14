package com.hoho.shoppinghub.analytics.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.RecordComponent;
import org.junit.jupiter.api.Test;

class DashboardResponseTest {

    @Test
    void recordCarriesContractFields() {
        assertThat(DashboardResponse.class.getRecordComponents())
                .extracting(RecordComponent::getName)
                .containsExactly(
                        "ticketMedio",
                        "benchmarkingDisponivel",
                        "mediaCategoria",
                        "horariosPico",
                        "diasPico",
                        "crossShopping");
    }
}
