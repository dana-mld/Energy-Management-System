package ro.tuc.ds2020.dtos;

import java.util.UUID;

public record RegisterRequest(
        UUID userId,
        String username,
        String password,
        String role
) {}