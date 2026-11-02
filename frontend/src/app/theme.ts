import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    primary: { main: '#2f5d70' },
    error: { main: '#a32a12' },
    text: { primary: '#1e2a30', secondary: '#55646b' },
    background: { default: '#f7f8f6', paper: '#ffffff' },
    divider: '#d8dedc',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.25 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: { defaultProps: { elevation: 0 } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 600 } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
  },
})
