import type { IItem } from "@/types/item.types";
import { Star } from "lucide-react";
import { useState } from "react";

interface DisplayItem extends IItem {
  rating: number;
}

interface DishCardProps {
  dish: DisplayItem;
}

export const DishCard = ({ dish }: DishCardProps) => {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-[340px]">
      <div className="relative shrink-0">
        <img
          src={dish.image?.url ?? "/placeholder-shop.jpg"}
          alt={dish.name}
          className="w-full h-44 object-cover rounded-t-lg rounded-b-2xl"
        />
        {dish.foodType === "veg" ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 rounded-md px-1.5 py-0.5 shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Veg
          </span>
        ) : (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-white border border-rose-200 rounded-md px-1.5 py-0.5 shadow-sm">
            <span className="size-1.5 rounded-full bg-rose-500"></span>
            Non-Veg
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-bold">{dish.rating}</span>
          </span>
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
            {dish.category}
          </span>
        </div>
        <h3 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-1">
          {dish.name}
        </h3>
        {dish.description && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-2 break-words">
            {dish.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-orange-500 font-bold">${dish.price}</p>
          {count === 0 ? (
            <button
              onClick={() => setCount(1)}
              className="w-20 bg-[#f09319] hover:bg-orange-500 text-white text-sm font-bold rounded-xl py-2 transition duration-200 shadow-[4px_4px_0_0_rgba(240,147,25,0.35)] cursor-pointer"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#f09319] text-white font-bold rounded-xl w-24 py-1 shadow-[4px_4px_0_0_rgba(240,147,25,0.35)]">
              <button
                onClick={() => setCount((c) => (c > 1 ? c - 1 : 0))}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg leading-none cursor-pointer"
              >
                −
              </button>
              <span className="text-sm">{count}</span>
              <button
                onClick={() => setCount((c) => c + 1)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg leading-none cursor-pointer"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
