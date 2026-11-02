import { Button, Typography } from '@mui/material'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Page not found
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        The address does not match any page of the application.
      </Typography>
      <Button variant="outlined" component={Link} to="/">
        Back to the list
      </Button>
    </>
  )
}
