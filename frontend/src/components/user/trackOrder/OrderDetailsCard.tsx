import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ShopOrder {
  items: OrderItem[];
}

interface OrderPricing {
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
}

// interface TrackingItem {
//   name: string;
//   quantity: number;
//   price: number;
//   image?: string;
// }

// Item list

// const mockItems: TrackingItem[] = [
//   { name: "Margherita Pizza", quantity: 1, price: 299 },
//   { name: "Garlic Breadsticks", quantity: 2, price: 149 },
//   { name: "Chocolate Brownie", quantity: 1, price: 129 },
// ];

// Pricing summary

// const mockPricing = {
//   itemTotal: 726,
//   deliveryFee: 0,
//   discount: 50,
//   totalAmount: 676,
// };

// Image fallback
const getImageUrl = (image?: string) => image || "";

export default function OrderDetailsCard({
  shopOrders,
  pricing,
}: {
  shopOrders: ShopOrder[];
  pricing: OrderPricing;
}) {

    const items = shopOrders.flatMap((shopOrder) => shopOrder.items);

  return (
    <Card className="rounded-2xl gap-3 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-base font-semibold text-slate-900">
        Order Details
      </h2>

      <div className=" divide-y divide-slate-100">
        {items.map((item, index) => {
          const imageUrl = getImageUrl(item.image);

          return (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Qty {item.quantity} × ₹{item.price}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-slate-900">
                ₹{item.price * item.quantity}
              </p>
            </div>
          );
        })}
      </div>

      <Separator className=" bg-slate-100" />

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Item total</span>
          <span className="font-medium text-slate-800">
            ₹{pricing.itemTotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Delivery fee</span>
          {pricing.deliveryFee === 0 ? (
            <span className="text-sm font-bold text-[#12c669]">FREE</span>
          ) : (
            <span className="font-medium text-slate-800">
              ₹{pricing.deliveryFee}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Discount</span>
          <span className="font-medium text-[#fc5a32]">
            − ₹{pricing.discount}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
          <span className="font-semibold text-slate-900">To Pay</span>
          <span className="text-lg font-bold text-slate-900">
            ₹{pricing.totalAmount}
          </span>
        </div>
      </div>
    </Card>
  );
}
