# Doomsday Ready

Doomsday Ready is a full-stack application for planning a Marvel movie rewatch and calculating opening-night watch-party seat bundles.

## Features

### Movies and rewatch planning

- Create movies with a unique title, release year, runtime, prerequisites, and watched status.
- Edit a movie's title, release year, runtime, prerequisites, or watched status.
- Prevent direct or indirect circular prerequisite dependencies.
- Generate a prerequisites-first rewatch order for a target movie.
- Report the number of watched movies and the remaining runtime for the target's prerequisites.

### Cinemas and booking quotes

- Create cinemas with a unique name and 1–10 distinct bundle sizes.
- Each bundle size represents the number of seats sold in that bundle.
- Calculate the minimum number of bundles needed for a group of 1–10,000 people.
- Report a possible bundle combination or indicate that no exact combination exists.

Booking results are quotes only. They are calculated when requested and are not saved to the database.

### Frontend

- **Movies:** create movies and update their prerequisites and watched status.
- **Rewatch Plan:** select a target movie and view prerequisites, progress, and remaining runtime.
- **Booking:** view cinema halls and their bundle sizes, select a cinema hall, enter a group size, and view the cheapest exact bundle combination.

## Data model

The following conceptual data model shows the entities and their relationships. `MOVIES` has a many-to-many self-referencing relationship for prerequisites. `CINEMA_BUNDLES` normalizes the cinema bundle-size multivalued attribute.

[docs/ERD_Diagram.png](docs/ERD_Diagram.png)

### Entity details

**MOVIES**

- `id`: primary key.
- `title`: required and unique case-insensitively.
- `release_year`: required integer.
- `runtime_minutes`: required integer from 1 to 300.
- `watched`: required boolean, defaulting to `FALSE`.

**MOVIE_PREREQUISITES**

- `movie_id`: foreign key to `MOVIES.id`; identifies the dependent movie.
- `prerequisite_id`: foreign key to `MOVIES.id`; identifies the prerequisite movie.
- (`movie_id`, `prerequisite_id`) is the composite primary key.
- A movie cannot use itself as a prerequisite.
- The application rejects direct and indirect circular prerequisite chains.

**CINEMAS**

- `id`: primary key.
- `name`: required and unique case-insensitively.

**CINEMA_BUNDLES**

- `cinema_id`: foreign key to `CINEMAS.id`.
- `size`: bundle size from 1 to 500.
- (`cinema_id`, `size`) is the composite primary key.
- The application requires each cinema to have 1–10 distinct bundle sizes.

Deleting a movie or cinema cascades to its relationship rows. Movies and cinemas have no relationship with each other because the booking endpoint combines a cinema with a temporary group-size input; it does not reserve or associate a movie with a cinema.

## API

All API routes are served under `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/movies` | Create a movie |
| `GET` | `/movies` | List movies |
| `PATCH` | `/movies/:id` | Update a movie |
| `GET` | `/movies/:id/rewatch-order` | Get the prerequisite rewatch order |
| `POST` | `/cinemas` | Create a cinema |
| `GET` | `/cinemas` | List cinemas |
| `GET` | `/cinemas/:id/booking?groupSize=6` | Get a booking quote |

## Running locally

Requirements:

- Docker with Docker Compose
- Python 3.14 and Node.js are only required when running outside Docker

Start the database, backend, and frontend with one command:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173`. The backend is available at `http://localhost:8000`.

To stop the application:

```bash
docker compose down
```

To also remove the PostgreSQL data:

```bash
docker compose down -v
```

### Run services individually

You can still run the services outside Docker.

Start PostgreSQL:

```bash
docker compose up -d db
```

Start the backend:

```bash
cd backend
uv sync
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:5173`. The backend is available at `http://localhost:8000`.

Optional sample movie data can be loaded with:

```bash
cd backend
uv run python -m backend.seed
```

## Testing

Backend tests:

```bash
cd backend
uv run pytest
```

Frontend end-to-end tests:

```bash
cd frontend
npm run test:e2e
```

GitHub Actions runs backend tests and frontend lint/build checks for every push and pull request. Docker Compose configuration is also validated.

## Reasonable choices and assumptions

- Rewatch order uses a prerequisites-first topological traversal. If several valid orders exist, the response may return any valid order.
- `release_year` is stored but does not have an additional range constraint in the database. The API accepts years from 1900 through 2100.
- Bundle sizes are normalized into one row per size so every size can be validated, indexed, and updated independently.
- A booking is not persisted. The assignment specifies a quote calculation, not a seat reservation or booking history.
- The database does not provide a movie-cinema relationship because no movie is tied to a cinema in the specified API or UI.
- The bundle/booking feature is independent of movies because the assessment does not require tickets or bookings to be associated with a specific movie.

## AI assistance

AI tools were used as an assistant for discussing and reviewing implementation choices, and debugging and guiding proper docker setup. The application code and architecture were reviewed and implemented and refined against the repository and assignment requirements by me.
