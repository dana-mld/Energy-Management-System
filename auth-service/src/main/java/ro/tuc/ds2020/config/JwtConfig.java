
package ro.tuc.ds2020.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {

        @Bean
        public JwtEncoder jwtEncoder(
                        @Value("${jwt.secret}") String encodedSecret) {

                byte[] secretBytes = Base64.getDecoder().decode(encodedSecret);

                if (secretBytes.length < 32) {
                        throw new IllegalArgumentException(
                                        "JWT secret must contain at least 32 bytes");
                }

                SecretKey secretKey = new SecretKeySpec(
                                secretBytes,
                                "HmacSHA256");

                return new NimbusJwtEncoder(
                                new ImmutableSecret<>(secretKey));
        }

        @Bean
        public JwtDecoder jwtDecoder(
                        @Value("${jwt.secret}") String encodedSecret,
                        @Value("${jwt.issuer}") String issuer) {

                byte[] secretBytes = Base64.getDecoder().decode(encodedSecret);

                if (secretBytes.length < 32) {
                        throw new IllegalArgumentException(
                                        "JWT secret must contain at least 32 bytes");
                }

                SecretKey secretKey = new SecretKeySpec(
                                secretBytes,
                                "HmacSHA256");

                NimbusJwtDecoder decoder = NimbusJwtDecoder
                                .withSecretKey(secretKey)
                                .macAlgorithm(MacAlgorithm.HS256)
                                .build();

                decoder.setJwtValidator(
                                JwtValidators.createDefaultWithIssuer(issuer));

                return decoder;
        }

}
