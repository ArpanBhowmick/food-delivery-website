import AccountSidebar from "@/components/user/account/AccountSidebar";
import MyOrders from "@/components/user/account/MyOrders";

export default function Account() {
  return (
    <div className="h-screen overflow-hidden bg-[#f4f6f9] p-4 md:p-8 font-sans">
      <div className="h-full max-w-6xl mx-auto flex min-h-0 flex-col md:flex-row gap-8 border border-slate-200 rounded-2xl bg-white p-4 md:p-8">
        {/* Left Sidebar */}

        <AccountSidebar />

        {/* order list */}

        <MyOrders />
      </div>
    </div>
  );
}
