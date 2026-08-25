import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useOrderApi from "@/hook/useOrderApi";
import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;

  deliveryAddress: {
    text: string;
    latitude: number;
    longitude: number;
  };

  pricing: {
    itemTotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  };

  shopOrders: {
    _id: string;
    shop: string;
    owner: string;

    items: {
      _id: string;

      item: {
        _id: string;
        name: string;
        image: string;
        price: number;
      };

      name: string;
      image: string;
      price: number;
      quantity: number;
    }[];

    itemTotal: number;
  }[];
}

// const orderHistory = [
//   {
//     id: "1",
//     time: "10:30 AM",
//     date: "Aug 24, 2023",
//     status: "Delivered",
//     total: "42.50",
//     paymentMethod: "Cash on Delivery",
//     items: [
//       { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
//       { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
//     ],
//   },
//   {
//     id: "2",
//     time: "2:15 PM",
//     date: "Aug 29, 2023",
//     status: "Cancelled",
//     total: "42.50",
//     paymentMethod: "Cash on Delivery",
//     items: [
//       { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
//       { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
//       { id: "i3", icon: "🥛", bg: "bg-[#c8e0f0]" },
//     ],
//   },
//   {
//     id: "3",
//     time: "6:45 PM",
//     date: "Jun 20, 2023",
//     status: "Delivered",
//     total: "42.50",
//     paymentMethod: "Cash on Delivery",
//     items: [
//       { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
//       { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
//     ],
//   },
//   {
//     id: "4",
//     time: "11:20 AM",
//     date: "May 12, 2023",
//     status: "Delivered",
//     total: "38.75",
//     paymentMethod: "Cash on Delivery",
//     items: [
//       { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
//       { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
//     ],
//   },
//   {
//     id: "5",
//     time: "4:05 PM",
//     date: "Apr 28, 2023",
//     status: "Cancelled",
//     total: "27.90",
//     paymentMethod: "Cash on Delivery",
//     items: [
//       { id: "i1", icon: "🥛", bg: "bg-[#c8e0f0]" },
//       { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
//     ],
//   },
// ];

const MyOrders = () => {
  const { getOrders } = useOrderApi();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrders();

      console.log("ORDERS:", response.orders);

      setOrders(response.orders);
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col md:border-l md:border-slate-200 md:pl-0">
        <div className="sticky top-0 z-10 bg-white py-2 shadow-[0_4px_6px_-4px_rgba(15,23,42,0.25)]">
          <h1 className="text-lg font-bold pl-2 text-slate-900">Orders</h1>
        </div>

        {/* Order List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <Card
                key={order._id.slice(-6)}
                className="rounded-2xl shadow-sm border-slate-100 overflow-hidden p-0"
              >
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="p-5 sm:p-4 flex items-start justify-between bg-white">
                    <div>
                      <h3 className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                        Order{" "}
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                        {order.orderStatus === "delivered" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Placed at{" "}
                        {new Date(order.createdAt).toLocaleDateString()},{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                        <span>₹{order.pricing.totalAmount}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Body */}
                  <div className="p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                    {/* Items */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.shopOrders.map((shopOrder) =>
                        shopOrder.items.map((item) => {
                          console.log("FULL ITEM:", item);
                          console.log("DIRECT IMAGE:", item.image);
                          console.log("NESTED IMAGE:", item.item.image);
                          console.log("NESTED TYPE:", typeof item.item.image);

                          return (
                            <div
                              key={item._id}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover"
                              />

                              <span className="text-sm font-medium text-slate-700">
                                x {item.quantity}
                              </span>
                            </div>
                          );
                        }),
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                      <div className="flex gap-3 w-full md:w-auto">
                        {/* <Button
                          variant="outline"
                          className="flex-1 cursor-pointer md:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg h-10 px-5"
                        >
                          View Details
                        </Button> */}
                        <Button className="flex-1 cursor-pointer md:flex-none bg-[#3f4a5c] hover:bg-[#323b49] text-white gap-2 font-medium rounded-lg h-10 px-5">
                          Order Again
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
