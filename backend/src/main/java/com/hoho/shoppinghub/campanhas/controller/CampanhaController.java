package com.hoho.shoppinghub.campanhas.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.campanhas.dto.CampanhaRequest;
import com.hoho.shoppinghub.campanhas.dto.CampanhaResponse;
import com.hoho.shoppinghub.campanhas.service.CampanhaService;
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
public class CampanhaController {

    private final CampanhaService campanhaService;

    public CampanhaController(CampanhaService campanhaService) {
        this.campanhaService = campanhaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('LOJISTA')")
    public ResponseEntity<CampanhaResponse> criar(
            @Valid @RequestBody CampanhaRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {
        CampanhaResponse response = campanhaService.criarCampanha(user.getLojaId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
