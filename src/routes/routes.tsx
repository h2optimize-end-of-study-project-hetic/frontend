import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/connection/Login";
import SignUpPage from "../pages/connection/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import TechnicianTagEdit from "../pages/technician/TechnicianTagEditView";
// import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/errors/Unauthorized";
import TechnicianTagCreate from "../pages/technician/TechnicianTagCreate";
import TechnicianDashboard from "../pages/technician/TechnicianDashboardView";
import TechnicianTagManager from "../pages/technician/TechnicianTagManager";
import AdminUserCreate from "../pages/admin/AdminUserCreate";
import AdminEditGroupView from "../pages/admin/AdminEditGroupView";
import AdminEditUserView from "../pages/admin/AdminEditUserView";
import AdminDashboard from "../pages/admin/AdminDashboardView";
import AdminUserEdit from "../pages/admin/AdminUserEdit";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        //public
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />

        // general
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="dashboard" element={<Dashboard />} />
        {/* </Route> */}
        
        //technician
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="technician">
            <Route path="dashboard" element={<TechnicianDashboard />} />
            <Route path="create" element={<TechnicianTagCreate />} />
            <Route path="edit" element={<TechnicianTagManager />} />
            <Route path="edit" element={<TechnicianTagEdit />} />
            <Route path=":id/edit" element={<TechnicianTagEdit />} />
          </Route>
        {/* </Route> */}

        //admin
        <Route path="admin">
          <Route path="create" element={<AdminUserCreate />} />
          <Route path="edit" element={<AdminUserEdit />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path=":id/edit-user" element={<AdminEditUserView/>} /> 
          <Route path=":id/edit-group" element={<AdminEditGroupView />} />
        </Route>
      </Route>
      //errors
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
