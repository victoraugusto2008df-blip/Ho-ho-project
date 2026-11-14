package com.hoho.shoppinghub.beneficios.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "vouchers_estacionamento",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_voucher_cliente_data",
                columnNames = {"cliente_id", "data_referencia"}))
public class VoucherEstacionamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Column(name = "data_referencia", nullable = false)
    private LocalDate dataReferencia;

    @Column(name = "valor_acumulado", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorAcumulado;

    @Column(name = "codigo_qr", nullable = false, unique = true, length = 100)
    private String codigoQr;

    @Column(nullable = false, length = 20)
    private String status;

    /** Preenchido pelo banco (`DEFAULT CURRENT_TIMESTAMP`); nulo até a entidade ser relida. */
    @Column(name = "criado_em", insertable = false, updatable = false)
    private Instant criadoEm;

    protected VoucherEstacionamento() {
    }

    public VoucherEstacionamento(
            UUID clienteId,
            LocalDate dataReferencia,
            BigDecimal valorAcumulado,
            String codigoQr) {
        this.clienteId = clienteId;
        this.dataReferencia = dataReferencia;
        this.valorAcumulado = valorAcumulado;
        this.codigoQr = codigoQr;
        this.status = "LIBERADO";
    }

    public UUID getId() {
        return id;
    }

    public UUID getClienteId() {
        return clienteId;
    }

    public LocalDate getDataReferencia() {
        return dataReferencia;
    }

    public BigDecimal getValorAcumulado() {
        return valorAcumulado;
    }

    public String getCodigoQr() {
        return codigoQr;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }
}
