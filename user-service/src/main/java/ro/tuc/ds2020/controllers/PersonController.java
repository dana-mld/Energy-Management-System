package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.CreateUserRequest;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.UpdateAccountRequest;
import ro.tuc.ds2020.dtos.AccountDetailsResponse;
import ro.tuc.ds2020.services.PersonService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import io.swagger.v3.oas.annotations.Parameter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Users", description = "User profile management and account creation")
@ApiResponses({
        @ApiResponse(responseCode = "401", description = "Authentication is required or the token is invalid", content = @Content),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions or request origin is not allowed", content = @Content)
})

@RestController
@CrossOrigin
@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @Operation(summary = "List all users", description = "Returns all user profiles. Requires the ADMIN role.")
    @ApiResponse(responseCode = "200", description = "User profiles returned successfully")

    @GetMapping()
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = personService.findPersons();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @Operation(summary = "Create a user", description = "Creates a user profile and registers the associated "
            + "username, password and role. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created; returns the new user's ID"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @PostMapping()
    public ResponseEntity<UUID> insertPerson(
            @Valid @RequestBody CreateUserRequest request) {

        UUID personId = personService.insert(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(personId);
    }

    @Operation(summary = "Get a user by ID", description = "Returns a user profile. ADMIN users may access any "
            + "profile; CLIENT users may access only their own.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User profile returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
            @ApiResponse(responseCode = "404", description = "User profile not found")
    })
    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDTO> getPerson(@PathVariable("id") UUID personId) {
        PersonDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Operation(summary = "Update a user profile", description = "Updates the name, address and age. Does not modify "
            + "the username, password or role. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID or request data"),
            @ApiResponse(responseCode = "404", description = "User profile not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePerson(
            @PathVariable UUID id,
            @Valid @RequestBody PersonDetailsDTO personDTO) {

        PersonDTO updated = personService.update(id, personDTO);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Get a user account", description = "Returns the username and role without exposing "
            + "the password or password hash. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User account returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
            @ApiResponse(responseCode = "404", description = "User profile or credentials not found"),
            @ApiResponse(responseCode = "503", description = "Auth Service is unavailable")
    })
    @GetMapping("/{id}/account")
    public ResponseEntity<AccountDetailsResponse> getAccountDetails(@PathVariable UUID id) {
        return ResponseEntity.ok()
                .header("Cache-Control", "no-store")
                .body(personService.getAccountDetails(id));
    }

    @Operation(summary = "Update a user account", description = "Updates the username and role without changing "
            + "the password or profile. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "User account updated successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid user ID, username or role"),
            @ApiResponse(responseCode = "404", description = "User profile or credentials not found"),
            @ApiResponse(responseCode = "409", description = "Username already exists"),
            @ApiResponse(responseCode = "503", description = "Auth Service is unavailable")
    })
    @PutMapping("/{id}/account")
    public ResponseEntity<Void> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAccountRequest request) {

        personService.updateAccount(id, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a user", description = "Deletes the user profile and credentials, and unassigns "
            + "the user's devices. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "User deleted successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
            @ApiResponse(responseCode = "404", description = "User profile not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable UUID id) {

        personService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get my profile", description = "Returns the profile identified by the validated JWT. "
            + "The gateway supplies the authenticated user's ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user's profile returned successfully"),
            @ApiResponse(responseCode = "404", description = "The authenticated user has no associated profile")
    })
    @GetMapping("/me")
    public ResponseEntity<PersonDTO> getCurrentPerson(
            @Parameter(hidden = true) @RequestHeader("X-Authenticated-User-Id") UUID userId) {

        PersonDTO person = personService.findPersonById(userId);

        return ResponseEntity.ok(person);
    }
}
