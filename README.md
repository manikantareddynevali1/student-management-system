# Student Management System

Enterprise-quality student management platform built with:

- Java 26
- Spring Boot 4
- PostgreSQL
- Spring Data JPA
- Spring Security + JWT
- MapStruct
- Swagger/OpenAPI
- React + Vite + Tailwind CSS

## Architecture

This project follows a Clean Architecture / layered design with isolated packages:

- `config` — application and infrastructure configuration
- `controller` — REST API entry points only
- `service` — business logic
- `service.impl` — concrete service implementations
- `repository` — Spring Data JPA repositories
- `entity` — JPA domain models
- `dto` — API request and response objects
- `mapper` — MapStruct mappers
- `security` — authentication and authorization
- `exception` — custom errors and handler
- `util` — shared constants/utilities
- `validation` — custom validation logic

## Initial setup

1. Open the workspace in VS Code.
2. Configure a PostgreSQL database named `studentms`, or create a Supabase project.
3. Set the database environment variables before starting the backend.
4. Run the backend via Maven.

## Connect Supabase

Supabase provides a hosted PostgreSQL database. The application architecture remains:

`React frontend -> Spring Boot API -> Supabase PostgreSQL`

1. In Supabase, open **Project Settings -> Database**.
2. Copy the **Session pooler** connection details. Use the pooler host, port `5432`, database `postgres`, and the displayed pooler username.
3. In PowerShell, set the values for the current terminal:

```powershell
$env:DB_URL = "jdbc:postgresql://<pooler-host>:5432/postgres?sslmode=require"
$env:DB_USERNAME = "<pooler-username>"
$env:DB_PASSWORD = "<supabase-database-password>"
```

4. Start the backend from the same terminal:

```powershell
cd backend
mvn spring-boot:run
```

The backend will create/update the application tables in Supabase because `ddl-auto` is currently set to `update`. Never commit the database password or put it in frontend code.

## Publish online

The included `render.yaml` and `backend/Dockerfile` are prepared for hosting the API on Render.

1. Push this project to a GitHub repository.
2. In Render, create a Blueprint from the repository and select `render.yaml`.
3. Set `DB_URL` to the Supabase session pooler JDBC URL, `DB_USERNAME` to the pooler username, and `DB_PASSWORD` to the database password.
4. Wait for the API deployment and copy its public HTTPS URL.
5. In `frontend/.env`, set `VITE_API_URL` to that API URL.
6. Deploy `frontend` as a Vercel or Netlify Vite site.

Required accounts and values: GitHub, Render, Vercel or Netlify, Supabase database credentials, and a strong `JWT_SECRET`. Rotate the database password because it was previously exposed in the local configuration.

## Next milestone

- Initialize the backend directory structure.
- Add authentication and user modules.
- Create the database schema and data model.
