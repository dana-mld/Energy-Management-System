package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BrowserOriginService {

    private final String allowedOrigin;

    public BrowserOriginService(
            @Value("${app.frontend-origin}") String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    public void check(String method, String origin) {
        boolean safeMethod =
                "GET".equals(method)
                        || "HEAD".equals(method)
                        || "OPTIONS".equals(method);

        if (safeMethod) {
            return;
        }

        if (!allowedOrigin.equals(origin)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Request origin is not allowed"
            );
        }
    }
}