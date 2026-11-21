import { useEffect, useState } from "react"
import { Alert, Stack, Typography } from "@mui/material"
import { apiRequest } from "../../api"
import RewatchSelect from "./RewatchSelect"
import RewatchResult from "./RewatchResult"

function RewatchView({ movies }) {
  const [targetId, setTargetId] = useState("")
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!targetId) return

    let cancelled = false
    apiRequest(`/movies/${targetId}/rewatch-order`)
      .then((data) => {
        if (!cancelled) setPlan(data)
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message)
      })

    return () => {
      cancelled = true
    }
  }, [targetId])

  function selectTarget(event) {
    setTargetId(event.target.value)
    setPlan(null)
    setError("")
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h2">
        Rewatch Plan
      </Typography>
      <RewatchSelect
        movies={movies}
        targetId={targetId}
        onChange={selectTarget}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <RewatchResult plan={plan} />
    </Stack>
  )
}

export default RewatchView