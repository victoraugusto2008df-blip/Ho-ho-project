package com.hoho.shoppinghub.beneficios.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamento;
import com.hoho.shoppinghub.beneficios.domain.VoucherEstacionamentoRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.dao.DataIntegrityViolationException;

/** ReN03 (meta de R$ 150,00 no mesmo dia) e ReN04 (1 voucher por CPF por dia), com o relógio fixado. */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EstacionamentoServiceRegrasTest {

    private static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");
    /** 14/11/2026 às 23:30 em São Paulo: em UTC já é dia 15, o que separa o fuso do relógio do UTC. */
    private static final Instant AGORA = Instant.parse("2026-11-15T02:30:00Z");
    private static final LocalDate HOJE = LocalDate.of(2026, 11, 14);
    private static final Instant INICIO_DO_DIA = Instant.parse("2026-11-14T03:00:00Z");
    private static final Instant FIM_DO_DIA = Instant.parse("2026-11-15T03:00:00Z");
    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");

    @Mock
    private NotaFiscalRepository notaFiscalRepository;

    @Mock
    private VoucherEstacionamentoRepository voucherRepository;

    private EstacionamentoService service;

    @BeforeEach
    void setUp() {
        service = new EstacionamentoService(notaFiscalRepository, voucherRepository, Clock.fixed(AGORA, ZONA));
    }

    private void somaDoDia(String valor) {
        when(notaFiscalRepository.sumValorAprovadoNoDia(any(), any(), any())).thenReturn(new BigDecimal(valor));
    }

    private static NotaFiscalValidadaEvent notaValidada() {
        return new NotaFiscalValidadaEvent(
                UUID.randomUUID(),
                "35261111111111000101650010000001010000000101",
                CLIENTE_ID,
                UUID.fromString("22222222-2222-2222-2222-222222222201"),
                new BigDecimal("65.00"),
                AGORA.minusSeconds(3600));
    }

    @Test
    void reachingTheGoalEmitsVoucherWithTheDailySum() {
        for (String soma : new String[] {"150.00", "160.00"}) {
            Mockito.clearInvocations(voucherRepository);
            somaDoDia(soma);

            service.onNotaFiscalValidada(notaValidada());

            ArgumentCaptor<VoucherEstacionamento> voucher = ArgumentCaptor.forClass(VoucherEstacionamento.class);
            verify(voucherRepository, times(1)).saveAndFlush(voucher.capture());
            assertThat(voucher.getValue().getClienteId()).isEqualTo(CLIENTE_ID);
            assertThat(voucher.getValue().getDataReferencia()).isEqualTo(HOJE);
            assertThat(voucher.getValue().getValorAcumulado()).isEqualByComparingTo(soma);
            assertThat(voucher.getValue().getStatus()).isEqualTo("LIBERADO");
        }
    }

    @Test
    void belowTheGoalEmitsNoVoucher() {
        for (String soma : new String[] {"149.99", "0.00"}) {
            somaDoDia(soma);

            service.onNotaFiscalValidada(notaValidada());
        }
        verify(voucherRepository, never()).saveAndFlush(any(VoucherEstacionamento.class));
    }

    @Test
    void sumIsRequestedForTheClientAndTheClockDayOnly() {
        somaDoDia("65.00");

        service.onNotaFiscalValidada(notaValidada());

        verify(notaFiscalRepository, times(1)).sumValorAprovadoNoDia(CLIENTE_ID, INICIO_DO_DIA, FIM_DO_DIA);
    }

    @Test
    void secondAttemptSameDayEmitsNoVoucher() {
        somaDoDia("230.00");
        when(voucherRepository.existsByClienteIdAndDataReferencia(CLIENTE_ID, HOJE)).thenReturn(true);

        service.onNotaFiscalValidada(notaValidada());

        verify(voucherRepository, never()).saveAndFlush(any(VoucherEstacionamento.class));
    }

    @Test
    void firstAttemptEmitsExactlyOneVoucherAndToleratesARace() {
        somaDoDia("150.00");
        when(voucherRepository.existsByClienteIdAndDataReferencia(CLIENTE_ID, HOJE)).thenReturn(false);

        service.onNotaFiscalValidada(notaValidada());

        verify(voucherRepository, times(1)).existsByClienteIdAndDataReferencia(eq(CLIENTE_ID), eq(HOJE));
        verify(voucherRepository, times(1)).saveAndFlush(any(VoucherEstacionamento.class));

        when(voucherRepository.saveAndFlush(any(VoucherEstacionamento.class)))
                .thenThrow(new DataIntegrityViolationException("uk_voucher_cliente_data"));

        assertThatCode(() -> service.onNotaFiscalValidada(notaValidada())).doesNotThrowAnyException();
    }
}
