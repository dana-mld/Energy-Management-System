package ro.tuc.ds2020.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.UUID;

@Component
public class UserClient {

    private final RestClient client;

    public UserClient(@Value("${user-service.url}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setReadTimeout(Duration.ofSeconds(5));
        this.client = RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }

    public boolean userExists(UUID userId) {
        try {
            client.get().uri("/person/{id}", userId).retrieve().toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "User service not available");
        }
    }

    public void saveAssociation(UUID deviceId, UUID userId) {
        try {
            client.put()
                    .uri("/internal/user-device/{deviceId}", deviceId)
                    .body(new AssociationRequest(userId))
                    .retrieve()
                    .toBodilessEntity();

        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not synchronize device-user association",
                    e
            );
        }
    }

    private record AssociationRequest(UUID userId) {}


    public void deleteAssociation(UUID deviceId) {
        try {
            client.delete()
                    .uri("/internal/user-device/{deviceId}", deviceId)
                    .retrieve()
                    .toBodilessEntity();

        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not remove device-user association",
                    e
            );
        }
    }
}