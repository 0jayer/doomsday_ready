import { useState } from "react"

function MovieCard({ movie, movies, onUpdate }) {
  const [inlineError, setInlineError] = useState("")

  async function changeWatched(event) {
    setInlineError("")
    const result = await onUpdate(movie.id, {
      watched: event.target.checked,
    })
    if (!result.ok) setInlineError(result.message)
  }

  const prerequisiteNames = movie.prerequisites
    .map((id) => movies.find((option) => option.id === id)?.title)
    .filter(Boolean)

  return (
    <tr className="movie-row">
      <td data-label="Title"><strong>{movie.title}</strong></td>
      <td data-label="Year">{movie.releaseYear}</td>
      <td data-label="Runtime">{movie.runtimeMinutes} min</td>
      <td data-label="Watched">
        <input
          type="checkbox"
          checked={movie.watched}
          onChange={changeWatched}
          aria-label={`Watched ${movie.title}`}
        />
      </td>
      <td data-label="Direct prerequisites">
        {prerequisiteNames.length
          ? prerequisiteNames.join(", ")
          : "None"}
        {inlineError && (
          <p className="inline-error" role="alert">{inlineError}</p>
        )}
      </td>
    </tr>
  )
}

export default MovieCard
