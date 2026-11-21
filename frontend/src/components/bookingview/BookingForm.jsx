import { useState } from "react"

function BookingForm({ cinemas, onSubmit }) {
  const [cinemaId, setCinemaId] = useState("")
  const [groupSize, setGroupSize] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(cinemaId, groupSize)
  }

  return (
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
  )
}

export default BookingForm
