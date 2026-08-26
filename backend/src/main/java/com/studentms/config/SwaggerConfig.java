package com.studentms.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI studentManagementApi() {
        return new OpenAPI()
                .info(new Info().title("Student Management API").version("1.0").description("REST API for the Student Management System"))
                .externalDocs(new ExternalDocumentation().description("Project Documentation").url("https://example.com"));
    }
}
