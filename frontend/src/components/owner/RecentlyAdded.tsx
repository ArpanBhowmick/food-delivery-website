import type { IShop } from "@/types/shop.types";
import { Store } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentlyAddedProps {
  shops: IShop[];
}

const RecentlyAdded = ({shops}: RecentlyAddedProps) => {

    const recentShops = [...shops]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 2);

  return (
    <>
      {/* Recently Added */}
      <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm mb-4">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Recently Added
        </h2>

        <div className="space-y-4">
  {recentShops.map((shop) => (
    <div key={shop._id} className="flex items-center gap-3 ">
      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-300 shrink-0 overflow-hidden ">
        {shop.image?.url ? (
          <img
            src={shop.image.url}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Store className="w-5 h-5 text-[#581c87]" />
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900">
          {shop.name}
        </h4>

       <p className="text-xs text-slate-500">
  Added{" "}
  {formatDistanceToNow(new Date(shop.createdAt), {
    addSuffix: true,
  })}
</p>
      </div>
    </div>
  ))}
</div>
        
      </div>
    </>
  );
};

export default RecentlyAdded;
