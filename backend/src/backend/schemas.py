from pydantic import BaseModel, ConfigDict, Field


class MovieCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=200)
    releaseYear: int = Field(ge=1900, le=2100)
    runtimeMinutes: int = Field(ge=1, le=300)
    prerequisites: list[int] = []
    watched: bool = False


class MovieUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=200)
    releaseYear: int | None = Field(default=None, ge=1900, le=2100)
    runtimeMinutes: int | None = Field(default=None, ge=1, le=300)
    prerequisites: list[int] | None = None
    watched: bool | None = None

    def columns(self):
        """The movie columns the client sent, under their database names."""
        names = {
            "title": "title",
            "releaseYear": "release_year",
            "runtimeMinutes": "runtime_minutes",
            "watched": "watched",
        }
        sent = self.model_dump(exclude_none=True)
        return {names[key]: value for key, value in sent.items() if key in names}