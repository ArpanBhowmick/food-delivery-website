import OwnerNavbar from '@/components/owner/OwnerNavbar'
import { Outlet } from 'react-router-dom'

const OwnerLayout = () => {
  return (
    <>
    <OwnerNavbar/>
    <Outlet/>
    </>
  )
}

export default OwnerLayout


// import UserNavbar from "@/components/user/UserNavbar";
// import { Outlet } from "react-router-dom";

// export const UserLayout = () => {
//   return (
//     <>
//       <UserNavbar />
//       <Outlet />
//     </>
//   );
// };