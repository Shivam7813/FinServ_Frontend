import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // ⏳ Show loader while checking auth (IMPORTANT FIX)
  if (user === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Normalize roles (fix for USER / user issue)
  const userRole = user.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();

  // ❌ Role mismatch
  if (requiredRole && userRole !== requiredRole) {
    console.log("Blocked:", userRole, "!=", requiredRole);
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
}