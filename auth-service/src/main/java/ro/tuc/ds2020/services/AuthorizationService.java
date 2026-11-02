
package ro.tuc.ds2020.services;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthorizationService {

    public boolean isAllowed(
            Jwt jwt,
            String method,
            String uri) {

        String role = jwt.getClaimAsString("role");
        String subject = jwt.getSubject();

        if (role == null || subject == null) {
            return false;
        }

        String path = uri.split("\\?", 2)[0];
        if (!path.startsWith("/api/")) {
            return false;
        }

        path = path.substring("/api".length());
        if ("/person/me".equals(path)) {
            return "GET".equals(method)
                    && ("ADMIN".equals(role) || "CLIENT".equals(role));
        }

        if ("/devices/me".equals(path)) {
            return "GET".equals(method)
                    && ("ADMIN".equals(role) || "CLIENT".equals(role));
        }
        
        if (path.equals("/person") ||
                path.startsWith("/person/")) {

            if ("ADMIN".equals(role)) {
                return isCrudMethod(method);
            }

            if ("CLIENT".equals(role)
                    && "GET".equals(method)) {

                return canClientAccessPerson(subject, path);
            }

            return false;
        }
        if (path.equals("/devices") ||
                path.startsWith("/devices/")) {

            if ("ADMIN".equals(role)) {
                return isCrudMethod(method);
            }

            if ("CLIENT".equals(role)
                    && "GET".equals(method)) {

                return canClientAccessDevices(
                        subject,
                        path);
            }
        }

        return false;
    }

    private boolean canClientAccessPerson(
            String subject,
            String path) {

        String prefix = "/person/";

        if (!path.startsWith(prefix)) {
            return false;
        }

        String requestedUserId = path.substring(prefix.length());

        try {
            UUID authenticatedUser = UUID.fromString(subject);
            UUID requestedUser = UUID.fromString(requestedUserId);

            return authenticatedUser.equals(requestedUser);

        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private boolean isCrudMethod(String method) {
        return "GET".equals(method)
                || "POST".equals(method)
                || "PUT".equals(method)
                || "DELETE".equals(method);
    }

    private boolean canClientAccessDevices(
            String subject,
            String path) {

        String prefix = "/devices/user/";

        if (!path.startsWith(prefix)) {
            return false;
        }

        String requestedUserId = path.substring(prefix.length());

        try {
            UUID authenticatedUser = UUID.fromString(subject);
            UUID requestedUser = UUID.fromString(requestedUserId);

            return authenticatedUser.equals(requestedUser);

        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

}
