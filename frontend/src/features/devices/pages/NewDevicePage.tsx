import { Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import DeviceForm from '../components/DeviceForm.tsx'
import { createDevice } from '../api.ts'
import type { NewDevice } from '../types.ts'

export default function NewDevicePage() {
  const navigate = useNavigate()

  async function handleSubmit(device: NewDevice) {
    const id = await createDevice(device)
    navigate(`/devices/${id}`)
  }

  return (
    <>
      <Typography variant="h1" sx={{ mb: 3 }}>
        New Device
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560 }}>
        <DeviceForm onSubmit={handleSubmit} />
      </Paper>
    </>
  )
}
