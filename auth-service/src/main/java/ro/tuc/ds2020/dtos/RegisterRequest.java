package ro.tuc.ds2020.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RegisterRequest(

        @NotNull
        UUID userId,

        @NotBlank
        String username,

        @NotBlank
        @Size(min = 8, max = 72)
        String password,

        @NotBlank
        @Pattern(regexp = "ADMIN|CLIENT")
        String role

) {
}