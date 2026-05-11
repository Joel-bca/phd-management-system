import { Navigate } from "react-router-dom";
import { getAuth } from "../lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const auth = getAuth();
  const { token, role, is_hod } = auth;

  if (!token) return <Navigate to="/" />;

  // Special check: if HOD panel, allow both role="hod" OR is_hod=true
  const hasAccess = allowedRoles?.includes(role) || (allowedRoles?.includes("hod") && is_hod);

  if (allowedRoles && !hasAccess) {
    return <Navigate to="/" />;
  }

  return children;
}