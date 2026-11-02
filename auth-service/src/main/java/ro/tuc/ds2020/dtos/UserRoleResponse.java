
package ro.tuc.ds2020.dtos;

import java.util.UUID;

public record UserRoleResponse(
        UUID id,
        String role
) {
}
