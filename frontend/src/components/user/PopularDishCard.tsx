import { useItemApi } from "@/hook/useItemApi";
import type { RootState } from "@/store/store";
import type { IItem } from "@/types/item.types";
import { ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DishCard } from "./DishCard";

interface PopularDish extends IItem {
  rating: number;
}



const PopularDishCard = () => {
  const city = useSelector((state: RootState) => state.location.city);

  const { getItemsByCity } = useItemApi();

  const [items, setItems] = useState<PopularDish[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!city) return;

      try {
        const response = await getItemsByCity(city );

        console.log("ITEMS FROM API:", response.items);

        const itemsWithDisplayData = response.items.map((item: IItem) => ({
          ...item,
          rating: 4.8,
        }));

        setItems(itemsWithDisplayData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [city]);

  return (
    <>
      {/* Popular Dishes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Dishes</h2>
          <button className="text-sm font-medium text-[#7e22ce] bg-purple-100/50 px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-100 transition cursor-pointer">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <DishCard key={item._id} dish={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularDishCard;
