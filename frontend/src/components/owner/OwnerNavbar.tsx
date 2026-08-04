import { useState, useRef, useEffect } from 'react';
import { 
  FiSearch, 
  FiChevronDown, 
  FiPlusSquare, 
  FiBell, 
  FiTrendingUp, 
  FiUser,
  FiLogOut,
  FiPlus,
  FiX,
  FiHome
} from 'react-icons/fi';
import useLogout from '@/hook/useLogout';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const OwnerNavbar = () => {
  
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  const shops: string[] = [];

  const user = useSelector((state: RootState) => state.auth.user);
  const logOut = useLogout();


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node)) {
        setAvatarDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Left Section: Logo & Shop Selector */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-baseline font-bold text-2xl md:text-3xl tracking-tight cursor-pointer shrink-0">
            <span className="text-[#640a99]">zest</span>
            <span className="text-[#4b0b75] ml-1">Partner</span>
          </div>

          {/* Shop Dropdown */}
          <div className="relative hidden md:block" ref={shopDropdownRef}>
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              <FiHome className="mr-1.5 text-base shrink-0" />
              <span>Select Shop</span>
              <FiChevronDown className="ml-1 text-gray-500 text-lg" />
            </button>

            {shopDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                {shops.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">No shops yet</p>
                ) : (
                  shops.map((shop, i) => (
                    <button
                      key={i}
                      className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiHome className="mr-3 text-base shrink-0" />
                      {shop}
                    </button>
                  ))
                )}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-[#640a99] hover:bg-gray-50 transition-colors font-medium">
                    <FiPlus className="mr-3 text-base shrink-0" />
                    Create New Shop
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Search Bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-xl group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 h-12 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 sm:text-base transition-all"
              placeholder="Search for 'Order ID', 'Dish', or 'Customer'"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8 md:gap-8">
          {user ? (
            <>
              <div className="flex items-center gap-8 md:gap-6">
                {/* Mobile search toggle */}
                <button
                  className="flex md:hidden cursor-pointer flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  {searchOpen ? (
                    <FiX className="text-[26px]" strokeWidth={1.5} />
                  ) : (
                    <FiSearch className="text-[26px]" strokeWidth={1.5} />
                  )}
                </button>

                <button className="hidden md:flex cursor-pointer flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors">
                  <FiPlusSquare className="text-[26px] mb-1" strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold">Add Items</span>
                </button>

                <button className="flex cursor-pointer flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors relative">
                  <div className="relative mb-1">
                    <FiBell className="text-[26px]" strokeWidth={1.5} />
                    <span className="absolute -top-1.5 -right-2 bg-[#d93838] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      0
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold hidden md:inline">New Orders</span>
                </button>
              </div>

              {/* Avatar Dropdown */}
              <div className="relative" ref={avatarDropdownRef}>
                <button
                  onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                  className="flex cursor-pointer items-center space-x-2 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#640a99] text-white flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase() || <FiUser className="text-lg" />}
                    </div>
                  )}
                </button>

                {avatarDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <button className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiHome className="mr-3 text-base shrink-0" />
                      My Outlets
                    </button>
                    <button className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiTrendingUp className="mr-3 text-base shrink-0" />
                      Insights
                    </button>
                    <button className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-destructive hover:bg-gray-50 transition-colors " onClick={logOut}>
                      <FiLogOut className="mr-3 text-base shrink-0" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="flex cursor-pointer flex-col items-center text-gray-600 hover:text-[#640a99] transition-colors">
              <FiUser className="text-[26px] mb-1" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold">Login</span>
            </button>
          )}
        </div>
        
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-x-0 top-20 bottom-0 bg-black/50 backdrop-blur-xl z-40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed left-4 right-4 top-24 z-50">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FiSearch className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search for 'Order ID', 'Dish', or 'Customer'"
                className="flex h-14 w-full rounded-xl border border-gray-300 bg-white px-3 py-1 pl-12 text-base shadow-lg transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default OwnerNavbar;