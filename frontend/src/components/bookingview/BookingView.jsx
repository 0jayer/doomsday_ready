import { useState } from "react"
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { apiRequest } from "../../api"
import BookingForm from "./BookingForm"
import BookingResult from "./BookingResult"

function BookingView({ cinemas, onCreateCinema }) {
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState("")
  const [creatingCinema, setCreatingCinema] = useState(false)
  const [cinemaName, setCinemaName] = useState("")
  const [bundleSizes, setBundleSizes] = useState("")
  const [cinemaError, setCinemaError] = useState("")

  async function loadQuote(cinemaId, groupSize) {
    try {
      const data = await apiRequest(
        `/cinemas/${cinemaId}/booking?groupSize=${groupSize}`,
      )
      setQuote(data)
      setError("")
    } catch (requestError) {
      setQuote(null)
      setError(requestError.message)
    }
  }

  async function handleCreateCinema(event) {
    event.preventDefault()
    setCinemaError("")

    const sizes = bundleSizes
      .split(",")
      .map((size) => Number(size.trim()))
      .filter((size) => size)

    if (sizes.length < 1 || sizes.length > 10) {
      setCinemaError("Enter between 1 and 10 bundle sizes.")
      return
    }
    if (new Set(sizes).size !== sizes.length) {
      setCinemaError("Bundle sizes must be distinct.")
      return
    }
    if (sizes.some((size) => size < 1 || size > 500)) {
      setCinemaError("Bundle sizes must be between 1 and 500.")
      return
    }

    const result = await onCreateCinema({
      name: cinemaName,
      bundleSizes: sizes,
    })
    if (!result.ok) {
      setCinemaError(
        result.code === "DUPLICATE_CINEMA_NAME"
          ? "A cinema with this name already exists."
          : result.message,
      )
      return
    }

    setCinemaName("")
    setBundleSizes("")
    setCreatingCinema(false)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h2">
        Booking
      </Typography>

      <BookingForm cinemas={cinemas} onSubmit={loadQuote} />
      {error && <Alert severity="error">{error}</Alert>}
      <BookingResult quote={quote} />

      <Divider />

      <Box>
        <Button
          variant="outlined"
          onClick={() => setCreatingCinema((current) => !current)}
        >
          {creatingCinema ? "Cancel" : "Add cinema"}
        </Button>

        {creatingCinema && (
          <Stack
            component="form"
            onSubmit={handleCreateCinema}
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ mt: 2, alignItems: { xs: "stretch", lg: "flex-start" } }}
          >
            <TextField
              label="Cinema name"
              value={cinemaName}
              onChange={(event) => setCinemaName(event.target.value)}
              placeholder="Galaxy Cineplex"
              required
              fullWidth
            />
            <TextField
              label="Bundle sizes"
              value={bundleSizes}
              onChange={(event) => setBundleSizes(event.target.value)}
              placeholder="2, 5"
              helperText="Comma-separated, e.g. 2, 5"
              required
              fullWidth
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
              Save cinema
            </Button>
          </Stack>
        )}

        {cinemaError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {cinemaError}
          </Alert>
        )}
      </Box>
    </Stack>
  )
}

export default BookingView