import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/store/cartSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { IItem } from "@/types/item.types";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface DisplayItem extends IItem {
  rating: number;
}

interface DishCardProps {
  dish: DisplayItem;
}

export const DishCard = ({ dish }: DishCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((cartItem) => cartItem.item._id === dish._id),
  );

  const count = cartItem?.quantity ?? 0;

  return (
    <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 w-full shrink-0">
        <img
          src={dish.image?.url ?? "/placeholder-shop.jpg"}
          alt={dish.name}
          className="h-full w-full object-cover"
        />
        {dish.foodType === "veg" ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white/90 px-2 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            Veg
          </span>
        ) : (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white/90 px-2 py-1 text-xs font-bold text-rose-700 shadow-sm backdrop-blur-sm">
            <span className="size-2 rounded-full bg-rose-500"></span>
            Non-Veg
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-[#7e22ce] text-[#7e22ce]" />
            <span className="text-xs font-bold">{dish.rating}</span>
          </span>
          <span className="max-w-24 truncate rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
            {dish.category}
          </span>
        </div>

        <h3 className="mb-1.5 line-clamp-1 text-lg font-bold leading-tight text-gray-800">
          {dish.name}
        </h3>

        {dish.description && (
          <p className="mb-4 line-clamp-2 break-words text-sm leading-relaxed text-gray-500">
            {dish.description}
          </p>
        )}

        <div className="mt-auto flex h-14 shrink-0 items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <p className="text-lg font-bold text-gray-900">₹{dish.price}</p>
          {count === 0 ? (
            <button
              onClick={() => dispatch(addToCart(dish))}
              className="w-20 cursor-pointer rounded-xl bg-[#7e22ce] py-2 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(126,34,206,0.35)] transition duration-200 hover:bg-[#640a99]"
            >
              Add
            </button>
          ) : (
            <div className="flex w-24 items-center justify-between rounded-xl bg-[#7e22ce] py-1 font-bold text-white shadow-[4px_4px_0_0_rgba(126,34,206,0.35)]">
              <button
                onClick={() => dispatch(decreaseQuantity(dish._id))}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg leading-none hover:bg-white/10"
              >
                −
              </button>
              <span className="text-sm">{count}</span>
              <button
                onClick={() => dispatch(increaseQuantity(dish._id))}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg leading-none hover:bg-white/10"
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
