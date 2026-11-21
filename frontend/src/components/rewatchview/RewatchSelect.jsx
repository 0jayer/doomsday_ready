import { MenuItem, TextField } from "@mui/material"

function RewatchSelect({ movies, targetId, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="Target movie"
      value={targetId}
      onChange={onChange}
    >
      <MenuItem value="">
        <em>Select a movie</em>
      </MenuItem>
      {movies.map((movie) => (
        <MenuItem key={movie.id} value={movie.id}>
          {movie.title}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default RewatchSelect