import EmptyDashboard from "./EmptyDashboard";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import DashboardContent2 from "./DashboardContent2";

const OwnerDashboard = () => {
  const shops = useSelector((state: RootState) => state.shop.shops);

  if (shops.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div>
      <DashboardContent2 />
      {/* <ShopDetails /> */}
    </div>
  );
};

export default OwnerDashboard;
