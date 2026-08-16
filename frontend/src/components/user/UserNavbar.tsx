import { Search, ChevronDown, X, Navigation } from "lucide-react";
import { GrMapLocation } from "react-icons/gr";
import { LuCircleUser } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useLogout from "@/hook/useLogout";
import useLocation from "@/hook/useLocation";
import CartDrawer from "./CartDrawer";

export default function UserNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [cartOpen, setCartOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const location = useSelector((state: RootState) => state.location);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartCount = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0,
  );

  const logOut = useLogout();
  const getCurrentLocation = useLocation();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownOpen) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        {/* Left Section: Logo and Location Select */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center">
            <span className="text-4xl font-extrabold tracking-tighter text-[#7e22ce]">
              Zest
            </span>
          </a>

          <button
            className="hidden cursor-pointer items-center gap-1 md:flex"
            onClick={() => setLocationOpen(true)}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground">
                Delivery in 20 minutes
              </span>

              <span className="max-w-[220px] truncate text-xs text-muted-foreground">
                {location.address || "Select Location"}
              </span>
            </div>

            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Center Section: Search Bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-3xl px-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder='Search for "chocolate box"'
              className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-12 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-8">
          {/* Mobile search toggle */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1 text-[#080808] hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? (
              <X className="h-6 w-6 stroke-[1.5]" />
            ) : (
              <Search className="h-6 w-6 stroke-[1.5]" />
            )}
            {/* <span className="text-[11px] font-medium leading-none">
              {searchOpen ? "Close" : "Search"}
            </span> */}
          </button>

          <button className="hidden md:flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#7E22CE] hover:opacity-90 transition-opacity px-3 py-2.5 rounded-md cursor-pointer">
            My Orders
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-[#640a99] transition-colors cursor-pointer"
          >
            <div className="relative">
              <IoCartOutline className="text-[26px] stroke-[1.5]" />

              <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#7E22CE] rounded-full">
                {cartCount}
              </span>
            </div>
          </button>

          {/* <Link to="/signin" className="flex flex-col items-center justify-center gap-1 text-[#080808] hover:opacity-80 transition-opacity">
            <LuCircleUser className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[11px] font-medium leading-none">Login</span>
          </Link> */}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex flex-col items-center justify-center gap-1 text-[#080808] hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar ?? ""} />
                  <AvatarFallback className="bg-[#7E22CE] text-white font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-50 py-2">
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      Hello, {user.name.split(" ")[0]}
                    </p>
                  </div>
                  <div className="md:hidden">
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Orders
                    </button>
                  </div>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-destructive hover:bg-muted transition-colors cursor-pointer"
                    onClick={logOut}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex flex-col items-center justify-center gap-1 text-[#080808] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <LuCircleUser className="h-6 w-6 stroke-[1.5]" />
              <span className="text-[11px] font-medium leading-none">
                Login
              </span>
            </Link>
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder='Search for "chocolate box"'
                className="flex h-14 w-full rounded-xl border border-border bg-white px-3 py-1 pl-12 text-base shadow-lg transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
      {/* Location modal */}
      {locationOpen && (
        <div>
          {/* Background Overlay - Added a subtle blur for a premium feel */}
          <div className="fixed inset-0 z-50 bg-black/40 " />

          {/* Modal Wrapper */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setLocationOpen(false)}
          >
            {/* Modal Content - Increased border radius to rounded-3xl for the app look */}
            <div
              className="relative w-full max-w-[340px] rounded-[24px] border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Absolute Close Button */}
              <button
                className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setLocationOpen(false)}
              >
                <X className="h-5 w-5 stroke-[2]" />
              </button>

              {/* Header Section: Icon & Title */}
              <div className="mt-4 flex flex-col items-center text-center mb-8">
                <div className="mb-4 flex flex-col items-center justify-center">
                  <GrMapLocation
                    className="h-10 w-10 text-[#7e22ce]"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-xl font-bold leading-tight text-foreground">
                  Choose your
                  <br />
                  delivery address
                </h2>
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3">
                {/* Use Current Location Button - Rounded full, text left, icon right */}
                <button
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#7e22ce] py-3.5 text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  onClick={async () => {
                    const success = await getCurrentLocation();

                    if (success) {
                      setLocationOpen(false);
                    }
                  }}
                >
                  Use Current Location
                  <Navigation className="h-4 w-4" fill="currentColor" />
                </button>

                {/* Search Input - Rounded full to match */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your address"
                    className="flex h-12.5 w-full rounded-full border border-[#aaa] bg-transparent px-3 py-1 pl-11 pr-4 text-sm text-foreground shadow-md  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7e22ce]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <header>
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </header>
      
    </header>
  );
}
