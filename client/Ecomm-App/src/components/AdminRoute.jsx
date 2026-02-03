import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT admin
  if (role !== "admin" || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return <Outlet />;
};

export default AdminRoute;
