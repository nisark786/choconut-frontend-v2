import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { currentUser, loadingAuth } = useContext(UserContext);

  if (loadingAuth) {
    return null; // or spinner
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
