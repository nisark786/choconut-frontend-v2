import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const AdminRoutes = () => {
  const { currentUser } = useContext(UserContext)

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
