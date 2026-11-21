from backend.database.db_helpers import unique_guard
from backend.errors import (
    CircularDependency,
    DuplicateTitle,
    MovieNotFound,
    UnknownPrerequisite,
)
from backend.movie.movie import Movie


class MovieRepository:
    UPDATABLE = ("title", "release_year", "runtime_minutes", "watched")

    def __init__(self, conn):
        self.conn = conn

    def build_graph(self):
        """Rebuild the prerequisite graph from the edge table."""
        rows = self.conn.execute(
            "SELECT movie_id, prerequisite_id FROM movie_prerequisites"
        ).fetchall()
        return Movie.build_graph(
            (row["movie_id"], row["prerequisite_id"]) for row in rows
        )

    @staticmethod
    def _from_row(row):
        return Movie(
            id=row["id"],
            title=row["title"],
            release_year=row["release_year"],
            runtime_minutes=row["runtime_minutes"],
            watched=row["watched"],
            prerequisites=tuple(row.get("prerequisites", [])),
        )

    def _check_prereqs_exist(self, prereq_ids):
        if not prereq_ids:
            return
        found = self.conn.execute(
            "SELECT id FROM movies WHERE id = ANY(%s)", (list(prereq_ids),)
        ).fetchall()
        missing = set(prereq_ids) - {r["id"] for r in found}
        if missing:
            raise UnknownPrerequisite(sorted(missing))

    def _replace_prereqs(self, movie_id, prereq_ids):
        self.conn.execute(
            "DELETE FROM movie_prerequisites WHERE movie_id = %s", (movie_id,)
        )
        for pid in prereq_ids:
            self.conn.execute(
                "INSERT INTO movie_prerequisites (movie_id, prerequisite_id) VALUES (%s, %s)",
                (movie_id, pid),
            )

    def list_all(self):
        movies = self.conn.execute("SELECT * FROM movies ORDER BY id").fetchall()
        prereqs = self._relation_map()
        for movie in movies:
            movie["prerequisites"] = prereqs.get(movie["id"], [])
        return [self._from_row(movie) for movie in movies]

    def get(self, movie_id):
        movie = self.conn.execute(
            "SELECT * FROM movies WHERE id = %s", (movie_id,)
        ).fetchone()
        if movie is None:
            raise MovieNotFound(movie_id)
        rows = self.conn.execute(
            "SELECT prerequisite_id FROM movie_prerequisites "
            "WHERE movie_id = %s ORDER BY prerequisite_id",
            (movie_id,),
        ).fetchall()
        movie["prerequisites"] = [row["prerequisite_id"] for row in rows]
        return self._from_row(movie)

    def _relation_map(self):
        mapping = {}
        rows = self.conn.execute(
            "SELECT movie_id, prerequisite_id "
            "FROM movie_prerequisites ORDER BY prerequisite_id"
        ).fetchall()
        for row in rows:
            mapping.setdefault(row["movie_id"], []).append(row["prerequisite_id"])
        return mapping

    def create(self, title, release_year, runtime_minutes, prerequisites=(), watched=False):
        prereq_ids = set(prerequisites)
        with unique_guard(DuplicateTitle), self.conn.transaction():
            self._check_prereqs_exist(prereq_ids)
            row = self.conn.execute(
                """INSERT INTO movies (title, release_year, runtime_minutes, watched)
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (title, release_year, runtime_minutes, watched),
            ).fetchone()
            self._replace_prereqs(row["id"], prereq_ids)
        return self.get(row["id"])

    def update(self, movie_id, fields, prerequisites=None):
        """fields: dict of only the columns to change. prerequisites: None = leave alone."""
        with unique_guard(DuplicateTitle), self.conn.transaction():
            self.conn.execute("SELECT pg_advisory_xact_lock(1)")
            exists = self.conn.execute(
                "SELECT 1 FROM movies WHERE id = %s", (movie_id,)
            ).fetchone()
            if exists is None:
                raise MovieNotFound(movie_id)

            changes = {k: v for k, v in fields.items() if k in self.UPDATABLE}
            if changes:
                set_clause = ", ".join(f"{col} = %s" for col in changes)
                self.conn.execute(
                    f"UPDATE movies SET {set_clause} WHERE id = %s",
                    (*changes.values(), movie_id),
                )

            if prerequisites is not None:
                prereq_ids = set(prerequisites)
                self._check_prereqs_exist(prereq_ids)
                graph = self.build_graph()
                if graph.would_create_cycle(movie_id, prereq_ids):
                    raise CircularDependency()
                self._replace_prereqs(movie_id, prereq_ids)
        return self.get(movie_id)

    def rewatch_order(self, movie_id):
        """Prerequisite movies of movie_id, prerequisites first, target excluded."""
        self.get(movie_id)
        order = self.build_graph().get_rewatch_order(movie_id)
        if not order:
            return []
        rows = self.conn.execute(
            "SELECT * FROM movies WHERE id = ANY(%s)", (order,)
        ).fetchall()
        by_id = {r["id"]: r for r in rows}
        return [self._from_row(by_id[i]) for i in order]
