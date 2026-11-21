from typing import Annotated

from fastapi import Depends, FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from psycopg import Connection

from backend.cinema.cinema_repository import CinemaRepository
from backend.cinema.cinema_schemas import CinemaCreate
from backend.database.database import Database
from backend.errors import ApiError
from backend.movie.movie_repositories import MovieRepository
from backend.movie.movie_schemas import MovieCreate, MovieUpdate

app = FastAPI(title="Doomsday Ready")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = Database()


@app.exception_handler(ApiError)
def handle_api_error(request: Request, exc: ApiError):
    return JSONResponse(
        status_code=exc.status,
        content={"error": {"code": exc.code, "message": exc.message}},
    )


def get_conn():
    conn = db.connect()
    try:
        yield conn
    finally:
        conn.close()


Conn = Annotated[Connection, Depends(get_conn)]


def movie_summary(m):
    return {
        "id": m.id,
        "title": m.title,
        "releaseYear": m.release_year,
        "runtimeMinutes": m.runtime_minutes,
        "watched": m.watched,
    }


def movie_out(m):
    return {**movie_summary(m), "prerequisites": list(m.prerequisites)}


def cinema_out(c):
    return {
        "id": c.id,
        "name": c.name,
        "bundleSizes": list(c.bundle_sizes),
    }


@app.post("/api/movies", status_code=201)
def create_movie(body: MovieCreate, conn: Conn):
    movie = MovieRepository(conn).create(
        body.title, body.releaseYear, body.runtimeMinutes,
        body.prerequisites, body.watched,
    )
    return movie_out(movie)


@app.get("/api/movies")
def list_movies(conn: Conn):
    return [movie_out(m) for m in MovieRepository(conn).list_all()]


@app.patch("/api/movies/{movie_id}")
def update_movie(movie_id: int, body: MovieUpdate, conn: Conn):
    movie = MovieRepository(conn).update(movie_id, body.columns(), body.prerequisites)
    return movie_out(movie)


@app.get("/api/movies/{movie_id}/rewatch-order")
def rewatch_order(movie_id: int, conn: Conn):
    movies = MovieRepository(conn).rewatch_order(movie_id)
    unwatched = [m for m in movies if not m.watched]
    return {
        "movieId": movie_id,
        "order": [movie_summary(m) for m in movies],
        "watchedCount": len(movies) - len(unwatched),
        "totalCount": len(movies),
        "remainingRuntimeMinutes": sum(m.runtime_minutes for m in unwatched),
    }


@app.post(
    "/api/cinemas",
    status_code=201,
    responses={409: {"description": "Duplicate cinema name"}},
)
def create_cinema(body: CinemaCreate, conn: Conn):
    cinema = CinemaRepository(conn).create(body.name, body.bundleSizes)
    return cinema_out(cinema)


@app.get("/api/cinemas")
def list_cinemas(conn: Conn):
    return [cinema_out(cinema) for cinema in CinemaRepository(conn).list_all()]


@app.get("/api/cinemas/{cinema_id}/booking")
def booking_quote(
    cinema_id: int,
    groupSize: Annotated[int, Query(ge=1, le=10_000)],
    conn: Conn,
):
    cinema = CinemaRepository(conn).get(cinema_id)
    quote = cinema.booking_quote(groupSize)
    if quote is None:
        return {
            "cinemaId": cinema_id,
            "groupSize": groupSize,
            "possible": False,
            "totalBundles": 0,
            "combination": {},
        }
    return {
        "cinemaId": cinema_id,
        "groupSize": groupSize,
        "possible": True,
        "totalBundles": quote["total_bundles"],
        "combination": quote["combination"],
    }