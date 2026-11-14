package com.hoho.shoppinghub.analytics.controller;

import com.hoho.shoppinghub.analytics.dto.ShoppingDashboardResponse;
import com.hoho.shoppinghub.analytics.service.ShoppingAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics/shopping")
@Tag(name = "Analytics", description = "Painéis agregados, com K-Anonymity (ReN05)")
public class ShoppingAnalyticsController {

    private final ShoppingAnalyticsService shoppingAnalyticsService;

    public ShoppingAnalyticsController(ShoppingAnalyticsService shoppingAnalyticsService) {
        this.shoppingAnalyticsService = shoppingAnalyticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN_SHOPPING')")
    @Operation(summary = "Visão do shopping: faturamento, vouchers, campanhas e distribuição por categoria")
    public ShoppingDashboardResponse dashboard() {
        return shoppingAnalyticsService.montarDashboard();
    }
}
