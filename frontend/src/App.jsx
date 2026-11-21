import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Container,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { apiRequest } from "./api"
import MoviesView from "./components/movieview/MoviesView"
import RewatchView from "./components/rewatchview/RewatchView"
import BookingView from "./components/bookingview/BookingView"
function App() {
  const [view, setView] = useState("movies")
  const [movies, setMovies] = useState([])
  const [cinemas, setCinemas] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiRequest("/movies"),
      apiRequest("/cinemas"),
    ])
      .then(([movieData, cinemaData]) => {
        setMovies(movieData)
        setCinemas(cinemaData)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  async function createMovie(movie) {
    try {
      const created = await apiRequest("/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      })
      setMovies((current) => [...current, created])
      setError("")
      return { ok: true }
    } catch (requestError) {
      setError(requestError.message)
      return {
        ok: false,
        code: requestError.code,
        message: requestError.message,
        details: requestError.details,
      }
    }
  }

  async function updateMovie(movieId, fields) {
    const previous = movies.find((movie) => movie.id === movieId)
    if (!previous) return { ok: false, message: "Movie not found" }

    setMovies((current) =>
      current.map((movie) =>
        movie.id === movieId ? { ...movie, ...fields } : movie,
      ),
    )

    try {
      const updated = await apiRequest(`/movies/${movieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })
      setMovies((current) =>
        current.map((movie) =>
          movie.id === movieId ? updated : movie,
        ),
      )
      setError("")
      return { ok: true }
    } catch (requestError) {
      setMovies((current) =>
        current.map((movie) =>
          movie.id === movieId ? previous : movie,
        ),
      )
      setError(requestError.message)
      return {
        ok: false,
        code: requestError.code,
        message: requestError.message,
        details: requestError.details,
      }
    }
  }

  async function createCinema(cinema) {
    try {
      const created = await apiRequest("/cinemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cinema),
      })
      setCinemas((current) => [...current, created])
      setError("")
      return { ok: true }
    } catch (requestError) {
      setError(requestError.message)
      return {
        ok: false,
        code: requestError.code,
        message: requestError.message,
        details: requestError.details,
      }
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
        Doomsday Ready
      </Typography>

      <Tabs
        value={view}
        onChange={(_, nextView) => setView(nextView)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="movies" label="Movies" />
        <Tab value="rewatch" label="Rewatch Plan" />
        <Tab value="booking" label="Booking" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {view === "movies" && (
        <MoviesView
          movies={movies}
          onCreate={createMovie}
          onUpdate={updateMovie}
        />
      )}

      {view === "rewatch" && <RewatchView movies={movies} />}
      {view === "booking" && (
        <BookingView
          cinemas={cinemas}
          onCreateCinema={createCinema}
        />
      )}
    </Container>
  )
}

export default App
