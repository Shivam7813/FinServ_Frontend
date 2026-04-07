import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Wait until user is loaded
  if (user === null) {
    return null; // or loader
  }

  //  Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Normalize role
  const userRole = user.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();

  
  if (requiredRole && userRole !== requiredRole) {
    console.log("Blocked:", userRole, "!= ", requiredRole);
    return <Navigate to="/" replace />;
  }

  return children;
}