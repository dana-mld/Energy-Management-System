
package ro.tuc.ds2020.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import ro.tuc.ds2020.services.CredentialUserDetailsService;

@Configuration
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12);
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.POST, "/auth/login")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/auth/validate")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.POST, "/auth/register")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/auth/username-exists/*")
                                                .permitAll().

                                                requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/auth/credentials/*")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.PUT, "/auth/credentials/*")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/auth/credentials/*")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.POST, "/auth/logout")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/auth/me")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/docs/auth/**")
                                                .permitAll()

                                                .anyRequest().denyAll());

                return http.build(); // builds the filter chain 
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider(
                        CredentialUserDetailsService userDetailsService, // user info
                        PasswordEncoder passwordEncoder) { // for veryfing pass

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

                provider.setPasswordEncoder(passwordEncoder);

                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        DaoAuthenticationProvider provider) {

                return new ProviderManager(provider);
        }

}
