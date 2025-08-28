import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route, Outlet } from "react-router";
import LoginPage from "../pages/connection/Login";
import SignUpPage from "../pages/connection/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import TagEdit from "../pages/tag/TagEditView";
import Unauthorized from "../pages/errors/Unauthorized";
import TagCreate from "../pages/tag/TagCreate";
import TechnicianDashboard from "../components/organisms/technician/TechnicianDashboardView";
import TagManager from "../pages/tag/TagManager";
import UserCreate from "../pages/user/UserCreate";
import EditGroupView from "../pages/group/EditGroupView";
import EditUserView from "../pages/user/EditUserView";
import AdminDashboard from "../pages/admin/AdminDashboardView";
import UserEdit from "../pages/user/UserEdit";
import Edit from "../pages/Edit";
import RequireRole from "../components/RequireRole";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        //public
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        // general
        <Route
          path="/dashboard"
          element={
            <RequireRole
              allowedRoles={["admin", "technician", "staff", "guest"]}
            >
              <Dashboard />
            </RequireRole>
          }
        />
        //tag
        <Route
          path="tag"
          element={
            <RequireRole allowedRoles={["technician", "admin"]}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="create" element={<TagCreate />} />
          <Route path="edit" element={<TagManager />} />
          <Route path=":id/edit" element={<TagEdit />} />
        </Route>
        //user
        <Route
          path="user"
          element={
            <RequireRole allowedRoles={["admin", "staff"]}>
              <Outlet />
            </RequireRole>
          }
        >
          {" "}
          <Route path="create" element={<UserCreate />} />
          <Route path="edit" element={<UserEdit />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path=":id/edit-user" element={<EditUserView />} />
        </Route>
        //group
        <Route
          path="group"
          element={
            <RequireRole allowedRoles={["admin", "staff"]}>
              <Outlet />
            </RequireRole>
          }
        >
          {" "}
          {/* <Route path="create" element={<UserCreate />} />
        <Route path="edit" element={<UserEdit />} /> */}
          {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
          <Route path=":id/edit-group" element={<EditGroupView />} />
        </Route>
      </Route>
      //errors
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
