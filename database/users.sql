SET NAMES utf8mb4;
CREATE TABLE person (
  age INT NOT NULL,
  id BINARY(16) NOT NULL PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE user_device (
  device_id BINARY(16) NOT NULL PRIMARY KEY,
  user_id BINARY(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO person (age, id, address, name) VALUES
(30, UNHEX('550e8400e29b41d4a716446655440000'), 'Demo address, Cluj-Napoca', 'Demo Administrator'),
(25, UNHEX('550e8400e29b41d4a716446655440001'), 'Demo address, Cluj-Napoca', 'user1'),
(26, UNHEX('550e8400e29b41d4a716446655440002'), 'Demo address, Cluj-Napoca', 'user2');
INSERT INTO user_device (device_id, user_id) VALUES
(UNHEX('650e8400e29b41d4a716446655440001'), UNHEX('550e8400e29b41d4a716446655440001'));
