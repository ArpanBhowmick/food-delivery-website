import {
  BarChart3,
  ClipboardList,
  Settings,
  Store,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const OwnerSidebar = () => {
  const location = useLocation();

  return (
    <aside className="h-[calc(100vh-5rem)] w-16 flex-shrink-0 overflow-y-auto border-r border-gray-300 bg-white lg:w-64">
      <nav className="p-2 lg:p-4 space-y-1">

        {/* Dashboard */}
        {/* <Link
          to="/owner"
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            location.pathname === "/owner"
              ? "bg-[#581c87]/10 text-[#581c87]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="hidden lg:inline">Dashboard</span>
        </Link> */}

        {/* My Shops */}
        <Link
          to="/owner"
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            location.pathname === "/owner"
              ? "bg-[#581c87]/10 text-[#581c87]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Store size={20} />
          <span className="hidden lg:inline">My Shops</span>
        </Link>

        {/* Orders */}
        <Link
          to="/owner/orders"
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            location.pathname === "/owner/orders"
              ? "bg-[#581c87]/10 text-[#581c87]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <ClipboardList size={20} />
          <span className="hidden lg:inline">Orders</span>
        </Link>

        {/* Analytics */}
        <Link
          to="/owner/analytics"
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            location.pathname === "/owner/analytics"
              ? "bg-[#581c87]/10 text-[#581c87]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BarChart3 size={20} />
          <span className="hidden lg:inline">Analytics</span>
        </Link>

        {/* Settings */}
        <Link
          to="/owner/settings"
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            location.pathname === "/owner/settings"
              ? "bg-[#581c87]/10 text-[#581c87]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings size={20} />
          <span className="hidden lg:inline">Settings</span>
        </Link>

      </nav>
    </aside>
  );
};

export default OwnerSidebar;