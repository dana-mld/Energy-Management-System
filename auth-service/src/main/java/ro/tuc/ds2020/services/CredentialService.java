
package ro.tuc.ds2020.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.server.ResponseStatusException;
import ro.tuc.ds2020.dtos.RegisterRequest;
import ro.tuc.ds2020.dtos.AccountDetailsResponse;
import ro.tuc.ds2020.dtos.UpdateCredentialsRequest;
import ro.tuc.ds2020.entities.Credential;
import ro.tuc.ds2020.repositories.CredentialRepository;

import java.util.UUID;

@Service
public class CredentialService {

    private final CredentialRepository repository;
    private final PasswordEncoder passwordEncoder;

    public CredentialService(
            CredentialRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(RegisterRequest request) {

        if (repository.existsById(request.userId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Credentials already exist for this user");
        }

        if (repository.existsByUsername(request.username())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username already exists");
        }

        String hash = passwordEncoder.encode(request.password());

        Credential credential = new Credential(
                request.userId(),
                request.username(),
                hash,
                request.role());

        repository.saveAndFlush(credential);
    }

    @Transactional
    public void updateCredentials(UUID userId, UpdateCredentialsRequest request) {
        Credential credential = repository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Credentials not found"));

        String username = request.username().trim();
        repository.findByUsername(username)
                .filter(existing -> !existing.getUserId().equals(userId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Username already exists");
                });

        credential.setUsername(username);
        credential.setRole(request.role());
        repository.saveAndFlush(credential);
    }

    public AccountDetailsResponse getAccountDetails(UUID userId) {
        Credential credential = repository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Credentials not found"));

        return new AccountDetailsResponse(credential.getUsername(), credential.getRole());
    }

    public boolean usernameExists(String username) {
        return repository.existsByUsername(username);
    }

    @Transactional
    public void deleteCredentials(UUID userId) {
        if (!repository.existsById(userId)) {
            return;
        }

        repository.deleteById(userId);
    }
}
