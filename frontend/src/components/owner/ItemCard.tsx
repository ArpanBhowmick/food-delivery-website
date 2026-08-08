import type { IItem } from "@/types/item.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, PenLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useItemApi } from "@/hook/useItemApi";
import { removeItem } from "@/store/ItemSlice";
import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

interface ItemCardProps {
  item: IItem;
  shopId: string;
}


const ItemCard = ({ item, shopId }: ItemCardProps) => {

 const { deleteItem } = useItemApi();
const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
  try {
    await deleteItem(shopId, item._id);

    dispatch(removeItem(item._id));
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="relative bg-white rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row w-full">

      {/* Left: Food Image (fixed width, fills card height, no white space) */}
      <div className="relative w-full sm:w-48 shrink-0 h-40 sm:h-auto bg-slate-100">
        <img
          src={item.image?.url ?? "/placeholder-shop.jpg"}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      {/* Availability badge (top-right of card) */}
      {item.isAvailable ? (
        <Badge className="absolute top-3 right-3 bg-green-100 text-green-700 border-green-200 shadow-sm">
          Available
        </Badge>
      ) : (
        <Badge className="absolute top-3 right-3 bg-slate-100 text-slate-500 border-slate-200 shadow-sm">
          Out of Stock
        </Badge>
      )}

      {/* Right: Item Information */}
      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 truncate pr-16 sm:pr-24">
          {item.name}
        </h3>

        <div className="mt-1.5 flex items-center text-xl sm:text-2xl font-bold text-slate-900">
          <IndianRupee size={20} className="mr-0.5" />
          <span>{item.price}</span>
        </div>

        {/* Badges: Category, Food Type */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100">
            {item.category}
          </Badge>

          {item.foodType === "veg" ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
              <span className="size-1.5 rounded-full bg-emerald-500 mr-1" />
              Veg
            </Badge>
          ) : (
            <Badge className="bg-rose-50 text-rose-700 border-rose-100">
              <span className="size-1.5 rounded-full bg-rose-500 mr-1" />
              Non-Veg
            </Badge>
          )}
        </div>

        {item.description && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        {/* Edit / Delete actions (bottom-right) */}
        <div className="mt-auto pt-3 flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon">
            <Link to={`/owner/shop/${item.shop}/item/edit/${item._id}`}>
              <PenLine />
            </Link>
          </Button>
          <Button
          onClick={handleDelete}
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${item.name}`}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
