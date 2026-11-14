package com.hoho.shoppinghub.fiscal.gateway;

import com.hoho.shoppinghub.fiscal.domain.ConsultaNotaFiscalGateway;
import com.hoho.shoppinghub.fiscal.domain.DadosNotaFiscalSefaz;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Adaptador determinístico de consulta à SEFAZ para MVP e demonstração.
 *
 * <p>Tabela de chaves determinísticas (chave -&gt; cenário):
 * <ul>
 *   <li>{@code 35261111111111000101650010000001010000000101}: Zara (CNPJ 11111111000101) — R$ 65,00 (2h atrás, válida)</li>
 *   <li>{@code 35261122222222000102650010000001020000000102}: Renner (CNPJ 22222222000102) — R$ 85,00 (1h atrás, válida; 65+85=150)</li>
 *   <li>{@code 35261155555555000105650010000001030000000103}: Fast Shop (CNPJ 55555555000105) — R$ 55,00 (4h atrás, válida)</li>
 *   <li>{@code 35261144444444000104650010000001040000000104}: Burger King (CNPJ 44444444000104) — R$ 95,00 (3h atrás, válida; 55+95=150)</li>
 *   <li>{@code 35261111111111000101650010000001050000000105}: Zara (CNPJ 11111111000101) — R$ 120,00 (96h atrás, ReN02 &gt; 72h)</li>
 *   <li>{@code 35261199999999000199650010000001060000000106}: Loja Externa (CNPJ 99999999000199) — R$ 75,00 (1h atrás, RF03 fora do shopping)</li>
 * </ul>
 */
@Component
public class MockSefazGateway implements ConsultaNotaFiscalGateway {

    public static final String CHAVE_ZARA_65 = "35261111111111000101650010000001010000000101";
    public static final String CHAVE_RENNER_85 = "35261122222222000102650010000001020000000102";
    public static final String CHAVE_FASTSHOP_55 = "35261155555555000105650010000001030000000103";
    public static final String CHAVE_BURGER_KING_95 = "35261144444444000104650010000001040000000104";
    public static final String CHAVE_EXPIRADA_96H = "35261111111111000101650010000001050000000105";
    public static final String CHAVE_CNPJ_EXTERNO = "35261199999999000199650010000001060000000106";

    private static final Pattern CHAVE_ACESSO_PATTERN = Pattern.compile("^\\d{44}$");

    private static final Map<String, NotaMockSpec> CATALOGO = Map.of(
            CHAVE_ZARA_65, new NotaMockSpec("11111111000101", new BigDecimal("65.00"), Duration.ofHours(2)),
            CHAVE_RENNER_85, new NotaMockSpec("22222222000102", new BigDecimal("85.00"), Duration.ofHours(1)),
            CHAVE_FASTSHOP_55, new NotaMockSpec("55555555000105", new BigDecimal("55.00"), Duration.ofHours(4)),
            CHAVE_BURGER_KING_95, new NotaMockSpec("44444444000104", new BigDecimal("95.00"), Duration.ofHours(3)),
            CHAVE_EXPIRADA_96H, new NotaMockSpec("11111111000101", new BigDecimal("120.00"), Duration.ofHours(96)),
            CHAVE_CNPJ_EXTERNO, new NotaMockSpec("99999999000199", new BigDecimal("75.00"), Duration.ofHours(1))
    );

    private final Clock clock;

    public MockSefazGateway(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock deve ser informado");
    }

    @Override
    public Optional<DadosNotaFiscalSefaz> consultarPorChave(String chaveAcesso) {
        if (chaveAcesso == null || !CHAVE_ACESSO_PATTERN.matcher(chaveAcesso).matches()) {
            throw new IllegalArgumentException(
                    "Chave de acesso da NFC-e deve conter exatamente 44 dígitos numéricos.");
        }

        return Optional.ofNullable(CATALOGO.get(chaveAcesso))
                .map(spec -> new DadosNotaFiscalSefaz(
                        chaveAcesso,
                        spec.cnpjEmitente(),
                        spec.valorTotal(),
                        clock.instant().minus(spec.idadeEmissao())));
    }

    private record NotaMockSpec(String cnpjEmitente, BigDecimal valorTotal, Duration idadeEmissao) {
    }
}
