import React from 'react';
// Replace these with the specific icon library used in your project (e.g., Lucide, Heroicons, FontAwesome)
import { Home, ClipboardList, Coins, Bell } from 'lucide-react';

const DeliveryNavbar = () => {
  return (
    <nav className="flex items-center justify-between w-full gap-3 px-3 py-3 bg-white border-b border-gray-200 sm:px-6 sm:py-4">
      
      {/* Left Section: Brand & Navigation */}
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        {/* Brand */}
        <div className="shrink-0 text-xl font-bold text-[#4B0082] sm:text-2xl"> {/* Adjust hex to match exact zest purple */}
          zest <span className="font-semibold text-purple-900">Delivery</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button className="flex items-center gap-2 hover:text-[#4B0082] transition-colors">
            <Home className="w-5 h-5 text-gray-500" />
            <span>Deliveries</span>
          </button>
          
          <button className="flex items-center gap-2 hover:text-[#4B0082] transition-colors">
            <ClipboardList className="w-5 h-5 text-gray-500" />
            <span>My Orders</span>
          </button>
          
          <button className="flex items-center gap-2 hover:text-[#4B0082] transition-colors">
            <Coins className="w-5 h-5 text-gray-500" />
            <span>Earnings</span>
          </button>
        </div>
      </div>

      {/* Right Section: Status, Alerts, Profile */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        
        {/* Availability Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
          </span>
          <span className="hidden text-sm font-medium text-gray-700 sm:inline">Available</span>
        </div>

        {/* Notifications */}
        <button className="relative p-1 text-gray-600 transition-colors hover:text-[#4B0082]">
          <Bell className="w-6 h-6" />
          {/* Notification Badge matching the reference style */}
          <span className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full top-0 right-0 border border-white">
            3
          </span>
        </button>

        {/* Profile Avatar */}
        <button className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-[#4B0082] rounded-full">
          A
        </button>
        
      </div>
    </nav>
  );
};

export default DeliveryNavbar;