import UserNavbar from "@/components/user/UserNavbar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};