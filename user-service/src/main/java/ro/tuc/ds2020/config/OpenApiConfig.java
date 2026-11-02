package ro.tuc.ds2020.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Users API", version = "1.0"), servers = {
        @Server(url = "/api", description = "Public API through Traefik") })
public class OpenApiConfig {
}