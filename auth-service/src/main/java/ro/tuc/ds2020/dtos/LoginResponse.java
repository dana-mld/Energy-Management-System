package ro.tuc.ds2020.dtos;

public record LoginResponse(
        String accessToken,
        String tokenType
) {
}