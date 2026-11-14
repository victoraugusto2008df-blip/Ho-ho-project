package com.hoho.shoppinghub.auth.dto;

import java.util.UUID;

public record LoginResponse(String token, String role, UUID lojaId, UUID clienteId) {
}
