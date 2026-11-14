package com.hoho.shoppinghub.auth.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CpfMaskUtilTest {

    @Test
    void maskOf12345678901ReturnsMaskedFormat() {
        assertThat(CpfMaskUtil.mask("12345678901")).isEqualTo("***.456.789-**");
    }

    @Test
    void maskInvariantHoldsAcrossCpfInputs() {
        for (String cpf : new String[] {"00000000000", "12345678901", "99999999999", "11111111111"}) {
            String masked = CpfMaskUtil.mask(cpf);
            assertThat(masked).hasSize(14);
            assertThat(masked.substring(0, 4)).isEqualTo("***.");
            assertThat(masked.substring(11)).isEqualTo("-**");
            assertThat(masked).matches("\\*\\*\\*\\.\\d{3}\\.\\d{3}-\\*\\*");
        }
    }
}
