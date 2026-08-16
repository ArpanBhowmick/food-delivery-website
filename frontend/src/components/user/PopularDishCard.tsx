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

// const popularDishes: PopularDish[] = [
//   {
//     _id: "1",
//     name: "Gourmet Truffle Pasta",
//     description:
//       "Creamy fettuccine tossed in a rich truffle sauce with parmesan.",
//     price: 12.99,
//     rating: 4.8,
//     category: "Main Courses",
//     foodType: "non-veg",
//     isAvailable: true,
//     image: {
//       url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400",
//       publicId: "",
//     },
//     shop: "1",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
//   {
//     _id: "2",
//     name: "Crispy Peking Duck",
//     description: "Slow-roasted duck with golden crispy skin and hoisin glaze.",
//     price: 12.99,
//     rating: 5.0,
//     category: "Main Courses",
//     foodType: "non-veg",
//     isAvailable: true,
//     image: {
//       url: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=400",
//       publicId: "",
//     },
//     shop: "1",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
//   {
//     _id: "3",
//     name: "Sushi Deluxe Platter",
//     description: "Assorted fresh nigiri and maki rolls served with wasabi.",
//     price: 6.99,
//     rating: 4.9,
//     category: "Snacks",
//     foodType: "veg",
//     isAvailable: true,
//     image: {
//       url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
//       publicId: "",
//     },
//     shop: "1",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
//   {
//     _id: "4",
//     name: "Mediterranean Lamb Kebab",
//     description: "Flame-grilled lamb skewers with tzatziki and flatbread.",
//     price: 5.99,
//     rating: 4.8,
//     category: "Fast Food",
//     foodType: "non-veg",
//     isAvailable: true,
//     image: {
//       url: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400",
//       publicId: "",
//     },
//     shop: "1",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
// ];

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
