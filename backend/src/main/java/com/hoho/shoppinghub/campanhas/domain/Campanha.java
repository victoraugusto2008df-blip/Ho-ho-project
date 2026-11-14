package com.hoho.shoppinghub.campanhas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "campanhas")
public class Campanha {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "loja_id", nullable = false)
    private UUID lojaId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "desconto_percentual", nullable = false)
    private int descontoPercentual;

    @Column(name = "criterio_alvo", nullable = false, length = 100)
    private String criterioAlvo;

    @Column(name = "publico_atingido", nullable = false)
    private int publicoAtingido;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm;

    protected Campanha() {
    }

    public Campanha(
            UUID lojaId,
            String titulo,
            int descontoPercentual,
            String criterioAlvo,
            int publicoAtingido) {
        this.lojaId = lojaId;
        this.titulo = titulo;
        this.descontoPercentual = descontoPercentual;
        this.criterioAlvo = criterioAlvo;
        this.publicoAtingido = publicoAtingido;
        this.criadoEm = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getLojaId() {
        return lojaId;
    }

    public String getTitulo() {
        return titulo;
    }

    public int getDescontoPercentual() {
        return descontoPercentual;
    }

    public String getCriterioAlvo() {
        return criterioAlvo;
    }

    public int getPublicoAtingido() {
        return publicoAtingido;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }
}
