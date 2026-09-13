import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useAuth();
  const location = useLocation();

  if (checkingAuth) {
    return <div className="pr-loading">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;