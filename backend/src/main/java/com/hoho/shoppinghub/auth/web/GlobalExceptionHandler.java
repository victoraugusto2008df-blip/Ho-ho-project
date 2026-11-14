package com.hoho.shoppinghub.auth.web;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> fields = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> Map.of("field", fieldError.getField(), "message", fieldError.getDefaultMessage()))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "validation_error");
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }
}
