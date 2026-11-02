SET NAMES utf8mb4;
CREATE TABLE device (
  maximum_consumption DOUBLE NOT NULL,
  id BINARY(16) NOT NULL PRIMARY KEY,
  user_id BINARY(16) DEFAULT NULL,
  description VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO device (maximum_consumption, id, user_id, description, name) VALUES
(150, UNHEX('650e8400e29b41d4a716446655440001'), UNHEX('550e8400e29b41d4a716446655440001'), 'Assigned demo device', 'd1'),
(2000, UNHEX('650e8400e29b41d4a716446655440002'), NULL, 'Unassigned demo device', 'd2'),
(100, UNHEX('650e8400e29b41d4a716446655440003'), NULL, 'Unassigned demo device', 'd3'),
(250, UNHEX('650e8400e29b41d4a716446655440004'), NULL, 'Unassigned demo device', 'd4'),
(500, UNHEX('650e8400e29b41d4a716446655440005'), NULL, 'Unassigned demo device', 'd5'),
(1000, UNHEX('650e8400e29b41d4a716446655440006'), NULL, 'Unassigned demo device', 'd6');
