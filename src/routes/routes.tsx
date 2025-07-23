import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/Login";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
