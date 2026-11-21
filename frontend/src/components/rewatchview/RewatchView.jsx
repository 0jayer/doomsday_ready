import { useEffect, useState } from "react"
import { apiRequest } from "../../api"
import RewatchSelect from "./RewatchSelect"
import RewatchResult from "./RewatchResult"
import "./RewatchView.css"

function RewatchView({ movies }) {
  const [targetId, setTargetId] = useState("")
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!targetId) return

    apiRequest(`/movies/${targetId}/rewatch-order`)
      .then(setPlan)
      .catch((requestError) => setError(requestError.message))
  }, [targetId])

  function selectTarget(event) {
    setTargetId(event.target.value)
    setPlan(null)
    setError("")
  }

  return (
    <section className="rewatch-view">
      <h2>Rewatch Plan</h2>
      <RewatchSelect
        movies={movies}
        targetId={targetId}
        onChange={selectTarget}
      />
      {error && <p role="alert">{error}</p>}
      <RewatchResult plan={plan} />
    </section>
  )
}

export default RewatchView
