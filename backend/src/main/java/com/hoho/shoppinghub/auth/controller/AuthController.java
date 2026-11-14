package com.hoho.shoppinghub.auth.controller;

import com.hoho.shoppinghub.auth.dto.LoginRequest;
import com.hoho.shoppinghub.auth.dto.LoginResponse;
import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
            AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(token, user.getRole(), user.getLojaId(), user.getClienteId()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
