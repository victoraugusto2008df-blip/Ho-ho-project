package com.hoho.shoppinghub.fiscal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "notas_fiscais")
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "chave_acesso", nullable = false, unique = true, length = 44)
    private String chaveAcesso;

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Column(name = "loja_id", nullable = false)
    private UUID lojaId;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "data_emissao", nullable = false)
    private Instant dataEmissao;

    @Column(nullable = false)
    private String status;

    protected NotaFiscal() {
    }

    public NotaFiscal(String chaveAcesso, UUID clienteId, UUID lojaId, BigDecimal valorTotal, Instant dataEmissao) {
        this.chaveAcesso = chaveAcesso;
        this.clienteId = clienteId;
        this.lojaId = lojaId;
        this.valorTotal = valorTotal;
        this.dataEmissao = dataEmissao;
        this.status = "APROVADA";
    }

    public UUID getId() {
        return id;
    }

    public String getChaveAcesso() {
        return chaveAcesso;
    }

    public UUID getClienteId() {
        return clienteId;
    }

    public UUID getLojaId() {
        return lojaId;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public Instant getDataEmissao() {
        return dataEmissao;
    }

    public String getStatus() {
        return status;
    }
}
