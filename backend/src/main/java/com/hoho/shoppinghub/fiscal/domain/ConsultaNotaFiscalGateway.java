package com.hoho.shoppinghub.fiscal.domain;

import java.util.Optional;

/**
 * Porta de saída do domínio fiscal para consulta de NFC-e (Dependency Inversion Principle).
 */
public interface ConsultaNotaFiscalGateway {

    /**
     * Consulta os dados fiscais de uma NFC-e pela chave de acesso de 44 dígitos.
     *
     * @param chaveAcesso chave numérica de 44 dígitos da NFC-e
     * @return dados da nota quando encontrada, ou vazio caso não exista
     * @throws IllegalArgumentException quando a chave for nula ou não tiver 44 dígitos numéricos
     */
    Optional<DadosNotaFiscalSefaz> consultarPorChave(String chaveAcesso);
}
