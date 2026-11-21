import { useState } from "react"
import { apiRequest } from "../../api"
import BookingForm from "./BookingForm"
import BookingResult from "./BookingResult"
import "./BookingView.css"

function BookingView({ cinemas }) {
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState("")

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
      {error && <p role="alert">{error}</p>}
      <BookingResult quote={quote} />
    </section>
  )
}

export default BookingView
