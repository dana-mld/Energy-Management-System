
package ro.tuc.ds2020.services;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {

    private final JwtDecoder jwtDecoder;

    public TokenValidationService(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    public Jwt validate(String token) {
        return jwtDecoder.decode(token);
    }
}
