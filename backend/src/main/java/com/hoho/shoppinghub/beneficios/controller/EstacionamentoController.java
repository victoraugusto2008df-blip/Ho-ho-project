package com.hoho.shoppinghub.beneficios.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.beneficios.dto.EstacionamentoHojeResponse;
import com.hoho.shoppinghub.beneficios.service.EstacionamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/beneficios/estacionamento")
public class EstacionamentoController {

    private final EstacionamentoService estacionamentoService;

    public EstacionamentoController(EstacionamentoService estacionamentoService) {
        this.estacionamentoService = estacionamentoService;
    }

    @GetMapping("/hoje")
    @PreAuthorize("hasRole('CONSUMIDOR')")
    public ResponseEntity<EstacionamentoHojeResponse> consultarHoje(
            @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(estacionamentoService.consultarHoje(user.getClienteId()));
    }
}
