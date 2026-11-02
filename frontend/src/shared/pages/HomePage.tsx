import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { useAuth } from '../../features/auth/AuthContext.tsx'

export default function HomePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const actions = isAdmin
    ? [
        { label: 'Manage users', to: '/persons' },
        { label: 'Manage devices', to: '/devices' },
        { label: 'Create user', to: '/persons/new' },
        { label: 'Create device', to: '/devices/new' },
      ]
    : [
        { label: 'My details', to: '/profile' },
        { label: 'My devices', to: '/my-devices' },
      ]

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>Welcome</Typography>
      <Typography sx={{ mb: 3, color: 'text.secondary' }}>
        {isAdmin
          ? 'Manage user accounts, devices and device assignments.'
          : 'View your profile and the devices assigned to you.'}
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {isAdmin ? 'Administration' : 'Your account'}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {actions.map((action) => (
            <Button key={action.to} component={Link} to={action.to} variant="contained">
              {action.label}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}
