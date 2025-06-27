import MainLayout from "../components/layouts/MainLayout";
import { Routes, Route } from "react-router";
import LoginPage from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
