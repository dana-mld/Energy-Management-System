package ro.tuc.ds2020.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequest(
        @NotBlank @Size(max = 255) String username,
        @NotBlank @Pattern(regexp = "ADMIN|CLIENT") String role
) {
}
