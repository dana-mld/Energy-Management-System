import { Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import PersonForm from '../components/PersonForm.tsx'
import { createPerson } from '../api.ts'
import type { NewPerson } from '../types.ts'

export default function NewPersonPage() {
  const navigate = useNavigate()

  async function handleSubmit(person: NewPerson) {
    const id = await createPerson(person)
    navigate(`/persons/${id}`, { replace: true })
  }

  return (
    <>
      <Typography variant="h1" sx={{ mb: 3 }}>
        New person
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560 }}>
        <PersonForm onSubmit={handleSubmit} />
      </Paper>
    </>
  )
}
