import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import burger from "../../assets/burger.png";
import softDrink from "../../assets/softDrink1.png";
import croissant from "../../assets/crosaint.png";
import {
  Cake,
  ChevronRight,
  Cookie,
  Drumstick,
  Flame,
  LayoutGrid,
  MoreHorizontal,
  Pizza,
  Sandwich,
  Soup,
  Wheat,
  Zap,
} from "lucide-react";
interface CategoryCardProps {
  onCategorySelect: (category: string | null) => void;
}

type Category = {
  name: string;
  value: string | null;
  image?: string;
  icon?: typeof Cookie;
};

type CardTone = {
  surface: string;
  border: string;
  label: string;
  glyph: string;
};

const tonePalette: CardTone[] = [
  {
    surface: "bg-orange-50",
    border: "border-orange-100",
    label: "text-orange-900",
    glyph: "text-orange-300",
  },
  {
    surface: "bg-violet-50",
    border: "border-violet-100",
    label: "text-violet-900",
    glyph: "text-violet-300",
  },
  {
    surface: "bg-sky-50",
    border: "border-sky-100",
    label: "text-sky-900",
    glyph: "text-sky-300",
  },
  {
    surface: "bg-emerald-50",
    border: "border-emerald-100",
    label: "text-emerald-900",
    glyph: "text-emerald-300",
  },
  {
    surface: "bg-amber-50",
    border: "border-amber-100",
    label: "text-amber-900",
    glyph: "text-amber-300",
  },
  {
    surface: "bg-rose-50",
    border: "border-rose-100",
    label: "text-rose-900",
    glyph: "text-rose-300",
  },
];

const categories: Category[] = [
  { name: "All", value: null, icon: LayoutGrid },
  { name: "Bakery", value: "Bakery", image: croissant },
  { name: "Burger", value: "Burger", image: burger },
  { name: "Beverages", value: "Beverages", image: softDrink },
  { name: "Snacks", value: "Snacks", icon: Cookie },
  { name: "Main Course", value: "Main Course", icon: Drumstick },
  { name: "Dessert", value: "Dessert", icon: Cake },
  { name: "Pizza", value: "Pizza", icon: Pizza },
  { name: "Sandwich", value: "Sandwich", icon: Sandwich },
  { name: "North Indian", value: "North Indian", icon: Flame },
  { name: "South Indian", value: "South Indian", icon: Wheat },
  { name: "Chinese", value: "Chinese", icon: Soup },
  { name: "Fast Food", value: "Fast Food", icon: Zap },
  { name: "Others", value: "Others", icon: MoreHorizontal },
];

const CategoryCard = ({ onCategorySelect }: CategoryCardProps) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Category</h2>
        <button className="flex cursor-pointer items-center gap-1 rounded-full bg-orange-100/50 px-4 py-1.5 text-sm font-medium text-orange-500 transition hover:bg-orange-100">
          View all <ChevronRight size={16} />
        </button>
      </div>

      <Carousel className="w-full" aria-label="Categories">
        <CarouselContent>
          {categories.map(({ name, value, image, icon: Icon }, index) => {
            const tone = tonePalette[index % tonePalette.length];

            return (
              <CarouselItem
                key={name}
                className="min-w-[200px] basis-[70%] sm:basis-[50%] md:basis-[33%] lg:basis-[24%] xl:basis-[18.2%]"
              >
                <div
                  onClick={() => onCategorySelect(value)}
                  className={`group flex h-36 cursor-pointer items-center gap-1 overflow-hidden rounded-3xl border p-4 shadow-xs transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${tone.surface} ${tone.border}`}
                >
                  <h3
                    className={`min-w-0 flex-1 text-lg font-bold leading-tight md:text-xl ${tone.label}`}
                  >
                    {name}
                  </h3>

                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="h-20 w-20 shrink-0 object-contain drop-shadow-sm transition duration-300 group-hover:scale-110 sm:h-24 sm:w-24"
                    />
                  ) : Icon ? (
                    <Icon
                      aria-hidden="true"
                      className={`h-16 w-16 shrink-0 transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20 ${tone.glyph}`}
                    />
                  ) : null}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="inset-y-auto left-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
        <CarouselNext className="inset-y-auto right-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
      </Carousel>
    </div>
  );
};

export default CategoryCard;
