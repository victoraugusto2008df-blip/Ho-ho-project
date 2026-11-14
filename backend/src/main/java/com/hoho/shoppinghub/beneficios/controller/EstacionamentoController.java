package com.hoho.shoppinghub.beneficios.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.beneficios.dto.EstacionamentoHojeResponse;
import com.hoho.shoppinghub.beneficios.service.EstacionamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/beneficios/estacionamento")
@Tag(name = "Estacionamento", description = "Meta de R$ 150,00 no dia e voucher (ReN03, ReN04)")
public class EstacionamentoController {

    private final EstacionamentoService estacionamentoService;

    public EstacionamentoController(EstacionamentoService estacionamentoService) {
        this.estacionamentoService = estacionamentoService;
    }

    @GetMapping("/hoje")
    @Operation(summary = "Progresso do consumidor na meta de hoje e o voucher, se liberado")
    @PreAuthorize("hasRole('CONSUMIDOR')")
    public ResponseEntity<EstacionamentoHojeResponse> consultarHoje(
            @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(estacionamentoService.consultarHoje(user.getClienteId()));
    }
}
