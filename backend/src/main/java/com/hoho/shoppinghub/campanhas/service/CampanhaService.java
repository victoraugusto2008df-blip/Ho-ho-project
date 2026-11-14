package com.hoho.shoppinghub.campanhas.service;

import com.hoho.shoppinghub.campanhas.domain.Campanha;
import com.hoho.shoppinghub.campanhas.domain.CampanhaRepository;
import com.hoho.shoppinghub.campanhas.dto.CampanhaRequest;
import com.hoho.shoppinghub.campanhas.dto.CampanhaResponse;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import java.math.BigDecimal;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CampanhaService {

    private static final BigDecimal TICKET_ALTO_MINIMO = new BigDecimal("200.00");

    private final CampanhaRepository campanhaRepository;
    private final NotaFiscalRepository notaFiscalRepository;

    public CampanhaService(
            CampanhaRepository campanhaRepository,
            NotaFiscalRepository notaFiscalRepository) {
        this.campanhaRepository = campanhaRepository;
        this.notaFiscalRepository = notaFiscalRepository;
    }

    @Transactional
    public CampanhaResponse criarCampanha(UUID lojaId, CampanhaRequest request) {
        String criterioNormalizado = request.criterioAlvo().trim();
        int publicoAtingido = calcularPublicoElegivel(lojaId, criterioNormalizado);

        Campanha campanha = new Campanha(
                lojaId,
                request.titulo().trim(),
                request.descontoPercentual(),
                criterioNormalizado,
                publicoAtingido);

        return CampanhaResponse.from(campanhaRepository.save(campanha));
    }

    private int calcularPublicoElegivel(UUID lojaId, String criterioAlvo) {
        long contagem = switch (criterioAlvo.toUpperCase(Locale.ROOT)) {
            case "TICKET_ALTO" -> notaFiscalRepository.countClientesTicketAltoPorLoja(lojaId, TICKET_ALTO_MINIMO);
            case "RECORRENTES" -> notaFiscalRepository.countClientesRecorrentesPorLoja(lojaId);
            default -> notaFiscalRepository.countClientesDistintosAprovadosPorLoja(lojaId);
        };
        return Math.toIntExact(contagem);
    }
}
