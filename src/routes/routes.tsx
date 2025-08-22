import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/connection/Login";
import SignUpPage from "../pages/connection/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import TechnicianTagEdit from "../pages/technician/TechnicianTagEditView";
// import TechnicianDashboard from "../pages/technician/TechnicianDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/errors/Unauthorized";
import TechnicianTagCreate from "../pages/technician/TechnicianTagCreate";
import TechnicianDashboard from "../pages/technician/TechnicianDashboardView";
import TechnicianTagManager from "../pages/technician/TechnicianTagManager";

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
        <Route path="technician">
          {/* <Route index element={<TechnicianDashboard />} /> */}
          <Route path="edit" element={<TechnicianTagManager />} />
          <Route path=":id/edit" element={<TechnicianTagEdit />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="create" element={<TechnicianTagCreate />} />
          <Route path="edit" element={<TechnicianTagEdit />} />
        </Route>
      </Route>
      //errors
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
