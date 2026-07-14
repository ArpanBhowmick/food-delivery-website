import { Search, ChevronDown } from 'lucide-react';
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";



export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      {/* Container with a slightly larger height to match the reference */}
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Left Section: Logo and Location Select */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
            {/* Using standard text styling to mimic the logo. 
                Replace with an <img /> tag if you have the actual SVG logo */}
            <span className="text-4xl font-extrabold tracking-tighter text-[#7e22ce]">
              zepto
            </span>
          </a>

          {/* Location Dropdown Trigger */}
          <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Select Location
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 max-w-3xl px-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            {/* Styled to match standard shadcn/ui Input but with a taller height (h-12) */}
            <input
              type="text"
              placeholder='Search for "chocolate box"'
              className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-12 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>


        {/* Right Section: Actions (Login & Cart) */}
        <div className="flex items-center gap-8">
          <button className="flex flex-col items-center justify-center gap-1 text-foreground hover:opacity-80 transition-opacity">
            <FaRegUserCircle className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[11px] font-medium leading-none">Login</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-1 text-foreground hover:opacity-80 transition-opacity">
            <AiOutlineShoppingCart  className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[11px] font-medium leading-none">Cart</span>
          </button>
        </div>

      </div>
    </header>
  );
}