import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { currentUser } = useAuth();

  const isEmailVerified = currentUser?.emailVerified;

  return !currentUser || !isEmailVerified ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
}
