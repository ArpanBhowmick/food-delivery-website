import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DishCard } from "@/components/user/DishCard";
import { useItemApi } from "@/hook/useItemApi";
import { useShopApi } from "@/hook/useShopApi";
import type { IItem } from "@/types/item.types";
import type { IShop } from "@/types/shop.types";
import { ArrowLeft, Clock, MapPin, Star, Share2, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mock Data
const MOCK_SHOP = {
  name: "The Golden Dragon",
  banner:
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1200",
  logo: "https://images.unsplash.com/photo-1580828369019-158102a28174?auto=format&fit=crop&q=80&w=200",
  rating: 4.8,
  reviews: "1.2k+",
  categories: "Chinese, Asian Fusion",
  location: "Sector V, Salt Lake, Kolkata",
  distance: "1.8 km",
  time: "20-30 min",
};

const CATEGORIES = [
  "Snacks",
  "Main Courses",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others",
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const { getPublicItemsByShop } = useItemApi();
  const { getPublicShopById } = useShopApi();

  const [items, setItems] = useState<IItem[]>([]);
  const [shop, setShop] = useState<IShop | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | "recommended">(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!shopId) return;

      try {
        const response = await getPublicItemsByShop(shopId);
        setItems(response.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [shopId]);

  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) return;

      try {
        const response = await getPublicShopById(shopId);
        setShop(response.shop);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, [shopId]);

  console.log("SHOP ID:", shopId);
  console.log("SHOP ITEMS:", items);
  console.log("SHOP:", shop);

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20 overflow-x-hidden">
      {/* 1. Hero / Banner Section */}
      <div className="relative h-[250px] md:h-[350px] w-full bg-black">
        <img
          src={shop?.image?.url ?? "/placeholder-shop.jpg"}
          alt={shop?.name ?? "Shop"}
          className="w-full h-full object-cover opacity-70"
        />

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors cursor-pointer">
              <Share2 size={20} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors cursor-pointer">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Shop Information / Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
          {/* Shop Logo */}
          {/* <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
            <img 
              src={MOCK_SHOP.logo} 
              alt={MOCK_SHOP.name}
              className="w-full h-full object-cover"
            />
          </div> */}

          {/* Shop Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                  {shop?.name ?? "Shop"}
                </h1>
                <p className="text-gray-500 font-medium text-sm mt-1">
                  {MOCK_SHOP.categories}
                </p>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 w-fit">
                <Star size={18} className="fill-green-600 text-green-600" />
                <span className="font-bold text-green-700">
                  {MOCK_SHOP.rating}
                </span>
                <span className="text-xs text-green-600 font-medium ml-1">
                  ({MOCK_SHOP.reviews})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#7e22ce]" />
                <span>
                  {shop?.address}, {shop?.city}, {shop?.state}
                </span>
              </div>
              <span className="hidden sm:inline text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#7e22ce]" />
                <span>{MOCK_SHOP.time}</span>
              </div>
              <span className="hidden sm:inline text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">{MOCK_SHOP.distance} away</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Our Menu Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveFilter("all");
              setSelectedCategory("");
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              activeFilter === "all" && !selectedCategory
                ? "bg-[#7e22ce] text-white"
                : "border border-gray-200 bg-white text-gray-600"
            }`}
          >
            All
          </button>

          <button
            onClick={() => {
              setActiveFilter("recommended");
              setSelectedCategory("");
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              activeFilter === "recommended"
                ? "bg-[#7e22ce] text-white"
                : "border border-gray-200 bg-white text-gray-600"
            }`}
          >
            Recommended
          </button>

          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setActiveFilter("all");
            }}
          >
            <SelectTrigger className="w-[170px] rounded-full bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Item Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_MENU.map((item) => (
            <div key={item.id} className="flex flex-col h-full overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
              
              <div className="relative h-48 w-full shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                
                {item.foodType === "veg" ? (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    Veg
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-rose-700 shadow-sm">
                    <span className="size-2 rounded-full bg-rose-500"></span>
                    Non-Veg
                  </span>
                )}
              </div>
              
              
              <div className="flex flex-col flex-1 p-5">
                <h3 className="mb-1.5 text-lg font-bold leading-tight text-gray-800 line-clamp-1">
                  {item.name}
                </h3>
                
                <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {item.description}
                </p>
                
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                  
                  <button className="px-5 py-2 rounded-xl bg-white text-[#7e22ce] border border-[#7e22ce] font-bold text-sm shadow-sm transition hover:bg-[#7e22ce] hover:text-white">
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}
        <div className="mt-10">
  <Carousel
    className="relative w-full overflow-visible"
    aria-label="Shop dishes"
  >
    <CarouselContent className="py-2">
      {items.map((item) => (
        <CarouselItem
          key={item._id}
          className="w-[220px] min-w-[220px] basis-auto sm:w-[240px] sm:min-w-[240px] lg:w-[260px] lg:min-w-[260px]"
        >
          <DishCard
            dish={{
              ...item,
              rating: 4.8,
            }}
          />
        </CarouselItem>
      ))}
    </CarouselContent>

    <CarouselPrevious className="left-2 z-10" />
    <CarouselNext className="right-2 z-10" />
  </Carousel>
</div>
      </div>
    </div>
  );
};

export default ShopPage;
