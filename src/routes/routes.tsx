import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route, Outlet, Navigate } from "react-router";
import LoginPage from "../pages/connection/Login";
import SignUpPage from "../pages/connection/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import UserCreate from "../pages/user/UserCreate";
import EditGroupView from "../pages/group/EditGroupView";
import EditUserView from "../pages/user/EditUserView";
import AdminDashboard from "../pages/admin/AdminDashboardView";
import UserEdit from "../pages/user/UserEdit";
import Edit from "../pages/Edit";
import RequireRole from "../components/RequireRole";
import TagExplorerPage from "../pages/tag/TagExplorerPage.tsx";
import TagEditPage from "../pages/tag/TagEditPage.tsx";
import TagCreatePage from "../pages/tag/TagCreatePage.tsx";
import RoomExplorerPage from "../pages/room/RoomExplorerPage.tsx";
import RoomEditPage from "../pages/room/RoomEditPage.tsx";
import RoomCreatePage from "../pages/room/RoomCreatePage.tsx";
import RoomStatistiquePage from "../pages/room/RoomStatistiquePage.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="edit" element={<Edit />} />
        {/* redirection automatique si on ouvre "/" */}
        <Route index element={<Navigate to="/login" replace />} />
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
        <Route
          path="tag"
          element={
            <RequireRole allowedRoles={["technician", "admin"]}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="" element={<TagExplorerPage />} />
          <Route path="dashboard" element={<Navigate to="" replace />} />
          <Route path="create" element={<TagCreatePage />} />
          <Route path=":id/edit" element={<TagEditPage />} />
          <Route path="edit" element={<TagEditPage />} />
        </Route>
        <Route
          path="room"
          element={
            <RequireRole allowedRoles={["technician", "admin"]}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="" element={<RoomExplorerPage />} />
          <Route path="dashboard" element={<Navigate to="" replace />} />
          <Route path="create" element={<RoomCreatePage />} />
          <Route path=":id/edit" element={<RoomEditPage />} />
          <Route path="edit" element={<RoomEditPage />} />
          <Route path="statistique" element={<RoomStatistiquePage />} />
        </Route>
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
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
