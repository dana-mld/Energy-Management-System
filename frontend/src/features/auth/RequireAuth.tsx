import type { ReactNode } from "react";
import { Alert } from "@mui/material";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext.tsx";

interface RequireAuthProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function RequireAuth({
  children,
  adminOnly = false,
}: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation(); 

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Alert severity="error">This page is not for you.</Alert>;
  }

  return <>{children}</>;
}
