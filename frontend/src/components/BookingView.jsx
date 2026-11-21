import { useState } from "react"
import { apiRequest } from "../api"

function BookingView({ cinemas }) {
  const [cinemaId, setCinemaId] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState("")

  async function loadQuote(event) {
    event.preventDefault()

    try {
      const data = await apiRequest(
        `/cinemas/${cinemaId}/booking?groupSize=${groupSize}`,
      )

      setQuote(data)
      setError("")
    } catch (requestError) {
      setError(requestError.message)
      setQuote(null)
    }
  }

  return (
    <section>
      <h2>Booking</h2>

      <form onSubmit={loadQuote}>
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
          required
        />

        <button type="submit">Get quote</button>
      </form>

      {error && <p role="alert">{error}</p>}

      {quote &&
        (quote.possible ? (
          <>
            <p>Total bundles: {quote.totalBundles}</p>
            {Object.entries(quote.combination).map(([size, count]) => (
              <p key={size}>
                {size} × {count}
              </p>
            ))}
          </>
        ) : (
          <p>Not possible</p>
        ))}
    </section>
  )
}

export default BookingView