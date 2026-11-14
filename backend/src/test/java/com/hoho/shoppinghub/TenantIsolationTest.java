package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.security.TenantScopedService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class TenantIsolationTest {

    private static final UUID STORE_A = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID STORE_B = UUID.fromString("22222222-2222-2222-2222-222222222202");

    @Autowired
    private TenantScopedService tenantScopedService;

    @Test
    void principalLojaIdGuardRejectsMismatchedLojaId() {
        AuthenticatedUser principal =
                new AuthenticatedUser(null, "lojista@shopping.com", null, "LOJISTA", STORE_A, null);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            assertThat(tenantScopedService.tenantInfo(STORE_A)).isEqualTo(STORE_A.toString());
            assertThatThrownBy(() -> tenantScopedService.tenantInfo(STORE_B))
                    .isInstanceOf(AccessDeniedException.class);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
