import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminKategori from "./pages/AdminKategori";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <Routes>
          {/* Dashboard Biasa / Guest Dashboard */}
          <Route path="/" element={<LandingPage />} />

          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Admin (Hanya bisa diakses jika login sebagai role admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/kategori" element={<AdminKategori />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
