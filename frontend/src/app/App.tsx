import {
  Alert,
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import AppRoutes from "./routes.tsx";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext.tsx";

const navButtonStyle = {
  "&.active": {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
};
 
const wideOnly = {
  ...navButtonStyle,
  display: { xs: "none", sm: "inline-flex" },
};

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Logout failed. Maybe try again?");
    } finally {
      setLoggingOut(false);
    }
  }
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="md">
          <Toolbar disableGutters sx={{ gap: 0.5 }}>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              noWrap
              sx={{
                flexGrow: 1,
                color: "inherit",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Energy Management App
            </Typography>
            {isAdmin && (
              <>
                <Button
                  color="inherit"
                  size="small"
                  component={NavLink}
                  to="/persons"
                  sx={navButtonStyle}
                >
                  Persons
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button
                color="inherit"
                size="small"
                component={NavLink}
                to="/profile"
                sx={navButtonStyle}
              >
                My details
              </Button>
            )}
            {isAuthenticated && (
              <Button
                color="inherit"
                size="small"
                component={NavLink}
                to="/my-devices"
                sx={navButtonStyle}
              >
                My devices
              </Button>
            )}

            {isAdmin && (
              <>
                <Button
                  color="inherit"
                  size="small"
                  component={NavLink}
                  to="/devices"
                  sx={navButtonStyle}
                >
                  Devices
                </Button>{" "}
                <Button
                  color="inherit"
                  size="small"
                  component={NavLink}
                  to="/persons/new"
                  sx={wideOnly}
                >
                  New Person
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  component={NavLink}
                  to="/devices/new"
                  sx={wideOnly}
                >
                  New Device
                </Button>
              </>
            )}

            {isAuthenticated ? (
              <Button
                color="inherit"
                size="small"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <Button
                color="inherit"
                size="small"
                component={NavLink}
                to="/login"
                sx={navButtonStyle}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        {logoutError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setLogoutError("")}
          >
            {logoutError}
          </Alert>
        )}

        <AppRoutes />
      </Container>
    </>
  );
}
