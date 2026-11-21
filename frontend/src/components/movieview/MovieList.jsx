import MovieCard from "./MovieCard"

function MovieList({ movies, onUpdate }) {
  return (
    <div className="movie-table-wrap">
      <table className="movie-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Runtime</th>
            <th>Watched</th>
            <th>
              Direct prerequisites
              <span className="column-help">Stored links only</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              movies={movies}
              onUpdate={onUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MovieList
