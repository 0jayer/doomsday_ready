import { useEffect, useState } from "react"
import { apiRequest } from "../api"

function RewatchView({ movies }) {
  const [targetId, setTargetId] = useState("")
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!targetId) return

    apiRequest(`/movies/${targetId}/rewatch-order`)
      .then(setPlan)
      .catch((requestError) => setError(requestError.message))
  }, [targetId])

  function selectTarget(event) {
    setTargetId(event.target.value)
    setPlan(null)
    setError("")
  }

  return (
    <section>
      <h2>Rewatch Plan</h2>

      <select
        value={targetId}
        onChange={selectTarget}
      >
        <option value="">Select a movie</option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      {plan && (
        <>
          <p>
            {plan.watchedCount} of {plan.totalCount} watched
          </p>

          <progress
            value={plan.watchedCount}
            max={plan.totalCount || 1}
          />

          <p>
            Remaining runtime: {plan.remainingRuntimeMinutes} minutes
          </p>

          {plan.order.map((movie) => (
            <p key={movie.id}>
              {movie.title} — {movie.watched ? "Watched" : "Not watched"}
            </p>
          ))}
        </>
      )}
    </section>
  )
}

export default RewatchView