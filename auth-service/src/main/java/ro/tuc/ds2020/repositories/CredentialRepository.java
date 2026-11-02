package ro.tuc.ds2020.repositories;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Credential;

import java.util.Optional;
import java.util.UUID;

public interface CredentialRepository
        extends JpaRepository<Credential, UUID> {

    Optional<Credential> findByUsername(String username);

    boolean existsByUsername(@NotBlank String username);
}