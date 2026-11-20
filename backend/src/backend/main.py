from typing import Annotated

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from psycopg import Connection

from backend.database import Database
from backend.errors import ApiError
from backend.repositories import MovieRepository
from backend.schemas import MovieCreate, MovieUpdate

app = FastAPI(title="Doomsday Ready")
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
        "id": m["id"],
        "title": m["title"],
        "releaseYear": m["release_year"],
        "runtimeMinutes": m["runtime_minutes"],
        "watched": m["watched"],
    }


def movie_out(m):
    return {**movie_summary(m), "prerequisites": m["prerequisites"]}


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
    unwatched = [m for m in movies if not m["watched"]]
    return {
        "movieId": movie_id,
        "order": [movie_summary(m) for m in movies],
        "watchedCount": len(movies) - len(unwatched),
        "totalCount": len(movies),
        "remainingRuntimeMinutes": sum(m["runtime_minutes"] for m in unwatched),
    }