# Energy Management System

App for managing users and devices: react frontend, Spring Boot authentication, user and device services, MySQL databases, and a Traefik gateway.

## Requirements

- Docker Engine with Docker Compose
- Port 80 available and internet access for the initial image/dependency downloads.
- Java, Maven, and Node.js are provided by the Docker build stages; local installations are not required.

## Configuration


Create `.env` in each of `auth-service`, `user-service`, and `device-service` using the template provided in `.env.example`.

Generate the JWT secret with `openssl rand -base64 32`.

## Build and run

```sh
docker compose up -d --build
docker compose ps
```

- Application: http://localhost

## Database initialization

The SQL scripts in `database/` create the tables and insert demo data:

- `auth.sql`: credentials with BCrypt password hashes.
- `users.sql`: user profiles and device associations.
- `devices.sql`: devices d1–d6; d1 belongs to user1.

Docker Compose mounts each script into the corresponding MySQL
container under `/docker-entrypoint-initdb.d/`.

## Swagger

- Authentication Swagger: http://localhost/docs/auth/swagger-ui.html
- Users Swagger: http://localhost/docs/users/swagger-ui.html
- Devices Swagger: http://localhost/docs/devices/swagger-ui.html


View logs:

```sh
docker compose logs -f auth-service user-service device-service
```

Stop and remove containers while retaining database volumes:

```sh
docker compose down
```
