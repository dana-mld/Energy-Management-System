package ro.tuc.ds2020.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import ro.tuc.ds2020.dtos.RegisterRequest;
import ro.tuc.ds2020.dtos.AccountDetailsResponse;

import java.util.UUID;

import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@Component
public class AuthClient {

    private final RestClient restClient;
    public AuthClient(
            @Value("${auth-service.url}") String authServiceUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(authServiceUrl)
                .build();
    }

    public boolean usernameExists(String username) {

        try {
            Boolean exists = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/auth/username-exists/{username}")
                            .build(username))
                    .retrieve()
                    .body(Boolean.class);

            if (exists == null) {
                throw new ResponseStatusException(
                        SERVICE_UNAVAILABLE,
                        "Empty response from Auth Service"
                );
            }

            return exists;

        } catch (org.springframework.web.client.RestClientException ex) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "Auth Service is unavailable",
                    ex
            );
        }
    }
    public void register(
            UUID userId,
            String username,
            String password,
            String role) {

        restClient.post()
                .uri("/auth/register") 
                .body(new RegisterRequest(
                        userId,
                        username,
                        password,
                        role
                ))
                .retrieve()
                .toBodilessEntity();
    }
    public AccountDetailsResponse getAccountDetails(UUID userId) {
        try {
            AccountDetailsResponse account = restClient.get()
                    .uri("/auth/credentials/{userId}", userId)
                    
                    .retrieve()
                    .onStatus(status -> status.value() == 404, (request, response) -> {
                        throw new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Credentials not found");
                    })
                    .body(AccountDetailsResponse.class);

            if (account == null) {
                throw new ResponseStatusException(
                        SERVICE_UNAVAILABLE, "Empty response from Auth Service");
            }

            return account;
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "Could not retrieve account details from Auth Service",
                    ex
            );
        }
    }

    public void updateCredentials(UUID userId, String username, String role) {
        try {
            restClient.put()
                    .uri("/auth/credentials/{userId}", userId)
                    
                    .body(java.util.Map.of("username", username, "role", role))
                    .retrieve()
                    .onStatus(status -> status.value() == 404, (request, response) -> {
                        throw new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Credentials not found");
                    })
                    .onStatus(status -> status.value() == 409, (request, response) -> {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT, "Username already exists");
                    })
                    .onStatus(status -> status.value() == 400, (request, response) -> {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "Invalid username or role");
                    })
                    .toBodilessEntity();
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "Could not update credentials in Auth Service",
                    ex
            );
        }
    }

    public void deleteCredentials(UUID userId) {
        try {
            restClient.delete()
                    .uri("/auth/credentials/{userId}", userId)
                    
                    .retrieve()
                    .toBodilessEntity();

        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not delete credentials from Auth Service",
                    ex
            );
        }
    }

}