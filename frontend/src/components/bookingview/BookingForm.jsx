import { useState } from "react"
import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@mui/material"

function BookingForm({ cinemas, onSubmit }) {
  const [cinemaId, setCinemaId] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    setError("")
    const size = Number(groupSize)
    if (!cinemaId) {
      setError("Select a cinema.")
      return
    }
    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be an integer from 1 to 10,000.")
      return
    }
    onSubmit(cinemaId, groupSize)
  }

  const selectedCinema = cinemas.find(
    (cinema) => String(cinema.id) === String(cinemaId),
  )

  return (
    <Stack spacing={1.5}>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", lg: "flex-start" } }}
      >
        <TextField
          select
          label="Cinema"
          value={cinemaId}
          onChange={(event) => setCinemaId(event.target.value)}
          sx={{ flex: 2 }}
        >
          <MenuItem value="">
            <em>Select a cinema</em>
          </MenuItem>
          {cinemas.map((cinema) => (
            <MenuItem key={cinema.id} value={cinema.id}>
              {cinema.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Group size"
          type="number"
          value={groupSize}
          onChange={(event) => setGroupSize(event.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 10000 } }}
          required
          sx={{ flex: 1 }}
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
          Get quote
        </Button>
      </Stack>

      {selectedCinema && (
        <Typography variant="body2" color="text.secondary">
          Bundle sizes: {selectedCinema.bundleSizes.join(", ")}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  )
}

export default BookingForm