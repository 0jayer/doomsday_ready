class ApiError(Exception):
    """Base for every error the API reports as {"error": {"code", "message"}}."""

    status = 400
    code = "BAD_REQUEST"

    def __init__(self, message):
        super().__init__(message)
        self.message = message


class MovieNotFound(ApiError):
    status = 404
    code = "MOVIE_NOT_FOUND"

    def __init__(self, movie_id):
        super().__init__(f"Movie {movie_id} not found")


class UnknownPrerequisite(ApiError):
    status = 422
    code = "UNKNOWN_PREREQUISITE"

    def __init__(self, ids):
        super().__init__(f"Unknown prerequisite ids: {ids}")


class CircularDependency(ApiError):
    status = 409
    code = "CIRCULAR_DEPENDENCY"

    def __init__(self):
        super().__init__("These prerequisites would create a circular dependency")


class DuplicateTitle(ApiError):
    status = 409
    code = "DUPLICATE_TITLE"

    def __init__(self):
        super().__init__("A movie with this title already exists")


class CinemaNotFound(ApiError):
    status = 404
    code = "CINEMA_NOT_FOUND"

    def __init__(self, cinema_id):
        super().__init__(f"Cinema {cinema_id} not found")


class DuplicateCinemaName(ApiError):
    status = 409
    code = "DUPLICATE_CINEMA_NAME"

    def __init__(self):
        super().__init__("A cinema with this name already exists")
