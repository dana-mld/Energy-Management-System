package ro.tuc.ds2020.dtos;

import java.util.UUID;

public class DeviceDTO {

    private UUID id;
    private String name;
    private double maximum_consumption;
    private String description;
    private UUID userId;

    public DeviceDTO() {
    }

    public DeviceDTO(UUID id, String name, double maximum_consumption,
                     String description,
                     UUID userId) {
        this.id = id;
        this.name = name;
        this.maximum_consumption = maximum_consumption;
        this.description = description;
        this.userId = userId;
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