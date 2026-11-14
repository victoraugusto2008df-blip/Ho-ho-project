package com.hoho.shoppinghub.shared;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Documento OpenAPI: título e esquema Bearer JWT exigido por todas as rotas, menos o login. */
@Configuration
public class OpenApiConfig {

    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI shoppingHubOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Shopping Analytics & Loyalty Hub API")
                        .version("v1")
                        .description("API do MVP da Equipe 22 (Ho-Ho). Faça login em POST /api/v1/auth/login "
                                + "e informe o token em Authorize."))
                .components(new Components()
                        .addSecuritySchemes(
                                BEARER_AUTH,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }
}
