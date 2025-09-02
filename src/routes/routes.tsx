import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/connection/Login";
import SignUpPage from "../pages/connection/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import TagEdit from "../pages/tag/TagEditView";
// import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/errors/Unauthorized";
import TagCreate from "../pages/tag/TagCreate";
import TechnicianDashboard from "../pages/technician/TechnicianDashboardView";
import TagManager from "../pages/tag/TagManager";
import UserCreate from "../pages/user/UserCreate";
import EditGroupView from "../pages/group/EditGroupView.tsx";
import EditUserView from "../pages/user/EditUserView";
import AdminDashboard from "../pages/admin/AdminDashboardView";
import UserEdit from "../pages/user/UserEdit";

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
            <Route path="create" element={<TagCreate />} />
            <Route path="edit" element={<TagManager />} />
            <Route path="edit" element={<TagEdit />} />
            <Route path=":id/edit" element={<TagEdit />} />
          </Route>
        {/* </Route> */}

        //admin
        <Route path="admin">
          <Route path="create" element={<UserCreate />} />
          <Route path="edit" element={<UserEdit />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path=":id/edit-user" element={<EditUserView/>} /> 
          <Route path=":id/edit-group" element={<EditGroupView />} />
        </Route>
      </Route>
      //errors
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
