package com.hoho.shoppinghub;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Swagger: o documento gerado e o arquivo versionado em {@code .docs/api/openapi.json}.
 * Para regravar o arquivo depois de mudar uma rota:
 * {@code ./mvnw test -Dtest=OpenApiDocsTest -Dopenapi.write=true}.
 */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class OpenApiDocsTest {

    private static final Path CONTRATO = Path.of("..", ".docs", "api", "openapi.json");
    private static final List<String> ROTAS_PROTEGIDAS = List.of(
            "/api/v1/notas",
            "/api/v1/notas/hoje",
            "/api/v1/beneficios/estacionamento/hoje",
            "/api/v1/analytics/lojista/dashboard",
            "/api/v1/campanhas");

    private final ObjectMapper json = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    private JsonNode documento() throws Exception {
        String corpo = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        return json.readTree(corpo);
    }

    @Test
    void apiDocsExposeTitleBearerSchemeAndRoutes() throws Exception {
        JsonNode doc = documento();

        assertThat(doc.at("/info/title").asText()).isEqualTo("Shopping Analytics & Loyalty Hub API");
        JsonNode esquema = doc.at("/components/securitySchemes/bearerAuth");
        assertThat(esquema.path("type").asText()).isEqualTo("http");
        assertThat(esquema.path("scheme").asText()).isEqualTo("bearer");
        assertThat(esquema.path("bearerFormat").asText()).isEqualTo("JWT");
        assertThat(doc.path("paths").fieldNames())
                .toIterable()
                .contains("/api/v1/auth/login")
                .containsAll(ROTAS_PROTEGIDAS);
    }

    @Test
    void loginIsPublicAndTheOtherRoutesRequireBearer() throws Exception {
        JsonNode doc = documento();

        JsonNode login = doc.path("paths").path("/api/v1/auth/login").path("post");
        assertThat(login.isObject()).isTrue();
        assertThat(login.path("security").isArray()).isTrue();
        assertThat(login.path("security")).isEmpty();

        assertThat(doc.path("security").get(0).has("bearerAuth")).isTrue();
        List<String> rotas = new ArrayList<>();
        doc.path("paths").fieldNames().forEachRemaining(rota -> {
            if (rota.startsWith("/api/v1") && !rota.equals("/api/v1/auth/login")) {
                rotas.add(rota);
            }
        });
        assertThat(rotas).containsAll(ROTAS_PROTEGIDAS);
        for (String rota : rotas) {
            JsonNode operacoes = doc.path("paths").path(rota);
            assertThat(operacoes.size()).as(rota).isPositive();
            operacoes.forEach(operacao -> {
                JsonNode seguranca = operacao.has("security") ? operacao.path("security") : doc.path("security");
                assertThat(seguranca.size()).as(rota).isEqualTo(1);
                assertThat(seguranca.get(0).has("bearerAuth")).as(rota).isTrue();
            });
        }
    }

    @Test
    void swaggerUiIsServedWithoutToken() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/swagger-ui/index.html"));
        String pagina = mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertThat(pagina).contains("swagger-ui");
    }

    @Test
    void committedContractMatchesTheGeneratedOne() throws Exception {
        JsonNode gerado = documento();
        if (Boolean.getBoolean("openapi.write")) {
            Files.createDirectories(CONTRATO.getParent());
            Files.writeString(
                    CONTRATO, json.writerWithDefaultPrettyPrinter().writeValueAsString(gerado) + "\n");
        }

        assertThat(CONTRATO).exists();
        assertThat(json.readTree(Files.readString(CONTRATO))).isEqualTo(gerado);
    }
}
