import type { IShop } from "@/types/shop.types";
import { MapPin, Store } from "lucide-react";
import { Link } from "react-router-dom";

interface ShopCardProps {
  shop: IShop;
}

const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm flex flex-col">
      {/* Card Header / Image Area */}
      <div className="h-32 relative border-b border-slate-100 overflow-hidden">
        {shop.image?.url ? (
          <img
            src={shop.image.url}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-100/50 flex items-center justify-center">
            <Store className="w-12 h-12 text-purple-400" />
          </div>
        )}

        {/* Later */}
        {/* {shop.isPublished ? null : (
          <span className="absolute top-3 right-3 bg-slate-200/80 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md">
            Draft
          </span>
        )} */}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3
          className="text-base font-bold text-slate-900 mb-3 truncate"
          title={shop.name}
        >
          {shop.name}
        </h3>

        <div className="space-y-1.5 mb-4 flex-1">
          <div className="flex items-start gap-2 text-slate-600 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#581c87] shrink-0 mt-0.5" />

            <div className="leading-tight">
              <p>{shop.address}</p>
              <p>
                {shop.city}, {shop.state}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Published
          </span>
        </div>

        {/* Card Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/owner/shop/${shop._id}/edit`}
            className="px-3 py-2 text-xs font-semibold text-center text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Edit Details
          </Link>

          <Link
            to={`/owner/shop/${shop._id}`}
            className="px-3 py-2 text-xs font-semibold text-center text-white bg-[#581c87] rounded-lg hover:bg-[#4c1775] transition-colors truncate"
          >
            View Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;