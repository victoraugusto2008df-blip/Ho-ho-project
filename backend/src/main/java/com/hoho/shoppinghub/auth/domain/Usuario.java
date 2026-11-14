package com.hoho.shoppinghub.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private String role;

    @Column(name = "cliente_id")
    private UUID clienteId;

    @Column(name = "loja_id")
    private UUID lojaId;

    protected Usuario() {
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public String getRole() {
        return role;
    }

    public UUID getClienteId() {
        return clienteId;
    }

    public UUID getLojaId() {
        return lojaId;
    }
}
