package com.hoho.shoppinghub.auth.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private static final String SECRET = "chave_desenvolvimento_local_com_pelo_menos_32_bytes_seguros";
    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");

    private final JwtService jwtService = new JwtService(SECRET, 86400000L);

    @Test
    void tokenCarriesRoleLojaIdClienteIdClaims() {
        AuthenticatedUser consumidor =
                new AuthenticatedUser(null, "consumidor@shopping.com", null, "CONSUMIDOR", null, CLIENTE_ID);
        Claims consumidorClaims = parse(jwtService.generateToken(consumidor));

        assertThat(consumidorClaims.get("role", String.class)).isEqualTo("CONSUMIDOR");
        assertThat(consumidorClaims.get("clienteId", String.class)).isEqualTo(CLIENTE_ID.toString());
        assertThat(consumidorClaims.containsKey("tipo")).isFalse();
        assertThat(consumidorClaims.containsKey("tenantId")).isFalse();

        AuthenticatedUser lojista =
                new AuthenticatedUser(null, "lojista@shopping.com", null, "LOJISTA", LOJA_ID, null);
        Claims lojistaClaims = parse(jwtService.generateToken(lojista));

        assertThat(lojistaClaims.get("role", String.class)).isEqualTo("LOJISTA");
        assertThat(lojistaClaims.get("lojaId", String.class)).isEqualTo(LOJA_ID.toString());
    }

    private static Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
