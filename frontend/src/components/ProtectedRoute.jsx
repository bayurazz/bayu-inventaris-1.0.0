import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const userString = localStorage.getItem("user");
  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    user = null;
  }

  // Jika belum login atau role tidak sesuai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
