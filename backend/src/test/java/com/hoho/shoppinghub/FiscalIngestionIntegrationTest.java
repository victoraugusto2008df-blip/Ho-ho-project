package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hoho.shoppinghub.auth.security.AuthenticatedUser;
import com.hoho.shoppinghub.auth.service.JwtService;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalRepository;
import com.hoho.shoppinghub.fiscal.domain.NotaFiscalValidadaEvent;
import com.hoho.shoppinghub.fiscal.gateway.MockSefazGateway;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class FiscalIngestionIntegrationTest {

    private static final UUID CLIENTE_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");
    private static final UUID STORE_A = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final String UNKNOWN_CHAVE = "00000000000000000000000000000000000000000000";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private List<NotaFiscalValidadaEvent> publishedEvents;

    @TestConfiguration(proxyBeanMethods = false)
    static class EventCaptureConfig {

        @Bean
        List<NotaFiscalValidadaEvent> publishedEvents() {
            return new ArrayList<>();
        }

        @Bean
        EventRecorder eventRecorder(List<NotaFiscalValidadaEvent> events) {
            return new EventRecorder(events);
        }

        static class EventRecorder {

            private final List<NotaFiscalValidadaEvent> events;

            EventRecorder(List<NotaFiscalValidadaEvent> events) {
                this.events = events;
            }

            @EventListener
            void on(NotaFiscalValidadaEvent event) {
                events.add(event);
            }
        }
    }

    @BeforeEach
    void clearEvents() {
        publishedEvents.clear();
    }

    @Test
    void validNoteReturns201WithRepresentation() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_ZARA_65))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.chaveAcesso").value(MockSefazGateway.CHAVE_ZARA_65))
                .andExpect(jsonPath("$.status").value("APROVADA"))
                .andExpect(jsonPath("$.clienteId").value(CLIENTE_ID.toString()))
                .andExpect(jsonPath("$.lojaId").value(STORE_A.toString()))
                .andExpect(jsonPath("$.valorTotal").isNumber())
                .andExpect(jsonPath("$.dataEmissao").isNotEmpty());
    }

    @Test
    void validNotePublishesEvent() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_RENNER_85)).andExpect(status().isCreated());

        assertThat(publishedEvents).hasSize(1);
        NotaFiscalValidadaEvent event = publishedEvents.get(0);
        assertThat(event.chaveAcesso()).isEqualTo(MockSefazGateway.CHAVE_RENNER_85);
        assertThat(event.clienteId()).isEqualTo(CLIENTE_ID);
        assertThat(event.lojaId()).isNotNull();
        assertThat(event.valorTotal()).isEqualByComparingTo("85.00");
        assertThat(event.dataEmissao()).isNotNull();
    }

    @Test
    void duplicateChaveReturns409() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_FASTSHOP_55)).andExpect(status().isCreated());

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_FASTSHOP_55))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("NOTA_DUPLICADA"));
    }

    @Test
    void expiredNoteReturns422() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_EXPIRADA_96H))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value("NOTA_EXPIRADA_72H"));

        assertThat(notaFiscalRepository.existsByChaveAcesso(MockSefazGateway.CHAVE_EXPIRADA_96H)).isFalse();
    }

    @Test
    void foreignStoreNoteReturns422() throws Exception {
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_CNPJ_EXTERNO))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value("LOJA_NAO_CREDENCIADA"));

        assertThat(notaFiscalRepository.existsByChaveAcesso(MockSefazGateway.CHAVE_CNPJ_EXTERNO)).isFalse();
    }

    @Test
    void unknownChaveReturns404() throws Exception {
        mockMvc.perform(postNota(UNKNOWN_CHAVE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CHAVE_NAO_ENCONTRADA"));
    }

    @Test
    void malformedChaveReturns400() throws Exception {
        mockMvc.perform(postNota("123"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("CHAVE_INVALIDA"));
    }

    @Test
    void errorsCarryCodeAndNonEmptyMessage() throws Exception {
        mockMvc.perform(postNota("123"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty());

        mockMvc.perform(postNota(UNKNOWN_CHAVE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty());

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_EXPIRADA_96H))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty());

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_CNPJ_EXTERNO))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty());

        mockMvc.perform(postNota(MockSefazGateway.CHAVE_BURGER_KING_95)).andExpect(status().isCreated());
        mockMvc.perform(postNota(MockSefazGateway.CHAVE_BURGER_KING_95))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder postNota(String chaveAcesso) {
        return post("/api/v1/notas")
                .header("Authorization", "Bearer " + consumidorToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"chaveAcesso\":\"" + chaveAcesso + "\"}");
    }

    private String consumidorToken() {
        return jwtService.generateToken(
                new AuthenticatedUser(null, "consumidor@shopping.com", null, "CONSUMIDOR", null, CLIENTE_ID));
    }
}
