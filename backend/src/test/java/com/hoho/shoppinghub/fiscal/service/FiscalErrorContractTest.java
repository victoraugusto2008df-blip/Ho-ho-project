package com.hoho.shoppinghub.fiscal.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FiscalErrorContractTest {

    @Test
    void mapsEachRejectionToStatusAndCode() {
        assertThat(FiscalError.values())
                .extracting(error -> error.code() + ":" + error.status().value())
                .containsExactlyInAnyOrder(
                        "NOTA_DUPLICADA:409",
                        "NOTA_EXPIRADA_72H:422",
                        "LOJA_NAO_CREDENCIADA:422",
                        "CHAVE_NAO_ENCONTRADA:404",
                        "CHAVE_INVALIDA:400");
    }
}
