
package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;




@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final long expirationMinutes;

    public TokenService(
            JwtEncoder jwtEncoder,
            @Value("${jwt.issuer}") String issuer,
            @Value("${jwt.expiration-minutes}") long expirationMinutes) {

        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(
            UUID userId,
            String username,
            String role) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(
                        expirationMinutes,
                        ChronoUnit.MINUTES))
                .subject(userId.toString())
                .claim("username", username)
                .claim("role", role)
                .build();

        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
    }
}
