package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.entities.UserDevice;
import ro.tuc.ds2020.repositories.UserDeviceRepository;
import ro.tuc.ds2020.repositories.PersonRepository;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;

import java.util.UUID;

@Service
public class UserDeviceService {

    private final UserDeviceRepository userDeviceRepository;
    private final PersonRepository personRepository;

    public UserDeviceService(
            UserDeviceRepository userDeviceRepository,
            PersonRepository personRepository) {

        this.userDeviceRepository = userDeviceRepository;
        this.personRepository = personRepository;
    }

    @Transactional
    public void saveAssociation(UUID deviceId, UUID userId) {

        if (!personRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "Person with id: " + userId
            );
        }

        UserDevice association = new UserDevice(deviceId, userId);

        userDeviceRepository.save(association);
    }

    @Transactional
    public void deleteAssociation(UUID deviceId) {
        userDeviceRepository.deleteById(deviceId);
    }
}