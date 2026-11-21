from contextlib import contextmanager

import psycopg.errors


@contextmanager
def unique_guard(error_class):
    """Turn the database's unique-index error into one of our own errors."""
    try:
        yield
    except psycopg.errors.UniqueViolation:
        raise error_class() from None
