import type { RootState } from "@/store/store";
import { roleHome } from "@/utils/roleRoutes";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


// const roleHome = {
//   user: "/",
//   owner: "/owner",
//   deliveryBoy: "/delivery",
//   admin: "/admin",
// } as const;

const PublicRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  console.log("PublicRoute:", accessToken);

  const role = useSelector((state: RootState) => state.auth.user?.role)
  console.log(role)

  if (accessToken && role) {
    return <Navigate to={roleHome[role]} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;


// this page is for users who are logged in and cannot go back to the sign in or up page 