// import { useShopApi } from "@/hook/useShopApi";

// import type { IShop } from "@/types/shop.types";
// import { ChevronRight, Clock, MapPin, Star } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// type DisplayShop = IShop & {
//   rating: number;
//   tags: string;
//   distance: string;
//   time: string;
// };

// const BestShopCard = ({ city = "Kolkata" }) => {
//   const navigate = useNavigate();

//   const { getShopsByCity } = useShopApi();

//   const [shops, setShops] = useState<DisplayShop[]>([]);

//   useEffect(() => {
//     const fetchShops = async () => {
//       if (!city) return;

//       try {
//         const response = await getShopsByCity(city);

//         const shopsWithDisplayData = response.shops.map((shop: IShop) => ({
//           ...shop,
//           rating: 4.8,
//           tags: "North Indian, Mughlai",
//           distance: "2.1 km",
//           time: "25 min",
//         }));

//         setShops(shopsWithDisplayData);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchShops();
//   }, [city]);

//   return (
//     <div className="mt-10">
//       {/* Section Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold text-gray-800">
//           Best Shops in {city}
//         </h2>

//         <button className="text-sm font-medium text-[#7e22ce] bg-purple-100/50 px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-100 transition cursor-pointer">
//           View all <ChevronRight size={16} />
//         </button>
//       </div>

//       {/* Shops Grid */}
//       <div>
//         <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 xl:grid xl:grid-cols-4 xl:gap-6 xl:overflow-visible xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {shops.map((shop) => (
//             <div
//               key={shop._id}
//               onClick={() => navigate(`/shop/${shop._id}`)}
//               className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-[290px] min-w-[240px] snap-start sm:min-w-0 xl:min-w-0 xl:w-full"
//             >
//               {/* Image Container with Rating Badge */}
//               <div className="relative">
//                 <img
//                   src={shop.image?.url}
//                   alt={shop.name}
//                   className="w-full h-44 object-cover"
//                 />
//                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
//                   <Star size={12} className="fill-[#7e22ce] text-[#7e22ce]" />
//                   {shop.rating}
//                 </div>
//               </div>

//               {/* Shop Details */}
//               <div className="p-4 flex flex-col flex-1">
//                 <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
//                   {shop.name}
//                 </h3>
//                 <p className="text-gray-400 text-xs font-medium mb-3 truncate">
//                   {shop.tags}
//                 </p>

//                 {/* Distance & Time Footer */}
//                 <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mt-auto pt-2 border-t border-gray-100">
//                   <div className="flex items-center gap-1">
//                     <MapPin size={14} className="text-[#7e22ce]" />
//                     <span>{shop.distance}</span>
//                   </div>
//                   <span className="text-gray-300">•</span>
//                   <div className="flex items-center gap-1">
//                     <Clock size={14} className="text-[#7e22ce]" />
//                     <span>{shop.time}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

























































import { useShopApi } from "@/hook/useShopApi";
import type { IShop } from "@/types/shop.types";
import { Clock, MapPin, Navigation2, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type DisplayShop = IShop & {
  rating: number;
  tags: string;
  distance: string;
  time: string;
};

const BestShopCard = ({ city = "Kolkata" }) => {
  const navigate = useNavigate();

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
    <section
      id="restaurants-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-4"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[22px] font-extrabold text-[#0f172a] tracking-tight">
            Restaurants Near You
          </h2>
          <p className="text-[13px] text-slate-500">
            Top-rated neighborhood kitchens delivering to {city}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[#6d28d9] font-bold text-[14px]">
          <MapPin className="w-4 h-4" />
          <span className="truncate max-w-[200px]">{city}</span>
        </div>
      </div>

      {/* 4 Columns Desktop Grid */}
      {shops.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-purple-100 space-y-3">
          <Store className="w-12 h-12 text-purple-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-lg">
            No restaurants available in {city}
          </h4>
          <p className="text-sm text-slate-500">
            Please check back later for kitchens near you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/shop/${shop._id}`)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/10 border border-purple-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-purple-50 shrink-0">
                <img
                  src={shop.image?.url}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full shadow-xs border bg-white/95 border-purple-100 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#6d28d9]">
                    {shop.rating} ★
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-[17px] font-bold text-[#0f172a] group-hover:text-[#6d28d9] transition-colors truncate">
                    {shop.name}
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed  overflow-hidden line-clamp-2">
                    {shop.tags}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-purple-100/60 text-[12px] text-slate-500 font-medium mt-3">
                  <span className="flex items-center gap-1.5">
                    <Navigation2 className="w-4 h-4 text-[#6d28d9]" />
                    {shop.distance}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#6d28d9]" />
                    {shop.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BestShopCard;
