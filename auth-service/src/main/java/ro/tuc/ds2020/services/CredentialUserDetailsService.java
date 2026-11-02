
package ro.tuc.ds2020.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ro.tuc.ds2020.entities.Credential;
import ro.tuc.ds2020.repositories.CredentialRepository;

@Service
public class CredentialUserDetailsService
        implements UserDetailsService { 

    private final CredentialRepository repository;

    public CredentialUserDetailsService(
            CredentialRepository repository) {
        this.repository = repository;
    }

    @Override  
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Credential credential = repository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Invalid credentials"
                        )
                );

        return User.withUsername(credential.getUsername())
                .password(credential.getPasswordHash())
                .authorities("ROLE_USER")
                .build();
    }
}
