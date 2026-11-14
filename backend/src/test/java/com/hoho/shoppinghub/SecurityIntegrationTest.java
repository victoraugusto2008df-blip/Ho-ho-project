package com.hoho.shoppinghub;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    private static final UUID STORE_A = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID STORE_B = UUID.fromString("22222222-2222-2222-2222-222222222202");
    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Value("${app.security.jwt.secret}")
    private String jwtSecret;

    @Test
    void protectedRouteWithoutOrWithInvalidTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/probe/lojista")).andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/auth/probe/lojista").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());

        String expired = Jwts.builder()
                .subject("probe@shopping.com")
                .claim("role", "LOJISTA")
                .claim("lojaId", STORE_A.toString())
                .issuedAt(new Date(System.currentTimeMillis() - 2L * 86400000L))
                .expiration(new Date(System.currentTimeMillis() - 86400000L))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .compact();
        mockMvc.perform(get("/api/v1/auth/probe/lojista").header("Authorization", "Bearer " + expired))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void lojistaRouteWithConsumidorTokenReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/auth/probe/lojista")
                        .header("Authorization", "Bearer " + token("CONSUMIDOR", null, CLIENTE_ID)))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminRouteWithAdminTokenReturns200() throws Exception {
        mockMvc.perform(get("/api/v1/auth/probe/admin")
                        .header("Authorization", "Bearer " + token("ADMIN_SHOPPING", null, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN_SHOPPING"));
    }

    @Test
    void crossTenantAccessReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/auth/probe/loja/" + STORE_B)
                        .header("Authorization", "Bearer " + token("LOJISTA", STORE_A, null)))
                .andExpect(status().isForbidden());
    }

    @Test
    void requestSuppliedLojaIdIsNotTrusted() throws Exception {
        mockMvc.perform(get("/api/v1/auth/probe/tenant")
                        .param("lojaId", STORE_B.toString())
                        .header("Authorization", "Bearer " + token("LOJISTA", STORE_A, null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lojaId").value(STORE_A.toString()));
    }

    private String token(String role, UUID lojaId, UUID clienteId) {
        return jwtService.generateToken(
                new AuthenticatedUser(null, "probe@shopping.com", null, role, lojaId, clienteId));
    }
}
