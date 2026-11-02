import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../../shared/api/authApi.ts";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext.tsx";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: markAuthenticated, authNotice } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password });

      await markAuthenticated();
      navigate("/", { replace: true }); 
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login could not be completed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>

        {authNotice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {authNotice}
          </Alert>
        )}
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
