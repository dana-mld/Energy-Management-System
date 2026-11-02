package ro.tuc.ds2020.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "credentials")
public class Credential {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    @Column(nullable = false)
    private String role;
    public Credential() {
    }

    public Credential(
            UUID userId,
            String username,
            String passwordHash,
            String role) {

        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}