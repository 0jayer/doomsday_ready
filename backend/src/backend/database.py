import os
from pathlib import Path

import psycopg
from psycopg.rows import dict_row

SCHEMA_PATH = Path(__file__).parent / "schema.sql"
DEFAULT_URL = "postgresql://doomsday:doomsday@localhost:5432/doomsday"


class Database:
    def __init__(self, url=None):
        self.url = url or os.getenv("DATABASE_URL", DEFAULT_URL)
        with self.connect() as conn:
            conn.execute(SCHEMA_PATH.read_text())

    def connect(self):
        """A fresh connection. Each request gets its own and closes it."""
        return psycopg.connect(self.url, row_factory=dict_row, autocommit=True)