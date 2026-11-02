import { CircularProgress, Stack, Typography } from '@mui/material'

export default function LoadingIndicator() {
  return (
    <Stack role="status" direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', py: 6 }}>
      <CircularProgress size={24} />
      <Typography sx={{ color: 'text.secondary' }}>Loading…</Typography>
    </Stack>
  )
}
