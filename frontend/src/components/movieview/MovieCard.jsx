import { useState } from "react"

function MovieCard({ movie, movies, onUpdate }) {
  const [inlineError, setInlineError] = useState("")
  const [editing, setEditing] = useState(false)
  const [draftPrerequisites, setDraftPrerequisites] = useState([])

  async function changeWatched(event) {
    setInlineError("")
    const result = await onUpdate(movie.id, {
      watched: event.target.checked,
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
    <tr className="movie-row">
      <td data-label="Title">
        <strong>{movie.title}</strong>
      </td>
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
        {editing ? (
          <div className="prerequisite-editor">
            <div className="prerequisite-edit-line">
              <details className="prerequisite-dropdown">
                <summary>
                  {draftPrerequisites.length
                    ? `${draftPrerequisites.length} selected`
                    : "No prerequisites"}
                </summary>
                <div className="prerequisite-options">
                  {movies
                    .filter((option) => option.id !== movie.id)
                    .map((option) => (
                      <label key={option.id}>
                        <input
                          type="checkbox"
                          checked={draftPrerequisites.includes(option.id)}
                          onChange={(event) =>
                            setDraftPrerequisites((current) =>
                              event.target.checked
                                ? [...current, option.id]
                                : current.filter((id) => id !== option.id),
                            )
                          }
                        />
                        {option.title}
                      </label>
                    ))}
                </div>
              </details>
              <div className="prerequisite-actions">
                <button type="button" onClick={savePrerequisites}>Save</button>
                <button type="button" className="secondary-button" onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="direct-prerequisite-line">
            <p className="direct-prerequisite-value">
              {prerequisiteNames.length
                ? prerequisiteNames.join(", ")
                : "None"}
            </p>
            <button
              type="button"
              className="edit-prerequisites-button"
              onClick={startEditing}
            >
              Edit
            </button>
          </div>
        )}
        {inlineError && (
          <p className="inline-error" role="alert">{inlineError}</p>
        )}
      </td>
    </tr>
  )
}

export default MovieCard
