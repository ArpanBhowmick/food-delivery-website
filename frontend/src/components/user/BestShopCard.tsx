import { useShopApi } from "@/hook/useShopApi";
import useHorizontalOverflow from "@/hook/useHorizontalOverflow";
import type { IShop } from "@/types/shop.types";
import { ChevronRight, Clock, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";

type DisplayShop = IShop & {
  rating: number;
  tags: string;
  distance: string;
  time: string;
};

const BestShopCard = ({ city = "Kolkata" }) => {
  // Dummy data for shops
  // const shops = [
  //   {
  //     name: "Bella Italia",
  //     rating: 4.9,
  //     tags: "Italian, Pizza, Pasta",
  //     distance: "2.1 km",
  //     time: "25 min",
  //     img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400"
  //   },
  //   {
  //     name: "Spice Symphony",
  //     rating: 4.7,
  //     tags: "North Indian, Mughlai",
  //     distance: "3.5 km",
  //     time: "35 min",
  //     img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400"
  //   },
  //   {
  //     name: "The Golden Dragon",
  //     rating: 4.8,
  //     tags: "Chinese, Asian Fusion",
  //     distance: "1.8 km",
  //     time: "20 min",
  //     img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=400"
  //   }
  // ];

  const { getShopsByCity } = useShopApi();

  const [shops, setShops] = useState<DisplayShop[]>([]);


  useEffect(() => {
    const fetchShops = async () => {
      if (!city) return;

      try {
        const response = await getShopsByCity(city);

        const shopsWithDisplayData = response.shops.map((shop: IShop) => ({
          ...shop,
          rating: 4.8,
          tags: "North Indian, Mughlai",
          distance: "2.1 km",
          time: "25 min",
        }));

        setShops(shopsWithDisplayData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShops();
  }, [city]);

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Best Shops in {city}
        </h2>
        
          <button className="text-sm font-medium text-[#7e22ce] bg-purple-100/50 px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-100 transition cursor-pointer">
            View all <ChevronRight size={16} />
          </button>
        
      </div>

      {/* Shops Grid */}
      <div>
        <div
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 xl:grid xl:grid-cols-4 xl:gap-6 xl:overflow-visible xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-[290px] min-w-[240px] snap-start sm:min-w-0 xl:min-w-0 xl:w-full"
            >
            {/* Image Container with Rating Badge */}
            <div className="relative">
              <img
                src={shop.image?.url}
                alt={shop.name}
                className="w-full h-44 object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                <Star size={12} className="fill-[#7e22ce] text-[#7e22ce]" />
                {shop.rating}
              </div>
            </div>

            {/* Shop Details */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                {shop.name}
              </h3>
              <p className="text-gray-400 text-xs font-medium mb-3 truncate">
                {shop.tags}
              </p>

              {/* Distance & Time Footer */}
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mt-auto pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#7e22ce]" />
                  <span>{shop.distance}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-[#7e22ce]" />
                  <span>{shop.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default BestShopCard;
