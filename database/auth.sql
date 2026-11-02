SET NAMES utf8mb4;
CREATE TABLE credentials (
  user_id BINARY(16) NOT NULL PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  UNIQUE KEY uk_credentials_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO credentials (user_id, password_hash, role, username) VALUES
(UNHEX('550e8400e29b41d4a716446655440000'), '$2b$12$8CYwCdvBU17VLQmfFaJOi..D.LItQlvLbVyEMK2UdU7O7SfcAkhvy', 'ADMIN', 'admin'),
(UNHEX('550e8400e29b41d4a716446655440001'), '$2b$12$hViy720g5o9Q54r.R43TJum9Nf8shlROs8HdrH1sIFVmTeS9QthTC', 'CLIENT', 'user1'),
(UNHEX('550e8400e29b41d4a716446655440002'), '$2b$12$hViy720g5o9Q54r.R43TJum9Nf8shlROs8HdrH1sIFVmTeS9QthTC', 'CLIENT', 'user2');
