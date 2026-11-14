package com.hoho.shoppinghub.fiscal.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import com.hoho.shoppinghub.fiscal.dto.NotaRequest;
import com.hoho.shoppinghub.fiscal.dto.NotaResponse;
import com.hoho.shoppinghub.fiscal.service.FiscalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notas")
public class NotaController {

    private final FiscalService fiscalService;

    public NotaController(FiscalService fiscalService) {
        this.fiscalService = fiscalService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CONSUMIDOR')")
    public ResponseEntity<NotaResponse> ingerir(
            @RequestBody NotaRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {
        NotaFiscal nota = fiscalService.ingerir(request.chaveAcesso(), user.getClienteId());
        return ResponseEntity.status(HttpStatus.CREATED).body(NotaResponse.from(nota));
    }
}
