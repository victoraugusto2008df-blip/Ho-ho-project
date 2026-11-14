package com.hoho.shoppinghub.fiscal.service;

import com.hoho.shoppinghub.fiscal.domain.ConsultaNotaFiscalGateway;
import com.hoho.shoppinghub.fiscal.domain.DadosNotaFiscalSefaz;
import com.hoho.shoppinghub.fiscal.domain.Loja;
import com.hoho.shoppinghub.fiscal.domain.LojaRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FiscalService {

    private final ConsultaNotaFiscalGateway gateway;
    private final NotaFiscalRepository notaFiscalRepository;
    private final LojaRepository lojaRepository;
    private final ApplicationEventPublisher eventPublisher;

    public FiscalService(
            ConsultaNotaFiscalGateway gateway,
            NotaFiscalRepository notaFiscalRepository,
            LojaRepository lojaRepository,
            ApplicationEventPublisher eventPublisher) {
        this.gateway = gateway;
        this.notaFiscalRepository = notaFiscalRepository;
        this.lojaRepository = lojaRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public NotaFiscal ingerir(String chaveAcesso, UUID clienteId) {
        DadosNotaFiscalSefaz dados;
        try {
            dados = gateway.consultarPorChave(chaveAcesso)
                    .orElseThrow(() -> new FiscalBusinessException(FiscalError.CHAVE_NAO_ENCONTRADA));
        } catch (IllegalArgumentException e) {
            throw new FiscalBusinessException(FiscalError.CHAVE_INVALIDA);
        }

        if (dados.dataEmissao().isBefore(Instant.now().minus(Duration.ofHours(72)))) {
            throw new FiscalBusinessException(FiscalError.NOTA_EXPIRADA_72H);
        }

        Loja loja = lojaRepository.findByCnpj(dados.cnpjEmitente())
                .filter(Loja::isAtiva)
                .orElseThrow(() -> new FiscalBusinessException(FiscalError.LOJA_NAO_CREDENCIADA));

        NotaFiscal nota = new NotaFiscal(dados.chaveAcesso(), clienteId, loja.getId(), dados.valorTotal(), dados.dataEmissao());
        try {
            nota = notaFiscalRepository.saveAndFlush(nota);
        } catch (DataIntegrityViolationException e) {
            throw new FiscalBusinessException(FiscalError.NOTA_DUPLICADA);
        }

        eventPublisher.publishEvent(new NotaFiscalValidadaEvent(
                nota.getId(),
                nota.getChaveAcesso(),
                nota.getClienteId(),
                nota.getLojaId(),
                nota.getValorTotal(),
                nota.getDataEmissao()));
        return nota;
    }
}
