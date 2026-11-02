package ro.tuc.ds2020.dtos;

import java.util.UUID;
//raspuns pt frontend
public record CurrentUserResponse(
        UUID id,
        String role
) {
}