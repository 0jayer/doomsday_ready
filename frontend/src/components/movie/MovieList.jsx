import MovieCard from "./MovieCard"

function MovieList({ movies, onUpdate }) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}

export default MovieList
