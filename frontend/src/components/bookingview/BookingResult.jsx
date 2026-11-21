import { Alert, Chip, Paper, Stack, Typography } from "@mui/material"

function BookingResult({ quote }) {
  if (!quote) return null

  if (!quote.possible) {
    return (
      <Alert severity="error">
        Not possible with this cinema’s bundles
      </Alert>
    )
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6" component="h3">
          Total bundles: {quote.totalBundles}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          {Object.entries(quote.combination).map(([size, count]) => (
            <Chip key={size} label={`${size} × ${count}`} variant="outlined" />
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default BookingResult