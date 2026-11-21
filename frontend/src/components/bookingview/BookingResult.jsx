function BookingResult({ quote }) {
  if (!quote) return null

  if (!quote.possible) {
    return (
      <div className="booking-result booking-impossible">
        <strong>Not possible with this cinema’s bundles</strong>
      </div>
    )
  }

  return (
    <div className="booking-result">
      <p>Total bundles: {quote.totalBundles}</p>
      {Object.entries(quote.combination).map(([size, count]) => (
        <p key={size}>
          {size} × {count}
        </p>
      ))}
    </div>
  )
}

export default BookingResult
