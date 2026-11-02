import { Button, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { RequestState } from '../../../shared/api/types.ts'
import ErrorMessage from '../../../shared/ui/ErrorMessage.tsx'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator.tsx'
import { listPersons } from '../api.ts'
import PersonTable from '../components/PersonTable.tsx'
import type { Person } from '../types.ts'

export default function PersonListPage() {
  const [state, setState] = useState<RequestState<Person[]>>({ status: 'loading' })

  useEffect(() => {
    let ignore = false
    listPersons()
      .then((data) => {
        if (!ignore) setState({ status: 'success', data })
      })
      .catch((error: Error) => {
        if (!ignore) setState({ status: 'error', message: error.message })
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1">Persons</Typography>
        <Button variant="contained" component={Link} to="/persons/new">
          New person
        </Button>
      </Stack>
      {state.status === 'loading' && <LoadingIndicator />}
      {state.status === 'error' && <ErrorMessage>{state.message}</ErrorMessage>}
      {state.status === 'success' && <PersonTable persons={state.data} />}
    </>
  )
}
