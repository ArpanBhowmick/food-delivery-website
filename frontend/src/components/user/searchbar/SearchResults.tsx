import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { addToCart, decreaseQuantity, increaseQuantity } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

interface SearchResultsProps {
  results: {
    shops: any[];
    items: any[];
  };
  onClose: () => void;
}

export default function SearchResults({ results, onClose }: SearchResultsProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(item));
  };

  if (results.shops.length === 0 && results.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden max-h-[70vh] flex flex-col">
      <div className="overflow-y-auto p-2 custom-scrollbar">
        {/* Shops Section */}
        {results.shops.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Shops ({results.shops.length})
            </h3>
            <div className="flex flex-col gap-1">
              {results.shops.map((shop) => (
                <Link
                  key={shop._id}
                  to={`/shop/${shop._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border">
                    <img
                      src={shop.image?.url || "/placeholder-shop.jpg"}
                      alt={shop.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-shop.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {shop.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {shop.city ? `${shop.city}` : "Shop"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Divider if both exist */}
        {results.shops.length > 0 && results.items.length > 0 && (
          <div className="my-2 h-px bg-border mx-3" />
        )}

        {/* Items Section */}
        {results.items.length > 0 && (
          <div>
            <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Items ({results.items.length})
            </h3>
            <div className="flex flex-col gap-1">
              {results.items.map((item) => (
                <Link
                  key={item._id}
                  to={`/shop/${item.shop?._id || item.shop}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border">
                      <img
                        src={item.image?.url || "/placeholder-item.jpg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-item.jpg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.shop?.name || "Unknown Shop"}
                      </span>
                      <span className="text-xs font-bold text-foreground mt-0.5">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const cartItem = cartItems.find((ci) => ci.item._id === item._id);
                    
                    if (cartItem) {
                      return (
                        <div className="flex w-24 shrink-0 items-center justify-between rounded-xl bg-[#7e22ce] py-1 font-bold text-white shadow-[4px_4px_0_0_rgba(126,34,206,0.35)]">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(decreaseQuantity(item._id));
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg leading-none hover:bg-white/10"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-sm">{cartItem.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(increaseQuantity(item._id));
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg leading-none hover:bg-white/10"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="flex w-10 cursor-pointer items-center justify-center rounded-xl bg-[#7e22ce] py-2 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(126,34,206,0.35)] transition duration-200 hover:bg-[#640a99] shrink-0"
                        aria-label="Add to cart"
                      >
                        <Plus className="h-5 w-5" strokeWidth={3} />
                      </button>
                    );
                  })()}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
