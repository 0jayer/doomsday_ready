import { useEffect, useState } from "react"
import { apiRequest } from "./api"
import MoviesView from "./components/movieview/MoviesView"
import RewatchView from "./components/RewatchView"
import BookingView from "./components/bookingview/BookingView"
import "./App.css"

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
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function updateMovie(movieId, fields) {
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
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) {
    return <main><p>Loading...</p></main>
  }

  return (
    <main>
      <h1>Doomsday Ready</h1>

      <nav>
        <button onClick={() => setView("movies")}>Movies</button>
        <button onClick={() => setView("rewatch")}>Rewatch Plan</button>
        <button onClick={() => setView("booking")}>Booking</button>
      </nav>

      {error && <p role="alert">{error}</p>}

      {view === "movies" && (
        <MoviesView
          movies={movies}
          onCreate={createMovie}
          onUpdate={updateMovie}
        />
      )}

      {view === "rewatch" && <RewatchView movies={movies} />}
      {view === "booking" && <BookingView cinemas={cinemas} />}
    </main>
  )
}

export default App
