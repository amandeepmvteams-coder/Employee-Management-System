import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
