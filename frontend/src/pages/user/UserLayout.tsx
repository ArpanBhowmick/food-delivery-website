import UserNavbar from "@/components/user/Navbar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};