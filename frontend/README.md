# Person Management

A small React application for listing, creating, and viewing persons. It talks to the Spring demo API at `http://localhost:8080/spring-demo` unless `VITE_API_BASE_URL` is set.

## Project structure

```text
src/
  main.tsx                 application entry
  test-setup.ts            test setup
  app/                     shell, route table, theme
  features/persons/        the persons resource
    api.ts                 list, get, and create
    types.ts               Person and NewPerson
    validation.ts          form rules
    list.ts                search and sort
    components/            PersonForm, PersonTable
    pages/                 list, detail, and new-person screens
  shared/
    api/                   HTTP client and API errors
    ui/                    ErrorMessage, LoadingIndicator
    pages/                 NotFoundPage
```

`app` starts the application. `features/persons` holds everything that exists only for persons. `shared` holds code a second feature would also use.

A single module is a file in the feature folder (`api.ts`, `types.ts`, `validation.ts`, `list.ts`). Several related files share a folder (`components/`, `pages/`). A test file sits next to the file it covers.

## Run

Requires Node.js.

```bash
npm install
npm run dev
```

Vite serves the application at `http://localhost:5173`. The backend must be running for the list and detail pages to load data.

```bash
npm test
npm run lint
```

To use another API address, set `VITE_API_BASE_URL` before `npm run dev` or `npm run build`. Vite reads it at that time.

## Deploy

```bash
docker compose up --build -d
```

The image builds the application and nginx serves it. The host port is `5173`. nginx sends unknown paths to `index.html` so the client routes keep working.

`docker compose up` builds with the default API address. The Dockerfile does not pass `VITE_API_BASE_URL` into the image build.
