import { Alert } from '@mui/material'

interface ErrorMessageProps {
  children: string
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return <Alert severity="error">{children}</Alert>
}
