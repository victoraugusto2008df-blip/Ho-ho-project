package com.hoho.shoppinghub.fiscal.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.RecordComponent;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class NotaFiscalValidadaEventTest {

    @Test
    void eventCarriesContractFields() {
        assertThat(NotaFiscalValidadaEvent.class.getRecordComponents())
                .extracting(RecordComponent::getName)
                .containsExactly(
                        "notaFiscalId",
                        "chaveAcesso",
                        "clienteId",
                        "lojaId",
                        "valorTotal",
                        "dataEmissao");

        UUID id = UUID.randomUUID();
        UUID clienteId = UUID.randomUUID();
        UUID lojaId = UUID.randomUUID();
        NotaFiscalValidadaEvent event = new NotaFiscalValidadaEvent(
                id, "chave", clienteId, lojaId, new BigDecimal("65.00"), Instant.now());

        assertThat(event.notaFiscalId()).isEqualTo(id);
        assertThat(event.chaveAcesso()).isEqualTo("chave");
        assertThat(event.clienteId()).isEqualTo(clienteId);
        assertThat(event.lojaId()).isEqualTo(lojaId);
    }
}
