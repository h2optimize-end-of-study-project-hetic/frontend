import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

type RequireRoleProps = {
  children: JSX.Element;
  allowedRoles: string[];
};

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Chargement...</p>;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
