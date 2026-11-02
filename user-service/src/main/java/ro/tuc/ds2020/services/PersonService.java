package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ro.tuc.ds2020.clients.AuthClient;
import ro.tuc.ds2020.clients.DeviceClient;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.CreateUserRequest;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.UpdateAccountRequest;
import ro.tuc.ds2020.dtos.AccountDetailsResponse;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;
import ro.tuc.ds2020.repositories.UserDeviceRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final DeviceClient deviceClient;
    private final UserDeviceRepository userDeviceRepository;
    private final AuthClient authClient;

    @Autowired
    public PersonService(PersonRepository personRepository, DeviceClient deviceClient, UserDeviceRepository userDeviceRepository, AuthClient authClient) {
        this.personRepository = personRepository;
        this.deviceClient = deviceClient;
        this.userDeviceRepository = userDeviceRepository;
        this.authClient = authClient;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDTO(prosumerOptional.get());
    }

    @Transactional
    public UUID insert(CreateUserRequest request) {

        if (authClient.usernameExists(request.username())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username already exists"
            );
        }

        Person person = new Person();
        person.setName(request.name());
        person.setAddress(request.address());
        person.setAge(request.age());

        person = personRepository.saveAndFlush(person);

        authClient.register(
                person.getId(),
                request.username(),
                request.password(),
                request.role()
        );

        LOGGER.debug("Person with id {} was created", person.getId());

        return person.getId();
    }

    public PersonDTO update(UUID id, PersonDetailsDTO personDTO) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Person with id: " + id
                ));

        person.setName(personDTO.getName());
        person.setAge(personDTO.getAge());
        person.setAddress(personDTO.getAddress());

        person = personRepository.save(person);

        LOGGER.debug("Person with id {} was updated", id);

        return PersonBuilder.toPersonDTO(person);
    }

    public AccountDetailsResponse getAccountDetails(UUID id) {
        if (!personRepository.existsById(id)) {
            throw new ResourceNotFoundException("Person with id: " + id);
        }

        return authClient.getAccountDetails(id);
    }

    public void updateAccount(UUID id, UpdateAccountRequest request) {
        if (!personRepository.existsById(id)) {
            throw new ResourceNotFoundException("Person with id: " + id);
        }

        authClient.updateCredentials(id, request.username(), request.role());

        LOGGER.debug("Account with id {} was updated", id);
    }

    @Transactional
    public void delete(UUID id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Person with id: " + id
                        )
                );

        deviceClient.unassignDevicesOfUser(id);

        authClient.deleteCredentials(id);

        userDeviceRepository.deleteByUserId(id);

        personRepository.delete(person);

        LOGGER.debug("Person with id {} was deleted", id);
    }

}
