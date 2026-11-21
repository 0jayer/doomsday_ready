import { useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

function MovieForm({ movies, onCreate }) {
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [runtimeMinutes, setRuntimeMinutes] = useState("")
  const [prerequisiteIds, setPrerequisiteIds] = useState([])
  const [error, setError] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [runtimeError, setRuntimeError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setFieldError("")
    setRuntimeError("")

    const result = await onCreate({
      title,
      releaseYear: Number(releaseYear),
      runtimeMinutes: Number(runtimeMinutes),
      prerequisites: prerequisiteIds,
      watched: false,
    })

    if (!result.ok) {
      setError(result.message)
      if (result.code === "DUPLICATE_TITLE") {
        setFieldError("This movie title is already in use.")
      }
      if (result.details) {
        const runtimeIssue = result.details.find((item) =>
          item.loc?.includes("runtimeMinutes"),
        )
        if (runtimeIssue) {
          setRuntimeError("Runtime must be from 1 to 300 minutes.")
        }
        const titleIssue = result.details.find((item) =>
          item.loc?.includes("title"),
        )
        if (titleIssue) {
          setFieldError("Enter a valid movie title.")
        }
      }
      return
    }

    setTitle("")
    setReleaseYear("")
    setRuntimeMinutes("")
    setPrerequisiteIds([])
  }

  return (
    <Paper component="section" variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add a movie
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", lg: "flex-start" },
            flexWrap: { lg: "wrap" },
          }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Spider-Man: Homecoming"
            error={Boolean(fieldError)}
            helperText={fieldError}
            required
            fullWidth
          />
          <TextField
            label="Release year"
            type="number"
            value={releaseYear}
            onChange={(event) => setReleaseYear(event.target.value)}
            placeholder="2017"
            required
            sx={{ minWidth: { lg: 150 }, flex: { lg: "0 1 150px" } }}
          />
          <TextField
            label="Runtime (minutes)"
            type="number"
            value={runtimeMinutes}
            onChange={(event) => setRuntimeMinutes(event.target.value)}
            slotProps={{
              htmlInput: { min: 1, max: 300 },
            }}
            placeholder="133"
            error={Boolean(runtimeError)}
            helperText={runtimeError}
            required
            sx={{ minWidth: { lg: 180 }, flex: { lg: "0 1 180px" } }}
          />
          <Autocomplete
            multiple
            options={movies}
            getOptionLabel={(movie) => movie.title}
            value={movies.filter((movie) => prerequisiteIds.includes(movie.id))}
            onChange={(_, selected) =>
              setPrerequisiteIds(selected.map((movie) => movie.id))
            }
            disableCloseOnSelect
            sx={{ minWidth: { xs: "100%", lg: 260 }, flex: { lg: "1 1 260px" } }}
            renderOption={(props, movie, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 1 }} />
                {movie.title}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Prerequisites" />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              height: 56,
              px: 2.5,
              width: { xs: "100%", lg: "auto" },
              minWidth: 120,
              whiteSpace: "nowrap",
            }}
          >
            Add movie
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  )
}

export default MovieForm
