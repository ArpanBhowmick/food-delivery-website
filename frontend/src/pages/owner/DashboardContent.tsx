import { Store, Plus } from "lucide-react";
import PortfolioTips from "@/components/owner/PortfolioTips";
import PortfolioOverview from "@/components/owner/PortfolioOverview";
import { Link } from "react-router-dom";
import ShopCard from "@/components/owner/ShopCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import RecentlyAdded from "@/components/owner/RecentlyAdded";
import GrowBusinessCard from "@/components/owner/GrowBusinessCard";

const DashboardContent = () => {
  const shops = useSelector((state: RootState) => state.shop.shops);

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Shops</h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {shops.length} of {shops.length} shop
              {shops.length !== 1 && "s"}
            </p>
          </div>
          <Link
            to="/owner/shop/create"
            className="px-4 py-2.5 rounded-lg bg-[#581c87] text-white font-medium text-sm hover:bg-[#4c1775] transition-colors flex items-center shadow-sm w-fit cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Shop
          </Link>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Area - Shop Cards Grid */}

          <div className="xl:col-span-3">
            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {shops.map((shop) => (
                <ShopCard key={shop._id} shop={shop} />
              ))}
              <GrowBusinessCard />
            </div>

            {/* Full Width CTA */}
            {/* <div className="lg:col-span-3 w-full"> */}
            
            {/* </div> */}
          </div>

          {/* Right Area - Sidebar Widgets */}
          <div className="xl:col-span-1 space-y-6">
            {/* Portfolio Overview */}

            <PortfolioOverview shops={shops} />

            {/* Recently Added */}

            <RecentlyAdded shops={shops} />

            {/* Portfolio Tips */}

            <PortfolioTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
