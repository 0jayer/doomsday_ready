import {
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material"

function RewatchResult({ plan }) {
  if (!plan) return null

  const progress = plan.totalCount
    ? (plan.watchedCount / plan.totalCount) * 100
    : 0

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={1.5}>
        <div>
          <Typography variant="h6" component="h3">
            Full rewatch order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This includes all prerequisite chains, not only direct links.
          </Typography>
        </div>

        <div>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {plan.watchedCount} of {plan.totalCount} watched
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </div>

        <Typography variant="body2">
          Remaining runtime: {plan.remainingRuntimeMinutes} minutes
        </Typography>

        <List dense disablePadding>
          {plan.order.map((movie) => (
            <ListItem
              key={movie.id}
              divider
              secondaryAction={
                <Chip
                  size="small"
                  label={movie.watched ? "Watched" : "Not watched"}
                  color={movie.watched ? "success" : "default"}
                  variant={movie.watched ? "filled" : "outlined"}
                />
              }
            >
              <ListItemText primary={movie.title} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  )
}

export default RewatchResult