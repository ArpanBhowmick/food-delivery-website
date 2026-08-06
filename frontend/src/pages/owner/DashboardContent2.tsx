import React from "react";
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  BarChart3,
  Settings,
  Plus,
  Search,
  Eye,
  PenLine,
  Trash2,
  Star,
} from "lucide-react";
import ShopCard from "@/components/owner/ShopCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { Link } from "react-router-dom";

// const mockShops = [
//   {
//     id: 1,
//     name: 'Taste of Italy',
//     address: '123 Pasta Ave, New York',
//     cuisine: 'Italian',
//     rating: '4.8',
//     revenue: '$24.5k',
//     orders: '1,120',
//     status: 'Active',
//     image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 2,
//     name: 'Burger Barn',
//     address: '456 Main St, Brooklyn',
//     cuisine: 'American/Burgers',
//     rating: '4.5',
//     revenue: '$18.9k',
//     orders: '945',
//     status: 'Active',
//     image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 3,
//     name: 'Spice Route',
//     address: '456 Main St, Brooklyn',
//     cuisine: 'Italian', // Based on the image artifact
//     rating: '4.9',
//     revenue: '$29.1k',
//     orders: '1,405',
//     status: 'Closed',
//     image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 4,
//     name: 'Sushi Zen',
//     address: '346 Mains Rast',
//     cuisine: 'Sushi',
//     rating: '4.7',
//     revenue: '$14.2k',
//     orders: '680',
//     status: 'Closed',
//     image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 5,
//     name: 'Taco Fiesta',
//     address: '123 Alva Ave',
//     cuisine: 'Italian', // Based on the image artifact
//     rating: '4.6',
//     revenue: '$20.8k',
//     orders: '1,010',
//     status: 'Active',
//     image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 6,
//     name: 'The Bakery',
//     address: '5 Pasta, New York',
//     cuisine: 'Italian',
//     rating: '4.8',
//     revenue: '$16.5k',
//     orders: '890',
//     status: 'Active',
//     image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
//   }
// ];

// const sidebarItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', active: false },
//   { icon: Store, label: 'My Shops', active: true },
//   { icon: ClipboardList, label: 'Orders', active: false },

//   { icon: BarChart3, label: 'Analytics', active: false },
//   { icon: Settings, label: 'Settings', active: false },
// ];

export default function DashboardContent2() {
  const shops = useSelector((state: RootState) => state.shop.shops);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-gray-900">

      {/* Sidebar */}
      {/* <aside className="w-16 lg:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="p-2 lg:p-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href="#"
                title={item.label}
                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={`shrink-0 ${item.active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside> */}

      {/* <OwnerSidebar /> */}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
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

        {/* Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mockShops.map((shop) => (
            <div key={shop.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              
              
              <div className="relative h-48">
                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
                  shop.status === 'Active' 
                    ? 'bg-[#c6f6d5] text-[#22543d]' 
                    : 'bg-[#fed7d7] text-[#822727]'
                }`}>
                  {shop.status}
                </span>
              </div>

              
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold">{shop.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    shop.status === 'Active' 
                      ? 'bg-[#c6f6d5] text-[#22543d]' 
                      : 'bg-[#fed7d7] text-[#822727]'
                  }`}>
                    {shop.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-800 mb-4">
                  <p>{shop.address}</p>
                  <p>Cuisine: {shop.cuisine}</p>
                </div>
                
                <div className="flex flex-wrap items-center text-xs sm:text-sm font-medium gap-y-1">
                  <span>{shop.rating}</span>
                  <Star size={14} className="text-yellow-400 fill-yellow-400 ml-1 mr-2 shrink-0" />
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="mx-1">{shop.revenue} Revenue</span>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="ml-1">{shop.orders} Orders</span>
                </div>
              </div>

              
              <div className="grid grid-cols-3 border-t border-gray-200">
                <button className="py-3 flex justify-center items-center text-slate-700 hover:bg-slate-50 border-r border-gray-200 transition-colors cursor-pointer">
                  <Eye size={18} />
                </button>
                <button className="py-3 flex justify-center items-center text-slate-700 hover:bg-slate-50 border-r border-gray-200 transition-colors cursor-pointer">
                  <PenLine size={18} />
                </button>
                <button className="py-3 flex justify-center items-center text-red-500 hover:bg-red-50 hover:text-red-600 border-r border-gray-200 transition-colors cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {shops.map((shop) => (
    <ShopCard key={shop._id} shop={shop} />
  ))}
</div>

      </main>
    </div>
  );
}
