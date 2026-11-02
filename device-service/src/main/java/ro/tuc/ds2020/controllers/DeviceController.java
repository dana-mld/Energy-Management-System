package ro.tuc.ds2020.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.services.DeviceService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Devices", description = "Device management and user assignments")
@ApiResponses({
        @ApiResponse(responseCode = "401", description = "Authentication is required or the token is invalid", content = @Content),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions or request origin is not allowed", content = @Content)
})

@RestController
@CrossOrigin
@RequestMapping("/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @Operation(summary = "List all devices", description = "Returns all devices. Requires the ADMIN role.")
    @ApiResponse(responseCode = "200", description = "Devices returned successfully")

    @GetMapping
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        return ResponseEntity.ok(deviceService.findDevices());
    }

    @Operation(summary = "Get a device by ID", description = "Returns device details. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Device returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid device ID format"),
            @ApiResponse(responseCode = "404", description = "Device not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DeviceDTO> getDevice(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.findDeviceById(id));
    }

    // @Parameter(hidden = true) elimină câmpul din Swagger: ID-ul vine de la
    // Traefik, nu trebuie introdus de utilizator

    @Operation(summary = "List my devices", description = "Returns devices assigned to the authenticated user. "
            + "The gateway supplies the user's ID from the validated JWT.")
    @ApiResponse(responseCode = "200", description = "Assigned devices returned; the list may be empty")
    @GetMapping("/me")
    public ResponseEntity<List<DeviceDTO>> getMyDevices(
            @Parameter(hidden = true) @RequestHeader("X-Authenticated-User-Id") UUID userId) {

        return ResponseEntity.ok(
                deviceService.findDevicesByUserId(userId));
    }

    @Operation(summary = "List devices assigned to a user", description = "ADMIN users may query any user. CLIENT users may "
            + "query only their own ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assigned devices returned; the list may be empty"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUser(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                deviceService.findDevicesByUserId(userId));
    }

    @Operation(summary = "Create a device", description = "Creates a device and optionally assigns it to an existing "
            + "user through userId. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Device created; returns the new device's ID"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "404", description = "The specified user was not found")
    })
    @PostMapping
    public ResponseEntity<UUID> insertDevice(
            @Valid @RequestBody DeviceDetailsDTO dto) {

        UUID deviceId = deviceService.insert(dto);

        return new ResponseEntity<>(deviceId, HttpStatus.CREATED);
    }

    @Operation(summary = "Update a device", description = "Updates device details and assignment. Set userId to "
            + "another existing user's ID to reassign the device, or null "
            + "to remove its assignment. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Device updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid device ID or request data"),
            @ApiResponse(responseCode = "404", description = "Device or specified user not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<DeviceDTO> updateDevice(
            @PathVariable UUID id,
            @Valid @RequestBody DeviceDetailsDTO dto) {

        return ResponseEntity.ok(deviceService.update(id, dto));
    }

    @Operation(summary = "Delete a device", description = "Deletes the device and its user association. "
            + "Does not delete the user. Requires the ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Device deleted successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid device ID format"),
            @ApiResponse(responseCode = "404", description = "Device not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        deviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Hidden

    @PutMapping("/unassign-by-user/{userId}")
    public ResponseEntity<Void> unassignByUser(@PathVariable UUID userId) {
        deviceService.unassignByUser(userId);
        return ResponseEntity.noContent().build();
    }
}