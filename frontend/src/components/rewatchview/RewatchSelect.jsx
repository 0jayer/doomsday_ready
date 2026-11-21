function RewatchSelect({ movies, targetId, onChange }) {
  return (
    <select
      className="rewatch-select"
      value={targetId}
      onChange={onChange}
    >
      <option value="">Select a movie</option>
      {movies.map((movie) => (
        <option key={movie.id} value={movie.id}>
          {movie.title}
        </option>
      ))}
    </select>
  )
}

export default RewatchSelect
