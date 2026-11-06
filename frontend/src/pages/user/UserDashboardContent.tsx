import CategoryCard from "@/components/user/CategoryCard";
import PopularDishCard from "@/components/user/PopularDishCard";
import RecentOrderCard from "@/components/user/RecentOrderCard";
import BestShopCard from "@/components/user/BestShopCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";
import UserHero from "@/components/user/UserHero";
// import UserActiveOrder from "@/components/user/trackOrder/StatusStepper";
import UserFooter from "@/components/user/UserFooter";
import StatusStepper from "@/components/user/trackOrder/StatusStepper";

const UserDashboardContent = () => {
  const city = useSelector((state: RootState) => state.location.city);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 sm:p-6 lg:p-10 font-sans text-gray-800 flex justify-center overflow-x-clip">
      <div className="max-w-[1440px] w-full grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT COLUMN: Main Content */}
        <div className="xl:col-span-12 space-y-8 lg:space-y-10 min-w-0">
          {/* Hero Section */}
    
          <UserHero />

          {/* track stepper  */}

          <StatusStepper />

          {/* Category Section */}
          <CategoryCard
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* best shops in city */}
          <BestShopCard city={city} />

          {/* Popular Dishes Section */}
          <PopularDishCard selectedCategory={selectedCategory} />

          {/* Recent Orders Section */}
          <RecentOrderCard />

          <UserFooter/>
        </div>

        {/* RIGHT COLUMN: Sidebar / Order Menu */}
        {/* <CheckoutCard /> */}
      </div>
    </div>
  );
};

export default UserDashboardContent;
