package com.hoho.shoppinghub.fiscal.web;

import com.hoho.shoppinghub.fiscal.service.FiscalBusinessException;
import com.hoho.shoppinghub.fiscal.service.FiscalError;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class FiscalExceptionHandler {

    @ExceptionHandler(FiscalBusinessException.class)
    public ResponseEntity<Map<String, String>> handle(FiscalBusinessException ex) {
        FiscalError error = ex.getError();
        Map<String, String> body = new LinkedHashMap<>();
        body.put("code", error.code());
        body.put("message", error.message());
        return ResponseEntity.status(error.status()).body(body);
    }
}
