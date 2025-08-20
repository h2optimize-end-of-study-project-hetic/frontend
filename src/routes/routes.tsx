import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/connexion/Login";
import SignUpPage from "../pages/connexion/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import TechnicianTagEdit from "../pages/technician/TechnicianTagEdit";
import TechnicianDashboard from "../pages/technician/TechnicianDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/errors/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        //public
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        // general
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        //technician
        <Route element={<ProtectedRoute requiredRole="technician" />}>
          <Route path="technician">
            <Route index element={<TechnicianDashboard />} />
            <Route path=":id/edit" element={<TechnicianTagEdit />} />
          </Route>
        </Route>
        //errors
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
