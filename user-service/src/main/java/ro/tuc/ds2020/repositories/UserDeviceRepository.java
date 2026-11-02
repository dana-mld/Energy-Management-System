package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import ro.tuc.ds2020.entities.UserDevice;

public interface UserDeviceRepository
        extends JpaRepository<UserDevice, UUID> {

    List<UserDevice> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}