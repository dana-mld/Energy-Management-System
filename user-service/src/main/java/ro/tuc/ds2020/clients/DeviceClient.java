package ro.tuc.ds2020.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.UUID;

@Component
public class DeviceClient {

    private final RestClient client;

    public DeviceClient(@Value("${device-service.url}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setReadTimeout(Duration.ofSeconds(5));
        this.client = RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }

    public void unassignDevicesOfUser(UUID userId) {
        try {
            client.put().uri("/devices/unassign-by-user/{id}", userId)
                    .retrieve().toBodilessEntity();
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Device service could not respond");
        }
    }
}