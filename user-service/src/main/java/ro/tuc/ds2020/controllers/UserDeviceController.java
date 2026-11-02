package ro.tuc.ds2020.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.services.UserDeviceService;

import java.util.UUID;

@RestController
@RequestMapping("/internal/user-device")
public class UserDeviceController {

    private final UserDeviceService userDeviceService;

    public UserDeviceController(UserDeviceService userDeviceService) {
        this.userDeviceService = userDeviceService;
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<Void> saveAssociation(
            @PathVariable UUID deviceId,
            @RequestBody AssociationRequest request) {

        userDeviceService.saveAssociation(
                deviceId,
                request.userId()
        );

        return ResponseEntity.noContent().build();
    }

    public record AssociationRequest(UUID userId) {}


    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteAssociation(
            @PathVariable UUID deviceId) {

        userDeviceService.deleteAssociation(deviceId);
        return ResponseEntity.noContent().build();
    }
}