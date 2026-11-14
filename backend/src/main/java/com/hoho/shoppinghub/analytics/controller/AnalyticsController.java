package com.hoho.shoppinghub.analytics.controller;

import com.hoho.shoppinghub.analytics.dto.DashboardResponse;
import com.hoho.shoppinghub.analytics.service.AnalyticsService;
import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics/lojista")
@Tag(name = "Analytics", description = "Painéis agregados, com K-Anonymity (ReN05)")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Painel da loja do token: ticket médio, benchmarking, picos e compras cruzadas")
    @PreAuthorize("hasRole('LOJISTA')")
    public DashboardResponse dashboard(@AuthenticationPrincipal AuthenticatedUser user) {
        return analyticsService.montarDashboard(user.getLojaId());
    }
}
