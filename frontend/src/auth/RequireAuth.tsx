
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const RequireAuth = () => {

  // get the user from the redux store
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  //  user is not logged in
  if (!auth.user) {
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  // user is logged in but does not have the required role
  // if (!allowedRoles.includes(auth.user.role)) {
  //   return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  // }

  // user is logged in and has the required role
  return <Outlet />;
};

