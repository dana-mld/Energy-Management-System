import { Box, Button, CircularProgress, MenuItem, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError } from '../../../shared/api/errors.ts'
import type { FieldErrors } from '../../../shared/api/types.ts'
import ErrorMessage from '../../../shared/ui/ErrorMessage.tsx'
import type { AccountDetails } from '../types.ts'

interface AccountFormProps {
  initialValues: AccountDetails
  onSubmit: (account: AccountDetails) => Promise<void>
  onCancel: () => void
}

export default function AccountForm({ initialValues, onSubmit, onCancel }: AccountFormProps) {
  const [values, setValues] = useState<AccountDetails>(() => ({ ...initialValues }))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const username = values.username.trim()
    const found: FieldErrors = {}
    if (username === '') {
      found.username = 'This field is required.'
    } else if (username.length > 255) {
      found.username = 'At most 255 characters are allowed.'
    }
    if (values.role !== 'ADMIN' && values.role !== 'CLIENT') {
      found.role = 'Choose ADMIN or CLIENT.'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({ username, role: values.role })
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors)
        setFormError(error.message)
      } else {
        setFormError('An unexpected error occurred.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        <TextField
          id="account-username"
          label="Username"
          autoComplete="off"
          value={values.username}
          onChange={(event) => setValues((previous) => ({ ...previous, username: event.target.value }))}
          disabled={submitting}
          error={errors.username !== undefined}
          helperText={errors.username}
        />
        <TextField
          select
          id="account-role"
          label="Role"
          value={values.role}
          onChange={(event) => {
            const role = event.target.value
            if (role === 'ADMIN' || role === 'CLIENT') {
              setValues((previous) => ({ ...previous, role }))
            }
          }}
          disabled={submitting}
          error={errors.role !== undefined}
          helperText={errors.role}
        >
          <MenuItem value="CLIENT">Client</MenuItem>
          <MenuItem value="ADMIN">Administrator</MenuItem>
        </TextField>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Stack direction="row" spacing={1.5}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {submitting ? 'Saving…' : 'Save account'}
          </Button>
          <Button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
