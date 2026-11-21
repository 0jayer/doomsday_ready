from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CinemaCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    bundleSizes: list[Annotated[int, Field(ge=1, le=500)]] = Field(
        min_length=1,
        max_length=10,
    )

    @field_validator("bundleSizes")
    @classmethod
    def no_duplicate_sizes(cls, sizes):
        if len(set(sizes)) != len(sizes):
            raise ValueError("bundle sizes must be distinct")
        return sizes
