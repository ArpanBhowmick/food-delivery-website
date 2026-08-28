import OwnerNavbar from "@/components/owner/OwnerNavbar";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { useShopApi } from "@/hook/useShopApi";
import { setShops } from "@/store/shopSlice";
import type { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const OwnerLayout = () => {
  const { getOwnerShops } = useShopApi();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getOwnerShops();

        dispatch(setShops(response.shops));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div className="h-screen flex flex-col overflow-hidden bg-[#f8f9fa] font-sans text-gray-900">
    <OwnerNavbar />

    <div className="flex flex-1 min-h-0 overflow-hidden">
      <OwnerSidebar />

      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default OwnerLayout;
