import React from 'react'
import burger from "../../assets/burger.png";
import softDrink from "../../assets/softDrink1.png";
import croissant from "../../assets/crosaint.png";
import { ChevronRight } from 'lucide-react';
import useHorizontalOverflow from "@/hook/useHorizontalOverflow";

const CategoryCard = () => {
  const { ref, hasOverflow } = useHorizontalOverflow<HTMLDivElement>();

  return (
    
    <>
    
    {/* Category Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Category</h2>
              {hasOverflow && (
              <button className="text-sm font-medium text-orange-500 bg-orange-100/50 px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-orange-100 transition cursor-pointer">
                View all <ChevronRight size={16} />
              </button>
              )}
            </div>

            <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Bakery */}
              <div className="relative bg-[#4a1215] rounded-3xl h-40 overflow-hidden group cursor-pointer flex items-center min-w-[280px] snap-start md:min-w-0">
                <div className="relative z-10 pl-6 w-1/2">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    Bakery
                  </h3>
                </div>
                <img
                  // src={bakery}
                  src={croissant}
                  alt="Bakery"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-40 h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Burger */}
              <div className="relative bg-[#f07b22] rounded-3xl h-40 overflow-hidden group cursor-pointer flex items-center min-w-[280px] snap-start md:min-w-0">
                <div className="relative z-10 pl-6 w-1/2">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    Burger
                  </h3>
                </div>
                <img
                  src={burger}
                  alt="Burger"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-40 h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Beverage */}
              <div className="relative bg-[#d6270e] rounded-3xl h-40 overflow-hidden group cursor-pointer flex items-center min-w-[280px] snap-start md:min-w-0">
                <div className="relative z-10 pl-6 w-1/2">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    Beverage
                  </h3>
                </div>
                <img
                  src={softDrink}
                  alt="Beverage"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition duration-300"
                />
              </div>
            </div>
          </div>

    </>
    
  )
}

export default CategoryCard