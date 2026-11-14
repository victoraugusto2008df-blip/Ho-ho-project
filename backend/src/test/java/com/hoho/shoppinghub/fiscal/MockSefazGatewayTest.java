package com.hoho.shoppinghub.fiscal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.hoho.shoppinghub.fiscal.domain.ConsultaNotaFiscalGateway;
import com.hoho.shoppinghub.fiscal.domain.DadosNotaFiscalSefaz;
import com.hoho.shoppinghub.fiscal.gateway.MockSefazGateway;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MockSefazGatewayTest {

    private static final Instant FIXED_NOW = Instant.parse("2026-11-14T15:00:00Z");
    private static final Clock FIXED_CLOCK = Clock.fixed(FIXED_NOW, ZoneOffset.UTC);

    private static final Set<String> SEEDED_SHOPPING_CNPJS = Set.of(
            "11111111000101",
            "22222222000102",
            "33333333000103",
            "44444444000104",
            "55555555000105");

    private final ConsultaNotaFiscalGateway gateway = new MockSefazGateway(FIXED_CLOCK);

    @Test
    void domainContractIsIsolatedFromGatewayImplementation() throws NoSuchMethodException {
        assertThat(ConsultaNotaFiscalGateway.class.isInterface()).isTrue();
        assertThat(ConsultaNotaFiscalGateway.class.getPackageName())
                .isEqualTo("com.hoho.shoppinghub.fiscal.domain");
        assertThat(DadosNotaFiscalSefaz.class.isRecord()).isTrue();
        assertThat(DadosNotaFiscalSefaz.class.getPackageName())
                .isEqualTo("com.hoho.shoppinghub.fiscal.domain");

        Method method = ConsultaNotaFiscalGateway.class.getMethod("consultarPorChave", String.class);
        assertThat(method.getReturnType()).isEqualTo(Optional.class);
        assertThat(MockSefazGateway.class.getPackageName())
                .isEqualTo("com.hoho.shoppinghub.fiscal.gateway");
        assertThat(ConsultaNotaFiscalGateway.class.isAssignableFrom(MockSefazGateway.class)).isTrue();
    }

    @Test
    void invalidChaveAcessoThrowsIllegalArgumentException() {
        assertThatThrownBy(() -> gateway.consultarPorChave(null))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> gateway.consultarPorChave("   "))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> gateway.consultarPorChave("1234567890"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> gateway.consultarPorChave("3526111111111100010165001000000101000000010A"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void accreditedStoreReceiptReturnsValidDataWithinWindow() {
        DadosNotaFiscalSefaz nota = gateway.consultarPorChave(MockSefazGateway.CHAVE_ZARA_65)
                .orElseThrow();

        assertThat(nota.chaveAcesso()).isEqualTo(MockSefazGateway.CHAVE_ZARA_65);
        assertThat(SEEDED_SHOPPING_CNPJS).contains(nota.cnpjEmitente());
        assertThat(nota.valorTotal()).isEqualByComparingTo("65.00");
        assertThat(Duration.between(nota.dataEmissao(), FIXED_NOW)).isLessThan(Duration.ofHours(72));
    }

    @Test
    void demoKeyPairsSumExactlyToVoucherThreshold() {
        BigDecimal par1 = gateway.consultarPorChave(MockSefazGateway.CHAVE_ZARA_65).orElseThrow().valorTotal()
                .add(gateway.consultarPorChave(MockSefazGateway.CHAVE_RENNER_85).orElseThrow().valorTotal());

        BigDecimal par2 = gateway.consultarPorChave(MockSefazGateway.CHAVE_FASTSHOP_55).orElseThrow().valorTotal()
                .add(gateway.consultarPorChave(MockSefazGateway.CHAVE_BURGER_KING_95).orElseThrow().valorTotal());

        assertThat(par1).isEqualByComparingTo("150.00");
        assertThat(par2).isEqualByComparingTo("150.00");
    }

    @Test
    void expiredReceiptReturnsTimestampOlderThan72Hours() {
        DadosNotaFiscalSefaz notaExpirada = gateway.consultarPorChave(MockSefazGateway.CHAVE_EXPIRADA_96H)
                .orElseThrow();

        assertThat(SEEDED_SHOPPING_CNPJS).contains(notaExpirada.cnpjEmitente());
        assertThat(Duration.between(notaExpirada.dataEmissao(), FIXED_NOW)).isGreaterThan(Duration.ofHours(72));
    }

    @Test
    void unaccreditedStoreReceiptReturnsExternalCnpj() {
        DadosNotaFiscalSefaz notaExterna = gateway.consultarPorChave(MockSefazGateway.CHAVE_CNPJ_EXTERNO)
                .orElseThrow();

        assertThat(SEEDED_SHOPPING_CNPJS).doesNotContain(notaExterna.cnpjEmitente());
        assertThat(notaExterna.cnpjEmitente()).isEqualTo("99999999000199");
        assertThat(notaExterna.valorTotal()).isPositive();
    }

    @Test
    void unknownValidKeyReturnsEmpty() {
        Optional<DadosNotaFiscalSefaz> resultado =
                gateway.consultarPorChave("35261100000000000000650010000009990000000999");

        assertThat(resultado).isEmpty();
    }
}
