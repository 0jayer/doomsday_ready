import { useState } from "react"

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
    <div className="movie-create-panel">
      <h3>Add a movie</h3>
      <form className="movie-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Spider-Man: Homecoming"
            required
          />
        </label>
        <label>
          Release year
          <input
            type="number"
            value={releaseYear}
            onChange={(event) => setReleaseYear(event.target.value)}
            placeholder="2017"
            required
          />
        </label>
        <label>
          Runtime (minutes)
          <input
            type="number"
            min="1"
            max="300"
            value={runtimeMinutes}
            onChange={(event) => setRuntimeMinutes(event.target.value)}
            placeholder="133"
            required
          />
          {runtimeError && (
            <span className="field-error">{runtimeError}</span>
          )}
        </label>
        <label>
          Prerequisites
          <details className="prerequisite-dropdown">
            <summary>
              {prerequisiteIds.length
                ? `${prerequisiteIds.length} selected`
                : "Select prerequisites"}
            </summary>
            <div className="prerequisite-options">
              {movies.map((movie) => (
                <label key={movie.id}>
                  <input
                    type="checkbox"
                    checked={prerequisiteIds.includes(movie.id)}
                    onChange={(event) => {
                      setPrerequisiteIds((current) =>
                        event.target.checked
                          ? [...current, movie.id]
                          : current.filter((id) => id !== movie.id),
                      )
                    }}
                  />
                  {movie.title}
                </label>
              ))}
            </div>
          </details>
        </label>
        <button type="submit">Add movie</button>
      </form>
      {fieldError && <p className="field-error">{fieldError}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}

export default MovieForm
