function MovieCard({ movie, onUpdate }) {
  return (
    <article className="movie-card">
      <h3>{movie.title}</h3>
      <p>{movie.runtimeMinutes} minutes</p>

      <label>
        <input
          type="checkbox"
          checked={movie.watched}
          onChange={(event) =>
            onUpdate(movie.id, { watched: event.target.checked })
          }
        />
        Watched
      </label>

      <p>
        Prerequisites:{" "}
        {movie.prerequisites.length
          ? movie.prerequisites.join(", ")
          : "None"}
      </p>
    </article>
  )
}

export default MovieCard
