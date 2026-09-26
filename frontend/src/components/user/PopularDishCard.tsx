import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useItemApi } from "@/hook/useItemApi";
import type { RootState } from "@/store/store";
import type { IItem } from "@/types/item.types";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DishCard } from "./DishCard";

interface PopularDish extends IItem {
  rating: number;
}

interface PopularDishCardProps {
  selectedCategory: string | null;
}

const PopularDishCard = ({
  selectedCategory,
}: PopularDishCardProps) => {
  const city = useSelector((state: RootState) => state.location.city);

  const { getItemsByCity } = useItemApi();

  const [items, setItems] = useState<PopularDish[]>([]);

  const filteredItems = selectedCategory
  ? items.filter((item) => item.category === selectedCategory)
  : items;

  useEffect(() => {
    const fetchItems = async () => {
      if (!city) return;

      try {
        const response = await getItemsByCity(city);

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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Popular Dishes</h2>
        <button className="flex cursor-pointer items-center gap-1 rounded-full bg-purple-100/50 px-4 py-1.5 text-sm font-medium text-[#7e22ce] transition hover:bg-purple-100">
          View all <ChevronRight size={16} />
        </button>
      </div>

      <Carousel className="w-full" aria-label="Popular dishes">
        <CarouselContent>
          {filteredItems.map((item) => (
            <CarouselItem
              key={item._id}
              className="w-[220px] min-w-[220px] basis-auto sm:w-[240px] sm:min-w-[240px] lg:w-[260px] lg:min-w-[260px]"
            >
              <DishCard dish={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="inset-y-auto left-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
        <CarouselNext className="inset-y-auto right-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
      </Carousel>
    </div>
  );
};

export default PopularDishCard;
