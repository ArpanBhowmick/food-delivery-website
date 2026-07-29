import React from 'react';
import { 
  FiSearch, 
  FiChevronDown, 
  FiPlusSquare, 
  FiBell, 
  FiTrendingUp, 
  FiUser 
} from 'react-icons/fi';

const OwnerNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm w-full">
      
      {/* Left Section: Logo & Location */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-baseline font-bold text-3xl tracking-tight cursor-pointer">
          <span className="text-[#640a99]">zest</span>
          <span className="text-[#4b0b75] ml-1">Partner</span>
        </div>

        {/* Location Dropdown */}
        <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
          Select Location
          <FiChevronDown className="ml-1 text-gray-500 text-lg" />
        </button>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-1 max-w-2xl mx-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-xl group-focus-within:text-gray-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 sm:text-base transition-all"
            placeholder="Search for 'Order ID', 'Dish', or 'Customer'"
          />
        </div>
      </div>

      {/* Right Section: Outlets & Actions */}
      <div className="flex items-center space-x-8">
        
        {/* Outlets Dropdown */}
        <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-base transition-colors">
          My Outlets
          <FiChevronDown className="ml-1 text-gray-500 text-xl" />
        </button>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          
          {/* Add Items */}
          <button className="flex flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors">
            <FiPlusSquare className="text-[26px] mb-1" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold">Add Items</span>
          </button>

          {/* New Orders (with Badge) */}
          <button className="flex flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors relative">
            <div className="relative mb-1">
              <FiBell className="text-[26px]" strokeWidth={1.5} />
              {/* Notification Badge */}
              <span className="absolute -top-1.5 -right-2 bg-[#d93838] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                3
              </span>
            </div>
            <span className="text-[11px] font-semibold">New Orders</span>
          </button>

          {/* Insights */}
          <button className="flex flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors">
            <FiTrendingUp className="text-[26px] mb-1" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold">Insights</span>
          </button>

          {/* Login */}
          <button className="flex flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors">
            <FiUser className="text-[26px] mb-1" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold">Login</span>
          </button>

        </div>
      </div>
      
    </nav>
  );
};

export default OwnerNavbar;