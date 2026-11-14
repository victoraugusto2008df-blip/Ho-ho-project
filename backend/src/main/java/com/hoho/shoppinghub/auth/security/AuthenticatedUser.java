package com.hoho.shoppinghub.auth.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticatedUser implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String role;
    private final UUID lojaId;
    private final UUID clienteId;

    public AuthenticatedUser(UUID id, String email, String password, String role, UUID lojaId, UUID clienteId) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.lojaId = lojaId;
        this.clienteId = clienteId;
    }

    public UUID getId() {
        return id;
    }

    public String getRole() {
        return role;
    }

    public UUID getLojaId() {
        return lojaId;
    }

    public UUID getClienteId() {
        return clienteId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
