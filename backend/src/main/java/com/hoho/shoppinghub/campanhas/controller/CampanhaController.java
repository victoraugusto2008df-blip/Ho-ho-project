package com.hoho.shoppinghub.campanhas.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.campanhas.dto.CampanhaRequest;
import com.hoho.shoppinghub.campanhas.dto.CampanhaResponse;
import com.hoho.shoppinghub.campanhas.service.CampanhaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/campanhas")
@Tag(name = "Campanhas", description = "Disparo simulado de cupom pelo lojista, sem expor CPFs")
public class CampanhaController {

    private final CampanhaService campanhaService;

    public CampanhaController(CampanhaService campanhaService) {
        this.campanhaService = campanhaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('LOJISTA')")
    @Operation(summary = "Dispara uma campanha para os clientes da loja do token inativos há mais de 60 dias")
    public ResponseEntity<CampanhaResponse> disparar(
            @Valid @RequestBody CampanhaRequest pedido,
            @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campanhaService.disparar(user.getLojaId(), pedido));
    }
}
