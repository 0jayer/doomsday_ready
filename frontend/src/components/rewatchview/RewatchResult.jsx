function RewatchResult({ plan }) {
  if (!plan) return null

  return (
    <div className="rewatch-result">
      <h3>Full rewatch order</h3>
      <p className="rewatch-help">
        This includes all prerequisite chains, not only direct links.
      </p>
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

      <div className="rewatch-order">
        {plan.order.map((movie) => (
          <p key={movie.id}>
            {movie.title} — {movie.watched ? "Watched" : "Not watched"}
          </p>
        ))}
      </div>
    </div>
  )
}

export default RewatchResult
