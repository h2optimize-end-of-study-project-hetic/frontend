import { Routes, Route } from 'react-router';
import LoginPage from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
