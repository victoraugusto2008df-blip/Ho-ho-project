package com.hoho.shoppinghub.auth.security;

import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class TenantScopedService {

    @PreAuthorize("#lojaId == authentication.principal.lojaId")
    public String tenantInfo(UUID lojaId) {
        return lojaId.toString();
    }
}
