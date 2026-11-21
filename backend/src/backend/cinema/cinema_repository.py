from backend.cinema.cinema import Cinema
from backend.database.db_helpers import unique_guard
from backend.errors import CinemaNotFound, DuplicateCinemaName


class CinemaRepository:
    def __init__(self, conn):
        self.conn = conn

    def _sizes_map(self):
        mapping = {}
        rows = self.conn.execute(
            "SELECT cinema_id, size FROM cinema_bundles ORDER BY size"
        ).fetchall()
        for row in rows:
            mapping.setdefault(row["cinema_id"], []).append(row["size"])
        return mapping

    def list_all(self):
        cinemas = self.conn.execute("SELECT * FROM cinemas ORDER BY id").fetchall()
        sizes = self._sizes_map()
        for cinema in cinemas:
            cinema["bundle_sizes"] = sizes.get(cinema["id"], [])
        return [
            Cinema(
                id=cinema["id"],
                name=cinema["name"],
                bundle_sizes=cinema["bundle_sizes"],
            )
            for cinema in cinemas
        ]

    def get(self, cinema_id):
        cinema = self.conn.execute(
            "SELECT * FROM cinemas WHERE id = %s", (cinema_id,)
        ).fetchone()
        if cinema is None:
            raise CinemaNotFound(cinema_id)
        rows = self.conn.execute(
            "SELECT size FROM cinema_bundles WHERE cinema_id = %s ORDER BY size",
            (cinema_id,),
        ).fetchall()
        cinema["bundle_sizes"] = [row["size"] for row in rows]
        return Cinema(
            id=cinema["id"],
            name=cinema["name"],
            bundle_sizes=cinema["bundle_sizes"],
        )

    def create(self, name, bundle_sizes):
        cinema = Cinema(name=name, bundle_sizes=bundle_sizes)
        cinema.validate()
        with unique_guard(DuplicateCinemaName), self.conn.transaction():
            row = self.conn.execute(
                "INSERT INTO cinemas (name) VALUES (%s) RETURNING id", (name,)
            ).fetchone()
            for size in bundle_sizes:
                self.conn.execute(
                    "INSERT INTO cinema_bundles (cinema_id, size) VALUES (%s, %s)",
                    (row["id"], size),
                )
        return self.get(row["id"])
