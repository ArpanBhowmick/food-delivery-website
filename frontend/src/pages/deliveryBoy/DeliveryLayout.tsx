import DeliveryNavbar from "@/components/deliveryBoy/DeliveryNavbar";
import { Outlet } from "react-router-dom";

const DeliveryLayout = () => {
  return (
    <>
      <DeliveryNavbar />
      <Outlet />
    </>
  );
};

export default DeliveryLayout;