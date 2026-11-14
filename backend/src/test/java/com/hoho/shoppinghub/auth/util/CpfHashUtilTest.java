package com.hoho.shoppinghub.auth.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CpfHashUtilTest {

    private static final String DEV_PEPPER = "pepper_desenvolvimento_local_lgpd";

    @Test
    void hashMatchesKnownVector() {
        CpfHashUtil util = new CpfHashUtil(DEV_PEPPER);
        assertThat(util.hash("12345678901"))
                .isEqualTo("207dadae0ae4a8474ade03c87c647b363994bf78a902be3537bedd0b30226dc6");
    }

    @Test
    void hashChangesWhenPepperChanges() {
        CpfHashUtil a = new CpfHashUtil(DEV_PEPPER);
        CpfHashUtil b = new CpfHashUtil("outro_pepper_diferente_para_teste");
        assertThat(a.hash("12345678901")).isNotEqualTo(b.hash("12345678901"));
    }

    @Test
    void digestIs64LowercaseHexChars() {
        CpfHashUtil util = new CpfHashUtil(DEV_PEPPER);
        String digest = util.hash("12345678901");
        assertThat(digest).hasSize(64).matches("[0-9a-f]{64}");
    }
}
