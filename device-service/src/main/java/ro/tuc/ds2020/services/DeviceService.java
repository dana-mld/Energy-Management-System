package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.clients.UserClient;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;
    private final UserClient userClient;

    public DeviceService(DeviceRepository deviceRepository, UserClient userClient) {
        this.deviceRepository = deviceRepository;
        this.userClient = userClient;
    }

    public List<DeviceDTO> findDevices() {
        return deviceRepository.findAll()
                .stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO findDeviceById(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device with id: " + id
                ));

        return DeviceBuilder.toDeviceDTO(device);
    }

    public List<DeviceDTO> findDevicesByUserId(UUID userId) {
        return deviceRepository.findByUserId(userId)
                .stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public UUID insert(DeviceDetailsDTO dto) {
        if (dto.getUserId() != null) {
            checkUserExists(dto.getUserId());
        }

        Device device = DeviceBuilder.toEntity(dto);
        device = deviceRepository.save(device);

        if (device.getUserId() != null) {
            userClient.saveAssociation(
                    device.getId(),
                    device.getUserId()
            );
        }

        LOGGER.debug("Device with id {} was inserted", device.getId());

        return device.getId();
    }

    public DeviceDTO update(UUID id, DeviceDetailsDTO dto) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device with id: " + id
                ));

        UUID oldUserId = device.getUserId();
        UUID newUserId = dto.getUserId();

        if (newUserId != null && !newUserId.equals(oldUserId)) {
            checkUserExists(newUserId);
        }

        device.setName(dto.getName());
        device.setMaximum_consumption(dto.getMaximum_consumption());
        device.setDescription(dto.getDescription());
        device.setUserId(newUserId);

        device = deviceRepository.save(device);

        if (!java.util.Objects.equals(oldUserId, newUserId)) {
            if (newUserId != null) {
                userClient.saveAssociation(id, newUserId);
            } else {
                userClient.deleteAssociation(id);
            }
        }

        LOGGER.debug("Device with id {} was updated", id);

        return DeviceBuilder.toDeviceDTO(device);
    }
    public void delete(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device with id: " + id
                ));

        if (device.getUserId() != null) {
            userClient.deleteAssociation(id);
        }

        deviceRepository.delete(device);

        LOGGER.debug("Device with id {} was deleted", id);
    }
    @Transactional
    public void unassignByUser(UUID userId) {
        List<Device> devices = deviceRepository.findByUserId(userId);
        devices.forEach(d -> d.setUserId(null));
        deviceRepository.saveAll(devices);
    }



    private void checkUserExists(UUID userId) {
        if (userId != null && !userClient.userExists(userId)) {
            throw new ResourceNotFoundException("Person with id: " + userId);
        }
    }
}