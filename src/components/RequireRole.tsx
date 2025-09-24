import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, type JSX } from "react";

type RequireRoleProps = {
  children: JSX.Element;
  allowedRoles: string[];
};

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const { getRole } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchRole =  () => {
      setChecking(true);
      const newRole = getRole(); 
      setRole(newRole);
      setChecking(false);
    };
    fetchRole();
  }, []);

  if (checking) return <p>Chargement...</p>;
  
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
