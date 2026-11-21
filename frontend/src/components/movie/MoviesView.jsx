import MovieForm from "./MovieForm"
import MovieList from "./MovieList"
import "./MoviesView.css"

function MoviesView({ movies, onCreate, onUpdate }) {
  return (
    <section className="movies-view">
      <h2>Movies</h2>
      <MovieForm onCreate={onCreate} />
      <MovieList movies={movies} onUpdate={onUpdate} />
    </section>
  )
}

export default MoviesView
