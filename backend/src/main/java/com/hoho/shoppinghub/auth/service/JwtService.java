package com.hoho.shoppinghub.auth.service;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(AuthenticatedUser user) {
        Date now = new Date();
        JwtBuilder builder = Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs));
        if (user.getLojaId() != null) {
            builder = builder.claim("lojaId", user.getLojaId().toString());
        }
        if (user.getClienteId() != null) {
            builder = builder.claim("clienteId", user.getClienteId().toString());
        }
        return builder.signWith(key).compact();
    }

    public AuthenticatedUser parseToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        String role = claims.get("role", String.class);
        String lojaId = claims.get("lojaId", String.class);
        String clienteId = claims.get("clienteId", String.class);
        return new AuthenticatedUser(
                null,
                claims.getSubject(),
                null,
                role,
                lojaId != null ? UUID.fromString(lojaId) : null,
                clienteId != null ? UUID.fromString(clienteId) : null);
    }
}
