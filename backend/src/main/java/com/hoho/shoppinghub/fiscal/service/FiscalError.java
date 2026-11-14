package com.hoho.shoppinghub.fiscal.service;

import org.springframework.http.HttpStatus;

public enum FiscalError {

    NOTA_DUPLICADA("NOTA_DUPLICADA", HttpStatus.CONFLICT, "Esta nota fiscal já foi cadastrada."),
    NOTA_EXPIRADA_72H("NOTA_EXPIRADA_72H", HttpStatus.UNPROCESSABLE_ENTITY, "Nota emitida há mais de 72 horas."),
    LOJA_NAO_CREDENCIADA("LOJA_NAO_CREDENCIADA", HttpStatus.UNPROCESSABLE_ENTITY, "Loja não credenciada no shopping."),
    CHAVE_NAO_ENCONTRADA("CHAVE_NAO_ENCONTRADA", HttpStatus.NOT_FOUND, "Chave não localizada na SEFAZ."),
    CHAVE_INVALIDA("CHAVE_INVALIDA", HttpStatus.BAD_REQUEST, "Chave de acesso deve conter 44 dígitos numéricos.");

    private final String code;
    private final HttpStatus status;
    private final String message;

    FiscalError(String code, HttpStatus status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    public String code() {
        return code;
    }

    public HttpStatus status() {
        return status;
    }

    public String message() {
        return message;
    }
}
