import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './app/App.tsx'
import theme from './app/theme.ts'
import { AuthProvider } from './features/auth/AuthContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <AuthProvider>
        <App />
       </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
