package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_device")
public class UserDevice {

    @Id
    @Column(name = "device_id", columnDefinition = "BINARY(16)")
    private UUID deviceId;

    @Column(name = "user_id", nullable = false,
            columnDefinition = "BINARY(16)")
    private UUID userId;

    public UserDevice() {
    }

    public UserDevice(UUID deviceId, UUID userId) {
        this.deviceId = deviceId;
        this.userId = userId;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}