import { useState } from "react"
import { apiRequest } from "../../api"
import BookingForm from "./BookingForm"
import BookingResult from "./BookingResult"
import "./BookingView.css"

function BookingView({ cinemas, onCreateCinema }) {
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState("")
  const [creatingCinema, setCreatingCinema] = useState(false)
  const [cinemaName, setCinemaName] = useState("")
  const [bundleSizes, setBundleSizes] = useState("")
  const [cinemaError, setCinemaError] = useState("")

  async function loadQuote(cinemaId, groupSize) {
    try {
      const data = await apiRequest(
        `/cinemas/${cinemaId}/booking?groupSize=${groupSize}`,
      )
      setQuote(data)
      setError("")
    } catch (requestError) {
      setQuote(null)
      setError(requestError.message)
    }
  }

  return (
    <section className="booking-view">
      <h2>Booking</h2>
      <BookingForm cinemas={cinemas} onSubmit={loadQuote} />
      {error && <p className="booking-error" role="alert">{error}</p>}
      <BookingResult quote={quote} />

      <div className="cinema-create-panel">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setCreatingCinema((current) => !current)}
        >
          {creatingCinema ? "Cancel" : "Add cinema"}
        </button>

        {creatingCinema && (
          <form
            className="cinema-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setCinemaError("")

              const sizes = bundleSizes
                .split(",")
                .map((size) => Number(size.trim()))
                .filter((size) => size)

              if (sizes.length < 1 || sizes.length > 10) {
                setCinemaError("Enter between 1 and 10 bundle sizes.")
                return
              }
              if (new Set(sizes).size !== sizes.length) {
                setCinemaError("Bundle sizes must be distinct.")
                return
              }
              if (sizes.some((size) => size < 1 || size > 500)) {
                setCinemaError("Bundle sizes must be between 1 and 500.")
                return
              }

              const result = await onCreateCinema({
                name: cinemaName,
                bundleSizes: sizes,
              })
              if (!result.ok) {
                setCinemaError(
                  result.code === "DUPLICATE_CINEMA_NAME"
                    ? "A cinema with this name already exists."
                    : result.message,
                )
                return
              }

              setCinemaName("")
              setBundleSizes("")
              setCreatingCinema(false)
            }}
          >
            <label>
              Cinema name
              <input
                value={cinemaName}
                onChange={(event) => setCinemaName(event.target.value)}
                placeholder="Galaxy Cineplex"
                required
              />
            </label>
            <label>
              Bundle sizes
              <input
                value={bundleSizes}
                onChange={(event) => setBundleSizes(event.target.value)}
                placeholder="2, 5"
                required
              />
            </label>
            <button type="submit">Save cinema</button>
          </form>
        )}
        {cinemaError && (
          <p className="booking-error" role="alert">{cinemaError}</p>
        )}
      </div>
    </section>
  )
}

export default BookingView
