package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "maximum_consumption", nullable = false)
    private double maximum_consumption;

    @Column(name = "description", nullable = false)
    private String description;



    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private UUID userId;

    public Device() {
    }

    public Device(String name, double maximum_consumption, String description, UUID userId) {
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