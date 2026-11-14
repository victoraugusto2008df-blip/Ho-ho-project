package com.hoho.shoppinghub.auth.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.security.TenantScopedService;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Demo-only probe routes that stand in for the real tenant-scoped endpoints owned by ORD-08/09/10.
 * They exist solely so the RBAC and multi-tenant guarantees of this feature can be exercised before
 * those modules land. Remove once the real routes are wired to the same guards.
 */
@RestController
@RequestMapping("/api/v1/auth/probe")
public class ProbeController {

    private final TenantScopedService tenantScopedService;

    public ProbeController(TenantScopedService tenantScopedService) {
        this.tenantScopedService = tenantScopedService;
    }

    @GetMapping("/lojista")
    @PreAuthorize("hasRole('LOJISTA')")
    public Map<String, Object> lojistaOnly(@AuthenticationPrincipal AuthenticatedUser user) {
        return Map.of("role", user.getRole(), "lojaId", String.valueOf(user.getLojaId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN_SHOPPING')")
    public Map<String, Object> adminOnly(@AuthenticationPrincipal AuthenticatedUser user) {
        return Map.of("role", user.getRole());
    }

    @GetMapping("/loja/{lojaId}")
    public Map<String, Object> tenantScoped(@PathVariable UUID lojaId) {
        return Map.of("lojaId", tenantScopedService.tenantInfo(lojaId));
    }

    @GetMapping("/tenant")
    @PreAuthorize("hasRole('LOJISTA')")
    public Map<String, Object> currentTenant(@AuthenticationPrincipal AuthenticatedUser user) {
        return Map.of("lojaId", String.valueOf(user.getLojaId()));
    }
}
