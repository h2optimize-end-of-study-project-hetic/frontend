import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  requiredRole?: "technician";
};

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
