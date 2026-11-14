package com.hoho.shoppinghub.beneficios.service;

import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamento;
import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamentoRepository;
import com.hoho.shoppinghub.beneficios.dto.EstacionamentoHojeResponse;
import com.hoho.shoppinghub.beneficios.dto.EstacionamentoHojeResponse.VoucherResponse;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstacionamentoService {

    public static final BigDecimal META_ESTACIONAMENTO = new BigDecimal("150.00");

    private final NotaFiscalRepository notaFiscalRepository;
    private final VoucherEstacionamentoRepository voucherRepository;
    private final Clock clock;

    public EstacionamentoService(
            NotaFiscalRepository notaFiscalRepository,
            VoucherEstacionamentoRepository voucherRepository,
            Clock clock) {
        this.notaFiscalRepository = notaFiscalRepository;
        this.voucherRepository = voucherRepository;
        this.clock = clock;
    }

    @EventListener
    @Transactional
    public void onNotaFiscalValidada(NotaFiscalValidadaEvent event) {
        LocalDate hoje = LocalDate.now(clock);
        BigDecimal valorAcumuladoHoje = somarAprovadoNoDia(event.clienteId(), hoje);

        if (valorAcumuladoHoje.compareTo(META_ESTACIONAMENTO) < 0) {
            return;
        }
        if (voucherRepository.existsByClienteIdAndDataReferencia(event.clienteId(), hoje)) {
            return;
        }

        VoucherEstacionamento novoVoucher = new VoucherEstacionamento(
                event.clienteId(),
                hoje,
                valorAcumuladoHoje,
                gerarCodigoQr(hoje));

        try {
            voucherRepository.saveAndFlush(novoVoucher);
        } catch (DataIntegrityViolationException ignored) {
            // Garante idempotência caso uma requisição concorrente já tenha gravado o voucher do dia (ReN04).
        }
    }

    @Transactional(readOnly = true)
    public EstacionamentoHojeResponse consultarHoje(UUID clienteId) {
        LocalDate hoje = LocalDate.now(clock);
        BigDecimal valorAcumulado = somarAprovadoNoDia(clienteId, hoje).setScale(2, RoundingMode.HALF_UP);
        int percentual = Math.min(
                100,
                valorAcumulado
                        .multiply(BigDecimal.valueOf(100))
                        .divide(META_ESTACIONAMENTO, 0, RoundingMode.DOWN)
                        .intValue());
        BigDecimal valorFaltante = META_ESTACIONAMENTO
                .subtract(valorAcumulado)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        Optional<VoucherEstacionamento> voucher =
                voucherRepository.findByClienteIdAndDataReferencia(clienteId, hoje);

        return new EstacionamentoHojeResponse(
                valorAcumulado,
                META_ESTACIONAMENTO,
                percentual,
                valorFaltante,
                voucher.isPresent(),
                voucherRepository.cpfMascaradoDoCliente(clienteId),
                voucher.map(VoucherResponse::from).orElse(null));
    }

    private BigDecimal somarAprovadoNoDia(UUID clienteId, LocalDate dia) {
        ZoneId zone = clock.getZone();
        Instant inicioDia = dia.atStartOfDay(zone).toInstant();
        Instant fimDia = dia.plusDays(1).atStartOfDay(zone).toInstant();
        return notaFiscalRepository.sumValorAprovadoNoDia(clienteId, inicioDia, fimDia);
    }

    private static String gerarCodigoQr(LocalDate dataReferencia) {
        String sufixo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "HOHO-PARK-" + dataReferencia + "-" + sufixo;
    }
}
