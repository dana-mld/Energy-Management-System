
import { Button, Stack } from '@mui/material'
import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <Stack direction="row" spacing={2}>
      <Button component={NavLink} to="/persons">
        Persons
      </Button>

      <Button component={NavLink} to="/devices">
        Devices
      </Button>
    </Stack>
  )
}
