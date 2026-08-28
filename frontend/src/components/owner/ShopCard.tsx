

import type { IShop } from "@/types/shop.types";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";



interface ShopCardProps {
  shop: IShop;
}

const status = "Active";
const rating = 4.8;
const revenue = "$24.5k";
const orders = "1,120";
const cuisine = "Italian";
const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={shop.image?.url}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
            status === "Active"
              ? "bg-[#c6f6d5] text-[#22543d]"
              : "bg-[#fed7d7] text-[#822727]"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold">{shop.name}</h3>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              status === "Active"
                ? "bg-[#c6f6d5] text-[#22543d]"
                : "bg-[#fed7d7] text-[#822727]"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="text-sm text-gray-800 mb-4">
          <p>{shop.address}</p>
          <p>Cuisine: {cuisine}</p>
        </div>

        <div className="flex flex-wrap items-center text-xs sm:text-sm font-medium gap-y-1">
          <span>{rating}</span>
          <Star
            size={14}
            className="text-yellow-400 fill-yellow-400 ml-1 mr-2 shrink-0"
          />
          <span className="text-gray-300 mx-1">|</span>
          <span className="mx-1">{revenue} Revenue</span>
          <span className="text-gray-300 mx-1">|</span>
          <span className="ml-1">{orders} Orders</span>
        </div>
      </div>

      {/* Card Actions (Footer) */}
      <div className="grid grid-cols-2 gap-3 border-t border-gray-300 p-3">
        <Link
          to={`/owner/shop/${shop._id}`}
          className="py-2 flex justify-center items-center text-slate-700 border border-gray-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Manage Shop
        </Link>
        <Link
          to={`/owner/shop/edit/${shop._id}`}
          className="py-2 flex justify-center items-center text-slate-700 border border-gray-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Edit Detail
        </Link>
      </div>
    </div>
    
  );
};

export default ShopCard;
