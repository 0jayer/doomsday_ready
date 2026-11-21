import { useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"

function MovieCard({ movie, movies, onUpdate }) {
  const [inlineError, setInlineError] = useState("")
  const [editing, setEditing] = useState(false)
  const [draftPrerequisites, setDraftPrerequisites] = useState([])

  async function changeWatched(_event, checked) {
    setInlineError("")
    const result = await onUpdate(movie.id, {
      watched: checked,
    })
    if (!result.ok) setInlineError(result.message)
  }

  function startEditing() {
    setDraftPrerequisites([...movie.prerequisites])
    setInlineError("")
    setEditing(true)
  }

  function cancelEditing() {
    setDraftPrerequisites([...movie.prerequisites])
    setInlineError("")
    setEditing(false)
  }

  async function savePrerequisites() {
    setInlineError("")
    const result = await onUpdate(movie.id, {
      prerequisites: draftPrerequisites,
    })

    if (!result.ok) {
      if (result.code === "CIRCULAR_DEPENDENCY") {
        const addedIds = draftPrerequisites.filter(
          (id) => !movie.prerequisites.includes(id),
        )
        const addedNames = addedIds
          .map((id) => movies.find((option) => option.id === id)?.title)
          .filter(Boolean)
        setInlineError(
          addedNames.length
            ? `${addedNames.join(", ")} cannot be a prerequisite of ${movie.title} because it would create a loop.`
            : "These prerequisites would create a loop.",
        )
      } else if (result.code === "UNKNOWN_PREREQUISITE") {
        setInlineError("Choose only existing prerequisite movies.")
      } else {
        setInlineError(result.message)
      }
      return
    }

    setEditing(false)
  }

  const prerequisiteNames = movie.prerequisites
    .map((id) => movies.find((option) => option.id === id)?.title)
    .filter(Boolean)

  return (
    <TableRow>
      <TableCell>
        <strong>{movie.title}</strong>
      </TableCell>
      <TableCell>{movie.releaseYear}</TableCell>
      <TableCell>{movie.runtimeMinutes} min</TableCell>
      <TableCell>
        <Checkbox
          checked={movie.watched}
          onChange={changeWatched}
          slotProps={{
            input: { "aria-label": `Watched ${movie.title}` },
          }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 330 }}>
        {editing ? (
          <Stack spacing={1}>
            <Autocomplete
              multiple
              size="small"
              options={movies.filter((option) => option.id !== movie.id)}
              getOptionLabel={(option) => option.title}
              value={movies.filter(
                (option) =>
                  option.id !== movie.id &&
                  draftPrerequisites.includes(option.id),
              )}
              onChange={(_, selected) =>
                setDraftPrerequisites(selected.map((option) => option.id))
              }
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 1 }} />
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Direct prerequisites"
                  placeholder="Select"
                />
              )}
            />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={savePrerequisites}>
                Save
              </Button>
              <Button size="small" variant="outlined" onClick={cancelEditing}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="body2">
              {prerequisiteNames.length
                ? prerequisiteNames.join(", ")
                : "None"}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={startEditing}
            >
              Edit
            </Button>
          </Box>
        )}
        {inlineError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {inlineError}
          </Alert>
        )}
      </TableCell>
    </TableRow>
  )
}

export default MovieCard
