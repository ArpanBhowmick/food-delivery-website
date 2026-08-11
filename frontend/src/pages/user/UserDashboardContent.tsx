import heroImage from "../../assets/hero.jpg";

import CheckoutCard from "../../components/user/CheckoutCard";
import CategoryCard from "@/components/user/CategoryCard";
import PopularDishCard from "@/components/user/PopularDishCard";
import RecentOrderCard from "@/components/user/RecentOrderCard";
import BestShopCard from "@/components/user/BestShopCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const UserDashboardContent = () => {

const city = useSelector((state:  RootState) => state.location.city)






  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 lg:p-10 font-sans text-gray-800 flex justify-center">
      <div className="max-w-[1440px] w-full grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Content */}
        <div className="xl:col-span-8 2xl:col-span-9 space-y-10">
          {/* Hero Section */}
          <div className="relative bg-[#1a1311] rounded-[2rem] p-8 md:p-12 overflow-hidden flex items-center min-h-[300px]">
            {/* Image Container with Blending Effect */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[75%] z-0">
              <img
                src={heroImage}
                alt="Delicious Burger"
                className="object-cover object-right-center w-full h-full"
              />
              {/* This gradient overlay creates the smooth fade effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1311] from-10% via-[#1a1311]/80 to-transparent"></div>
            </div>

            {/* Hero Text Content */}
            <div className="relative z-10 w-full md:w-3/5 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                You're live to eat <br /> Not eat to live
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-md line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
              <button className="mt-4 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-200 cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          {/* Category Section */}
          <CategoryCard />

          {/* best shops in city */}
          <BestShopCard city={city} />

          {/* Popular Dishes Section */}
          <PopularDishCard />

          {/* Recent Orders Section */}
          <RecentOrderCard />
        </div>

        {/* RIGHT COLUMN: Sidebar / Order Menu */}
        <CheckoutCard />
      </div>
    </div>
  );
};

export default UserDashboardContent;
