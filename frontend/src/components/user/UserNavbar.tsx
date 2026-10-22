import { Search, ChevronDown, X } from "lucide-react";
import { LuCircleUser } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useLogout from "@/hook/useLogout";
import CartDrawer from "./cart/CartDrawer";
import AddressModal from "@/components/user/location/AddressModal";
import CheckoutDrawer from "./CheckoutDrawer";
import { useSearchApi } from "@/hook/useSearchApi";
import SearchResults from "./searchbar/SearchResults";

export default function UserNavbar() {
  const { search } = useSearchApi();

  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<{
    shops: any[];
    items: any[];
  }>({
    shops: [],
    items: [],
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const location = useSelector((state: RootState) => state.location);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemTotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0,
  );

  const deliveryFee = itemTotal > 500 ? 0 : 40;

  console.log("📍 Navbar location:", location);

  const cartCount = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0,
  );

  const logOut = useLogout();

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

  const handleSearch = useCallback(
  async (value: string) => {
    if (!value.trim()) {
      setSearchResults({ shops: [], items: [] });
      return;
    }

    try {
      const results = await search(value.trim());

      setSearchResults({
        shops: results.shops,
        items: results.items,
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  },
  [search],
);


  // debouncing for search 
  useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults({ shops: [], items: [] });
    return;
  }

  const timer = setTimeout(() => {
    handleSearch(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery, handleSearch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-[1440px] mx-auto w-full">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for "chocolate box"'
                className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-12 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />

              {/* Desktop Search Results */}
              {(searchResults.shops.length > 0 ||
                searchResults.items.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <SearchResults
                    results={searchResults}
                    onClose={() => {
                      setSearchResults({ shops: [], items: [] });
                      setSearchQuery("");
                    }}
                  />
                </div>
              )}
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

            <Link
              to="/account"
              className="hidden md:flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#7E22CE] hover:opacity-90 transition-opacity px-3 py-2.5 rounded-md cursor-pointer"
            >
              My Orders
            </Link>

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for "chocolate box"'
                className="flex h-14 w-full rounded-xl border border-border bg-white px-3 py-1 pl-12 text-base shadow-lg transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                autoFocus
              />
            </div>

            {/* Mobile Search Results */}
            {(searchResults.shops.length > 0 ||
              searchResults.items.length > 0) && (
              <div className="mt-2 w-full">
                <SearchResults
                  results={searchResults}
                  onClose={() => {
                    setSearchResults({ shops: [], items: [] });
                    setSearchQuery("");
                    setSearchOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/* Location modal */}
      {locationOpen && (
        <AddressModal onClose={() => setLocationOpen(false)} />
      )}

      <header>
        <CartDrawer
          open={cartOpen}
          onOpenChange={setCartOpen}
          onCheckout={() => {
  setCartOpen(false);
  setCheckoutOpen(true);
}}
          cartItems={cartItems}
          itemTotal={itemTotal}
          deliveryFee={deliveryFee}
        />

        <CheckoutDrawer
  isCheckoutOpen={checkoutOpen}
  onOpenChange={setCheckoutOpen}
  onBack={() => {
    setCheckoutOpen(false);
    setCartOpen(true);
  }}
  cartItems={cartItems}
  itemTotal={itemTotal}
  deliveryFee={deliveryFee}
  onCloseCart={() => setCartOpen(false)}
  onOpenCart={() => setCartOpen(true)}
/>
      </header>
    </header>
  );
}
