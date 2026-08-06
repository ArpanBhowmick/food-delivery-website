import  { useEffect, useState } from "react";
import EmptyDashboard from "./EmptyDashboard";
import { useShopApi } from "@/hook/useShopApi";
import { useDispatch, useSelector } from "react-redux";
import type{ AppDispatch, RootState } from "@/store/store";
import { setShops } from "@/store/shopSlice";

import DashboardContent2 from "./DashboardContent2";
import ShopDetails from "@/components/owner/ShopDetails";


const OwnerDashboard = () => {
  // const { getOwnerShops } = useShopApi();
  // const dispatch = useDispatch<AppDispatch>();

  const shops = useSelector((state: RootState) => state.shop.shops)

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchShops = async () => {
  //     try {
  //       const response = await getOwnerShops();

  //       dispatch(setShops(response.shops));

  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchShops();

  // }, []);

  //  if (loading) {
  //   return <div>Loading...</div>;
  // }

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
