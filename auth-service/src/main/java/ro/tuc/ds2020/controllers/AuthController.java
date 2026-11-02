
package ro.tuc.ds2020.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.tuc.ds2020.dtos.LoginRequest;
import ro.tuc.ds2020.dtos.RegisterRequest;
import ro.tuc.ds2020.dtos.UpdateCredentialsRequest;
import ro.tuc.ds2020.dtos.AccountDetailsResponse;
import ro.tuc.ds2020.services.BrowserOriginService;
import ro.tuc.ds2020.services.CredentialService;
import ro.tuc.ds2020.services.LoginService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import ro.tuc.ds2020.dtos.CurrentUserResponse;
import ro.tuc.ds2020.services.TokenValidationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/auth")
public class AuthController {

        private final CredentialService credentialService;
        private final LoginService loginService;
        private final BrowserOriginService browserOriginService;
        private final TokenValidationService tokenValidationService;

        public AuthController(
                        CredentialService credentialService,
                        LoginService loginService,
                        BrowserOriginService browserOriginService, TokenValidationService tokenValidationService) {

                this.credentialService = credentialService;
                this.loginService = loginService;
                this.browserOriginService = browserOriginService;
                this.tokenValidationService = tokenValidationService;
        }

        @PostMapping("/register")
        public ResponseEntity<Void> register(
                        @Valid @RequestBody RegisterRequest request) {

                credentialService.register(request);

                return ResponseEntity.noContent().build();
        }

        @Operation(summary = "Log in", description = "Validates the username and password. On success, "
                        + "sets a JWT in an HttpOnly cookie.")
        @ApiResponses({
                        @ApiResponse(responseCode = "204", description = "Login successful; authentication cookie set", content = @Content),
                        @ApiResponse(responseCode = "400", description = "Invalid request data"),
                        @ApiResponse(responseCode = "401", description = "Invalid username or password", content = @Content),
                        @ApiResponse(responseCode = "403", description = "Request origin is not allowed")
        })
        @PostMapping("/login")
        public ResponseEntity<Void> login(
                        @Valid @RequestBody LoginRequest request,
                        @RequestHeader(value = "Origin", required = false) String origin) {
                browserOriginService.check("POST", origin);

                String token = loginService.login(request);

                ResponseCookie cookie = ResponseCookie
                                .from("access_token", token)
                                .httpOnly(true)
                                .secure(false)
                                .sameSite("Lax") 
                                .path("/")
                                .build();

                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .build();
        }

        @GetMapping("/username-exists/{username}")
        public ResponseEntity<Boolean> usernameExists(
                        @PathVariable String username) {

                return ResponseEntity.ok(
                                credentialService.usernameExists(username));
        }

        @GetMapping("/credentials/{userId}")
        public ResponseEntity<AccountDetailsResponse> getAccountDetails(
                        @PathVariable UUID userId) {

                return ResponseEntity.ok()
                                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                                .body(credentialService.getAccountDetails(userId));
        }

        @PutMapping("/credentials/{userId}")
        public ResponseEntity<Void> updateCredentials(
                        @PathVariable UUID userId,
                        @Valid @RequestBody UpdateCredentialsRequest request) {

                credentialService.updateCredentials(userId, request);
                return ResponseEntity.noContent().build();
        }

        @DeleteMapping("/credentials/{userId}")
        public ResponseEntity<Void> deleteCredentials(
                        @PathVariable UUID userId) {

                credentialService.deleteCredentials(userId);
                return ResponseEntity.noContent().build();
        }

        @Operation(summary = "Log out", description = "Deletes the authentication cookie from the browser. "
                        + "Does not revoke other copies of the JWT.")
        @ApiResponses({
                        @ApiResponse(responseCode = "204", description = "Authentication cookie cleared", content = @Content),
                        @ApiResponse(responseCode = "403", description = "Request origin is not allowed")
        })
        @PostMapping("/logout")
        public ResponseEntity<Void> logout(
                        @RequestHeader(value = "Origin", required = false) String origin) {

                browserOriginService.check("POST", origin);

                ResponseCookie cookie = ResponseCookie
                                .from("access_token", "")
                                .httpOnly(true)
                                .secure(false)
                                .sameSite("Lax")
                                .path("/")
                                .maxAge(0)
                                .build();

                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .build();
        }

        @Operation(summary = "Get the current user", description = "Validates the JWT from the authentication cookie "
                        + "and returns the user's ID and role.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Authenticated user identity"),
                        @ApiResponse(responseCode = "401", description = "Authentication cookie is missing, or the token is invalid or expired", content = @Content)
        })

        
        @GetMapping("/me")
        public ResponseEntity<CurrentUserResponse> currentUser(
                        @CookieValue(value = "access_token", required = false) String token) {

                if (token == null || token.isBlank()) {
                        return ResponseEntity.status(401).build();
                }

                try {
                        Jwt jwt = tokenValidationService.validate(token);

                        String subject = jwt.getSubject();
                        String role = jwt.getClaimAsString("role");

                        if (subject == null
                                        || (!"ADMIN".equals(role) && !"CLIENT".equals(role))) {
                                return ResponseEntity.status(401).build();
                        }

                        return ResponseEntity.ok()
                                        .header("Cache-Control", "no-store")
                                        .body(new CurrentUserResponse(
                                                        UUID.fromString(subject),
                                                        role));

                } catch (JwtException | IllegalArgumentException exception) {
                        return ResponseEntity.status(401).build();
                }
        }
}
