import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireRole = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const location = useLocation();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
