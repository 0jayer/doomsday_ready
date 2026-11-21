import MovieForm from "./MovieForm"
import MovieList from "./MovieList"
import { Stack, Typography } from "@mui/material"

function MoviesView({ movies, onCreate, onUpdate }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h2">
        Movies
      </Typography>
      <MovieForm movies={movies} onCreate={onCreate} />
      <MovieList movies={movies} onUpdate={onUpdate} />
    </Stack>
  )
}

export default MoviesView
