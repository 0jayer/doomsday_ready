import MovieCard from "./MovieCard"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"

function MovieList({ movies, onUpdate }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Runtime</TableCell>
            <TableCell>Watched</TableCell>
            <TableCell>
              Direct prerequisites
              <Typography variant="caption" display="block" color="text.secondary">
                Stored links only
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              movies={movies}
              onUpdate={onUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MovieList
