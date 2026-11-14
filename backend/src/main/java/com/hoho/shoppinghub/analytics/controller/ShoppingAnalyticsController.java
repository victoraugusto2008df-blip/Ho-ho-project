package com.hoho.shoppinghub.analytics.controller;

import com.hoho.shoppinghub.analytics.dto.ShoppingDashboardResponse;
import com.hoho.shoppinghub.analytics.service.ShoppingAnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics/shopping")
public class ShoppingAnalyticsController {

    private final ShoppingAnalyticsService shoppingAnalyticsService;

    public ShoppingAnalyticsController(ShoppingAnalyticsService shoppingAnalyticsService) {
        this.shoppingAnalyticsService = shoppingAnalyticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN_SHOPPING')")
    public ShoppingDashboardResponse dashboard() {
        return shoppingAnalyticsService.montarDashboard();
    }
}
