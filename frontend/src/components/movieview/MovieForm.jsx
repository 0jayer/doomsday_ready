import { useState } from "react"

function MovieForm({ onCreate }) {
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [runtimeMinutes, setRuntimeMinutes] = useState("")

  function handleSubmit(event) {
    event.preventDefault()

    onCreate({
      title,
      releaseYear: Number(releaseYear),
      runtimeMinutes: Number(runtimeMinutes),
      prerequisites: [],
      watched: false,
    })

    setTitle("")
    setReleaseYear("")
    setRuntimeMinutes("")
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Movie title"
        required
      />
      <input
        type="number"
        value={releaseYear}
        onChange={(event) => setReleaseYear(event.target.value)}
        placeholder="Release year"
        required
      />
      <input
        type="number"
        min="1"
        max="300"
        value={runtimeMinutes}
        onChange={(event) => setRuntimeMinutes(event.target.value)}
        placeholder="Runtime"
        required
      />
      <button type="submit">Add movie</button>
    </form>
  )
}

export default MovieForm
