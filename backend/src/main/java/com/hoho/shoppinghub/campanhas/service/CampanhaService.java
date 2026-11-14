package com.hoho.shoppinghub.campanhas.service;

import com.hoho.shoppinghub.campanhas.dto.CampanhaRequest;
import com.hoho.shoppinghub.campanhas.dto.CampanhaResponse;
import com.hoho.shoppinghub.campanhas.repository.CampanhaRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CampanhaService {

    static final Duration INATIVIDADE = Duration.ofDays(60);

    private final CampanhaRepository repository;
    private final Clock clock;

    public CampanhaService(CampanhaRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    /** Conta o público de forma anônima (só o total sai daqui) e grava a campanha na loja dada. */
    @Transactional
    public CampanhaResponse disparar(UUID lojaId, CampanhaRequest pedido) {
        Instant corte = clock.instant().minus(INATIVIDADE);
        int publico = repository.clientesComUltimaCompraAntesDe(lojaId, corte);
        return repository.salvar(lojaId, pedido, publico);
    }
}
