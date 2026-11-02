package ro.tuc.ds2020.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public class DeviceDetailsDTO {

    private UUID id;

    @NotBlank
    private String name;

    @Positive
    private double maximum_consumption;

    @NotBlank
    private String description;



    private UUID userId;

    public DeviceDetailsDTO() {
    }

    public DeviceDetailsDTO(String name, double maximum_consumption,
                            String description,
                            UUID userId) {
        this.name = name;
        this.maximum_consumption = maximum_consumption;
        this.description = description;
        this.userId = userId;
    }

    public DeviceDetailsDTO(UUID id, String name, double maximum_consumption,
                            String description,
                            UUID userId) {
        this(name, maximum_consumption, description, userId);
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }



    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public double getMaximum_consumption() {
        return maximum_consumption;
    }
    public void setMaximum_consumption(double maximum_consumption) {
        this.maximum_consumption = maximum_consumption;
    }
}