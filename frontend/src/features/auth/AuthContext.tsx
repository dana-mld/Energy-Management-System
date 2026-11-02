import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  logout as logoutApi,
} from "../../shared/api/authApi.ts";
import type { CurrentUser } from "../../shared/api/authApi.ts";
import { ApiError } from "../../shared/api/errors.ts";
import { onUnauthorized } from "../../shared/api/authEvents.ts";

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authNotice: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    return onUnauthorized(() => {
      if (user !== null) {
        setUser(null);
        setAuthNotice(
          "Your authentication is no longer valid. Please log in again.",
        );
      }
    });
  }, [user]);
  useEffect(() => {
    let active = true;

    async function restoreAuthentication() {
      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch (error) {
        if (!active) return;

        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
        } else {
          setError("Authentication wasn't verified.");
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    void restoreAuthentication();

    return () => {
      active = false;
    };
  }, []);

  async function login() {
    const currentUser = await getCurrentUser();
    setAuthNotice("");
    setUser(currentUser);
  }

  async function logout() {
    await logoutApi();
    setAuthNotice("");
    setUser(null);
  }

  if (checking) {
    return <p role="status">Veryfing...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        authNotice,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
