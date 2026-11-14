package com.hoho.shoppinghub.fiscal.service;

public class FiscalBusinessException extends RuntimeException {

    private final FiscalError error;

    public FiscalBusinessException(FiscalError error) {
        super(error.message());
        this.error = error;
    }

    public FiscalError getError() {
        return error;
    }
}
