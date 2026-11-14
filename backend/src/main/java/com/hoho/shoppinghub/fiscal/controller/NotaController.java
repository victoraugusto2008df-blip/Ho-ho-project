package com.hoho.shoppinghub.fiscal.controller;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import com.hoho.shoppinghub.fiscal.dto.NotaRequest;
import com.hoho.shoppinghub.fiscal.dto.NotaResponse;
import com.hoho.shoppinghub.fiscal.repository.NotaConsultaRepository;
import com.hoho.shoppinghub.fiscal.service.FiscalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notas")
@Tag(name = "Notas fiscais", description = "Cadastro de NFC-e pelo consumidor (ReN01, ReN02, RF03)")
public class NotaController {

    private final FiscalService fiscalService;
    private final NotaConsultaRepository notaConsultaRepository;

    public NotaController(FiscalService fiscalService, NotaConsultaRepository notaConsultaRepository) {
        this.fiscalService = fiscalService;
        this.notaConsultaRepository = notaConsultaRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CONSUMIDOR')")
    @Operation(summary = "Cadastra uma nota pela chave de acesso de 44 dígitos")
    public ResponseEntity<NotaResponse> ingerir(
            @RequestBody NotaRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {
        NotaFiscal nota = fiscalService.ingerir(request.chaveAcesso(), user.getClienteId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notaConsultaRepository.porChave(nota.getChaveAcesso()));
    }

    @GetMapping("/hoje")
    @PreAuthorize("hasRole('CONSUMIDOR')")
    @Operation(summary = "Lista as notas aprovadas do consumidor emitidas hoje")
    public List<NotaResponse> notasDeHoje(@AuthenticationPrincipal AuthenticatedUser user) {
        Instant[] janela = fiscalService.janelaDeHoje();
        return notaConsultaRepository.aprovadasDoCliente(user.getClienteId(), janela[0], janela[1]);
    }
}
