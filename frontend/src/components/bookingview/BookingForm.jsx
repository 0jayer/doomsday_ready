import { useState } from "react"

function BookingForm({ cinemas, onSubmit }) {
  const [cinemaId, setCinemaId] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    setError("")
    const size = Number(groupSize)
    if (!cinemaId) {
      setError("Select a cinema.")
      return
    }
    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be an integer from 1 to 10,000.")
      return
    }
    onSubmit(cinemaId, groupSize)
  }

  const selectedCinema = cinemas.find(
    (cinema) => String(cinema.id) === String(cinemaId),
  )

  return (
    <div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <select
          value={cinemaId}
          onChange={(event) => setCinemaId(event.target.value)}
          required
        >
          <option value="">Select a cinema</option>
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          max="10000"
          value={groupSize}
          onChange={(event) => setGroupSize(event.target.value)}
          placeholder="Group size"
          required
        />

        <button type="submit">Get quote</button>
      </form>
      {selectedCinema && (
        <p className="cinema-bundle-sizes">
          Bundle sizes: {selectedCinema.bundleSizes.join(", ")}
        </p>
      )}
      {error && <p className="booking-error" role="alert">{error}</p>}
    </div>
  )
}

export default BookingForm
