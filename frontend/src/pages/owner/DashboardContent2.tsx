import React from "react";
import ShopCard from "@/components/owner/ShopCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";



export default function MyShops() {
  const shops = useSelector((state: RootState) => state.shop.shops);

  return (
    <div className="h-full w-full min-h-0 overflow-y-auto bg-[#f8f9fa] font-sans text-gray-900">
      <main className="w-full min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            MY SHOPS
          </h1>
          <p className="text-sm text-gray-500">
            Dynamic date:{" "}
            <span className="text-gray-900 font-medium">October 26, 2023</span>
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-4 items-center justify-between mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <span className="font-semibold px-2">My Shops ({shops.length} total)</span>
            <Link  to="/owner/shop/create" className="bg-[#581c87] hover:bg-[#4c1775] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer">
              <Plus size={16} />
              ADD NEW SHOP
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[140px] lg:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64"
              />
            </div>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 relative cursor-pointer">
              <option>All Statuses</option>
            </select>

            <select className="hidden sm:block border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer">
              <option>City</option>
            </select>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      </main>
    </div>
  );
}
