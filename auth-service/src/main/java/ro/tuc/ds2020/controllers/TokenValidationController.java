
package ro.tuc.ds2020.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import ro.tuc.ds2020.services.TokenValidationService;
import ro.tuc.ds2020.services.AuthorizationService;
import ro.tuc.ds2020.services.BrowserOriginService;

@RestController
@RequestMapping("/auth")
public class TokenValidationController {

    private final TokenValidationService validationService;
    private final AuthorizationService authorizationService;
    private final BrowserOriginService browserOriginService;

    public TokenValidationController(
            TokenValidationService validationService,
            AuthorizationService authorizationService,
            BrowserOriginService browserOriginService) {

        this.validationService = validationService;
        this.authorizationService = authorizationService;
        this.browserOriginService = browserOriginService;
    }

    @GetMapping("/validate")
    public ResponseEntity<Void> validate(

            @CookieValue(value = "access_token", required = false) String token,

            @RequestHeader(value = "X-Forwarded-Method", required = false) String method,

            @RequestHeader(value = "X-Forwarded-Uri", required = false) String uri,
            @RequestHeader(value = "Origin", required = false) String origin) {

        if (token == null
                || token.isBlank()
                || method == null
                || uri == null) {

            return ResponseEntity.status(401).build();
        }

        browserOriginService.check(method, origin);

        try {
            Jwt jwt = validationService.validate(token);

            boolean allowed = authorizationService.isAllowed(
                    jwt,
                    method,
                    uri);

            if (!allowed) {
                return ResponseEntity.status(403).build();
            }

            return ResponseEntity.noContent()
                    .header("X-Authenticated-User-Id", jwt.getSubject())
                    .build();

        } catch (JwtException exception) {
            return ResponseEntity.status(401).build();
        }
    }
}
