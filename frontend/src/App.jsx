import { useEffect, useState } from "react"
import { apiRequest } from "./api"
import MoviesView from "./components/movieview/MoviesView"
import RewatchView from "./components/rewatchview/RewatchView"
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
      return { ok: true }
    } catch (requestError) {
      setError(requestError.message)
      return {
        ok: false,
        code: requestError.code,
        message: requestError.message,
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
      }
    }
  }

  if (loading) {
    return <main className="loading"><p>Loading...</p></main>
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Doomsday Ready</h1>
        <nav className="app-nav">
          <button className={view === "movies" ? "active" : ""} onClick={() => setView("movies")}>Movies</button>
          <button className={view === "rewatch" ? "active" : ""} onClick={() => setView("rewatch")}>Rewatch Plan</button>
          <button className={view === "booking" ? "active" : ""} onClick={() => setView("booking")}>Booking</button>
        </nav>
      </header>

      {error && <p className="app-error" role="alert">{error}</p>}

      <div className="app-content">
        {view === "movies" && (
          <MoviesView
            movies={movies}
            onCreate={createMovie}
            onUpdate={updateMovie}
          />
        )}

        {view === "rewatch" && <RewatchView movies={movies} />}
        {view === "booking" && <BookingView cinemas={cinemas} />}
      </div>
    </main>
  )
}

export default App
