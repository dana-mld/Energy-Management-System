
package ro.tuc.ds2020.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import ro.tuc.ds2020.dtos.LoginRequest;
import ro.tuc.ds2020.entities.Credential;
import ro.tuc.ds2020.repositories.CredentialRepository;

@Service
public class LoginService {

    private final AuthenticationManager authenticationManager; 
    private final CredentialRepository repository;
    private final TokenService tokenService;

    public LoginService(
            AuthenticationManager authenticationManager,
            CredentialRepository repository,
            TokenService tokenService) {

        this.authenticationManager = authenticationManager;
        this.repository = repository;
        this.tokenService = tokenService;
    }

    public String login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(  
                        request.username(),
                        request.password()
                )
        );

        Credential credential = repository
                .findByUsername(request.username())
                .orElseThrow();

        String role = credential.getRole();

        if (!"ADMIN".equals(role) && !"CLIENT".equals(role)) {
            throw new IllegalStateException("Invalid user role");
        }

        return tokenService.generateToken(
                credential.getUserId(),
                credential.getUsername(),
                role
        );
    }
}
