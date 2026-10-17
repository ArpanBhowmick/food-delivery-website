import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { RootState } from "@/store/store";
import useOrderApi from "@/hook/useOrderApi";

const MAX_RECENT_ORDERS = 5;

interface RecentOrderItem {
  name?: string;
  image?: string;
  quantity?: number;
  item?: { name?: string; image?: string } | null;
}

interface RecentShopOrder {
  shop?: { name?: string } | null;
  items?: RecentOrderItem[];
}

interface RecentOrder {
  _id: string;
  createdAt: string;
  orderStatus: string;
  pricing?: { totalAmount?: number } | null;
  shopOrders?: RecentShopOrder[];
}

const getOrderImage = (order: RecentOrder): string | null => {
  for (const shopOrder of order.shopOrders ?? []) {
    for (const item of shopOrder.items ?? []) {
      const image = item.image || item.item?.image;
      if (image) return image;
    }
  }

  return null;
};

const getRestaurantName = (order: RecentOrder): string => {
  const names = (order.shopOrders ?? [])
    .map((shopOrder) => shopOrder.shop?.name)
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) return "Restaurant";
  if (names.length === 1) return names[0];

  return `${names[0]} +${names.length - 1} more`;
};

const getOrderSummary = (order: RecentOrder): string => {
  const items = (order.shopOrders ?? []).flatMap(
    (shopOrder) => shopOrder.items ?? [],
  );

  if (items.length === 0) return "Order items unavailable";

  const firstItemName = items[0].name || items[0].item?.name || "Item";

  if (items.length === 1) {
    const quantity = items[0].quantity ?? 1;
    return quantity > 1 ? `${firstItemName} × ${quantity}` : firstItemName;
  }

  return `${firstItemName} + ${items.length - 1} more`;
};

const formatOrderDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RecentOrderCard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { getOrders } = useOrderApi();

  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(user));
  const [error, setError] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Keep the latest getOrders available without re-running the fetch effect.
  const getOrdersRef = useRef(getOrders);

  useEffect(() => {
    getOrdersRef.current = getOrders;
  }, [getOrders]);

  useEffect(() => {
    // Guests must never hit the authenticated orders endpoint.
    if (!user) {
      return;
    }

    let active = true;

    const fetchOrders = async () => {
      try {
        const response = await getOrdersRef.current();

        if (!active) return;

        const list = Array.isArray(response?.orders)
          ? (response.orders as RecentOrder[])
          : [];

        // Backend already sorts by createdAt desc; sort defensively.
        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setOrders(sorted.slice(0, MAX_RECENT_ORDERS));
        setLoadedUserId(user.id);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch recent orders:", err);

        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [user, reloadKey]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const showCards =
    !!user &&
    loadedUserId === user.id &&
    orders.length > 0 &&
    !loading &&
    !error;

  const renderBody = () => {
    if (!user) {
      return (
        <div className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 p-6 text-center text-sm text-gray-500">
          Sign in to see your recent orders.
        </div>
      );
    }

    if (loading || loadedUserId !== user.id) {
      return (
        <div className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 p-6 text-center text-sm text-gray-500">
          Loading recent orders...
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-gray-600">
          <p>We couldn't load your recent orders.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 cursor-pointer rounded-full bg-[#7e22ce] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
          >
            Try again
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 p-6 text-center text-sm text-gray-500">
          You haven't placed any orders yet.
        </div>
      );
    }

    return (
      <Carousel className="w-full" aria-label="Recent orders">
        <CarouselContent className="py-2">
          {orders.map((order) => {
            const image = getOrderImage(order);
            const restaurantName = getRestaurantName(order);
            const summary = getOrderSummary(order);
            const total = order.pricing?.totalAmount ?? 0;

            return (
              <CarouselItem
                key={order._id}
                className="w-[220px] min-w-[220px] basis-auto sm:w-[240px] sm:min-w-[240px] lg:w-[260px] lg:min-w-[275px]"
              >
                <article className="relative flex h-44 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 transition hover:shadow-md">
                  <div className="z-10 flex h-full w-2/3 flex-col">
                    <div className="mb-2">
                      {/* Static distance/time placeholder — not derived from the API. */}
                      <span className="w-fit rounded-md bg-white/80 px-2 py-1 text-[10px] text-gray-500 backdrop-blur-sm">
                        4.87 km • 21 min
                      </span>
                    </div>

                    <h3 className="truncate text-sm font-bold text-gray-800">
                      {summary}
                    </h3>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {restaurantName}
                    </p>

                    <div className="mt-auto">
                      <p className="font-bold text-[#7e22ce]">
                        ₹{total.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {image && (
                    <img
                      src={image}
                      alt={restaurantName}
                      loading="lazy"
                      className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full object-cover"
                    />
                  )}
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="inset-y-auto left-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
        <CarouselNext className="inset-y-auto right-3 top-1/2 my-0 z-10 -translate-y-1/2 border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-white disabled:hidden" />
      </Carousel>
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        {showCards && (
          <button className="flex cursor-pointer items-center gap-1 rounded-full bg-purple-100/50 px-4 py-1.5 text-sm font-medium text-[#7e22ce] transition hover:bg-purple-100">
            View all <ChevronRight size={16} />
          </button>
        )}
      </div>

      {renderBody()}
    </div>
  );
};

export default RecentOrderCard;
