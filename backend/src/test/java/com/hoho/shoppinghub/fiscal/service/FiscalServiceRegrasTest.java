package com.hoho.shoppinghub.fiscal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.fiscal.domain.ConsultaNotaFiscalGateway;
import com.hoho.shoppinghub.fiscal.domain.DadosNotaFiscalSefaz;
import com.hoho.shoppinghub.fiscal.domain.Loja;
import com.hoho.shoppinghub.fiscal.domain.LojaRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscal;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

/** ReN01 (chave duplicada) e ReN02 (nota emitida há mais de 72h), com o relógio fixado. */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class FiscalServiceRegrasTest {

    private static final Instant AGORA = Instant.parse("2026-11-14T18:00:00Z");
    private static final String CHAVE = "35261111111111000101650010000001010000000101";
    private static final String CNPJ = "11111111000101";
    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID LOJA_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final BigDecimal VALOR = new BigDecimal("65.00");

    @Mock
    private ConsultaNotaFiscalGateway gateway;

    @Mock
    private NotaFiscalRepository notaFiscalRepository;

    @Mock
    private LojaRepository lojaRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private FiscalService service;

    @BeforeEach
    void setUp() {
        Loja loja = mock(Loja.class);
        when(loja.isAtiva()).thenReturn(true);
        when(loja.getId()).thenReturn(LOJA_ID);
        when(lojaRepository.findByCnpj(CNPJ)).thenReturn(Optional.of(loja));
        when(notaFiscalRepository.saveAndFlush(any(NotaFiscal.class))).thenAnswer(call -> call.getArgument(0));
        service = new FiscalService(
                gateway,
                notaFiscalRepository,
                lojaRepository,
                eventPublisher,
                Clock.fixed(AGORA, ZoneId.of("America/Sao_Paulo")));
    }

    private void sefazDevolveNotaEmitidaHa(Duration idade) {
        when(gateway.consultarPorChave(CHAVE))
                .thenReturn(Optional.of(new DadosNotaFiscalSefaz(CHAVE, CNPJ, VALOR, AGORA.minus(idade))));
    }

    private FiscalBusinessException rejeicaoAoIngerir() {
        return catchThrowableOfType(FiscalBusinessException.class, () -> service.ingerir(CHAVE, CLIENTE_ID));
    }

    @Test
    void duplicateKeyIsRejectedWith409AndPublishesNothing() {
        sefazDevolveNotaEmitidaHa(Duration.ofHours(2));
        when(notaFiscalRepository.saveAndFlush(any(NotaFiscal.class)))
                .thenThrow(new DataIntegrityViolationException("uk_notas_fiscais_chave_acesso"));

        FiscalBusinessException rejeicao = rejeicaoAoIngerir();

        assertThat(rejeicao).isNotNull();
        assertThat(rejeicao.getError()).isEqualTo(FiscalError.NOTA_DUPLICADA);
        assertThat(rejeicao.getError().status()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(rejeicao.getError().status().value()).isEqualTo(409);
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void registeredKeyIsRejectedWithoutConsultingSefaz() {
        when(notaFiscalRepository.existsByChaveAcesso(CHAVE)).thenReturn(true);

        FiscalBusinessException rejeicao = rejeicaoAoIngerir();

        assertThat(rejeicao).isNotNull();
        assertThat(rejeicao.getError()).isEqualTo(FiscalError.NOTA_DUPLICADA);
        assertThat(rejeicao.getError().status().value()).isEqualTo(409);
        verify(gateway, never()).consultarPorChave(any());
        verify(notaFiscalRepository, never()).saveAndFlush(any(NotaFiscal.class));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void uniqueKeyIsPersistedAndPublishesOneEvent() {
        Instant emissao = AGORA.minus(Duration.ofHours(2));
        sefazDevolveNotaEmitidaHa(Duration.ofHours(2));

        NotaFiscal nota = service.ingerir(CHAVE, CLIENTE_ID);

        ArgumentCaptor<NotaFiscal> gravada = ArgumentCaptor.forClass(NotaFiscal.class);
        verify(notaFiscalRepository, times(1)).saveAndFlush(gravada.capture());
        assertThat(gravada.getValue().getChaveAcesso()).isEqualTo(CHAVE);
        assertThat(gravada.getValue().getClienteId()).isEqualTo(CLIENTE_ID);
        assertThat(gravada.getValue().getLojaId()).isEqualTo(LOJA_ID);
        assertThat(gravada.getValue().getValorTotal()).isEqualByComparingTo(VALOR);
        assertThat(gravada.getValue().getDataEmissao()).isEqualTo(emissao);
        assertThat(gravada.getValue().getStatus()).isEqualTo("APROVADA");
        assertThat(nota).isSameAs(gravada.getValue());

        ArgumentCaptor<NotaFiscalValidadaEvent> evento = ArgumentCaptor.forClass(NotaFiscalValidadaEvent.class);
        verify(eventPublisher, times(1)).publishEvent(evento.capture());
        assertThat(evento.getValue().chaveAcesso()).isEqualTo(CHAVE);
        assertThat(evento.getValue().clienteId()).isEqualTo(CLIENTE_ID);
        assertThat(evento.getValue().lojaId()).isEqualTo(LOJA_ID);
        assertThat(evento.getValue().valorTotal()).isEqualByComparingTo(VALOR);
        assertThat(evento.getValue().dataEmissao()).isEqualTo(emissao);
    }

    @Test
    void noteOlderThan72hIsRejectedAndNotSaved() {
        for (Duration idade : new Duration[] {Duration.ofHours(72).plusSeconds(1), Duration.ofHours(96)}) {
            sefazDevolveNotaEmitidaHa(idade);

            FiscalBusinessException rejeicao = rejeicaoAoIngerir();

            assertThat(rejeicao).as("nota emitida há %s", idade).isNotNull();
            assertThat(rejeicao.getError()).isEqualTo(FiscalError.NOTA_EXPIRADA_72H);
            assertThat(rejeicao.getError().status().value()).isEqualTo(422);
        }
        verify(notaFiscalRepository, never()).saveAndFlush(any(NotaFiscal.class));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void noteWithin72hIsAccepted() {
        Duration[] idades = {Duration.ofHours(72), Duration.ofHours(72).minusMinutes(1)};
        for (Duration idade : idades) {
            sefazDevolveNotaEmitidaHa(idade);

            NotaFiscal nota = service.ingerir(CHAVE, CLIENTE_ID);

            assertThat(nota.getDataEmissao()).as("nota emitida há %s", idade).isEqualTo(AGORA.minus(idade));
            assertThat(nota.getStatus()).isEqualTo("APROVADA");
        }
        verify(notaFiscalRepository, times(idades.length)).saveAndFlush(any(NotaFiscal.class));
    }
}
