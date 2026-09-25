import useDeliveryApi from "@/hook/useDeliveryApi";
import useOrderApi from "@/hook/useOrderApi";
import { Mail, MapPin, MoreHorizontal, Phone, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define order status values.
type OrderStatus = "placed" | "preparing" | "outForDelivery" | "cancelled";

// Define customer details.
interface OrderUser {
  name: string;
  email?: string;
  mobile?: string;
}

// Define item details.
interface OrderItem {
  name: string;
  image?: string | { url?: string };
  quantity: number;
  price: number;
}

// Define a shop's order section.
interface ShopOrder {
  _id: string;
  shop: {
    _id: string;
    name: string;
    owner: string;
  };
  items: OrderItem[];
  itemTotal: number;
  orderStatus: OrderStatus;
}

// Define the complete order shape.
interface Order {
  _id: string;
  user: OrderUser;
  createdAt: string;
  paymentMethod: string;
  deliveryAddress?: { text: string };
  pricing?: { totalAmount: number };
  orderStatus: OrderStatus;
  shopOrders: ShopOrder[];
}

// List available order statuses.
const statuses: OrderStatus[] = [
  "placed",
  "preparing",
  "outForDelivery",
  "cancelled",
];

// Style each order status badge.
const statusStyles: Record<OrderStatus, string> = {
  placed: "bg-orange-100 text-orange-800",
  preparing: "bg-slate-200 text-slate-700",
  outForDelivery: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Style each order status label.
const statusTextStyles: Record<OrderStatus, string> = {
  placed: "text-orange-800",
  preparing: "text-slate-700",
  outForDelivery: "text-green-800",
  cancelled: "text-red-800",
};

// Convert status values into readable text.
const formatStatus = (status: string) =>
  status === "outForDelivery"
    ? "Out for Delivery"
    : status.charAt(0).toUpperCase() + status.slice(1);

// Get an item's image URL.
const getImageUrl = (image: OrderItem["image"]) =>
  typeof image === "string" ? image : image?.url;

export default function OwnerOrders() {
  // Initialize order APIs and local state.
  const { getOrders, updateOrderStatus } = useOrderApi();

  const { verifyPickupCode, confirmPickup, getDeliveryAssignmentDetails } =
    useDeliveryApi();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<
    Record<string, OrderStatus>
  >({});

  const [selectedShopId, setSelectedShopId] = useState("all");

  const [deliveryDetailsOpen, setDeliveryDetailsOpen] = useState(false);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState<{
    orderId: string;
    shopOrderId: string;
  } | null>(null);

  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);
  const [deliveryDetailsLoading, setDeliveryDetailsLoading] = useState(false);

  const [pickupCode, setPickupCode] = useState("");

  const [verifiedAssignment, setVerifiedAssignment] = useState<{
    deliveryAssignmentId: string;
    orderId: string;
    shopOrderId: string;
    shopId: string;
    deliveryBoyId: string;
    status: string;
  } | null>(null);

  // Load the owner's orders on page load.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.orders);
        console.log(response.orders);
      } catch (error) {
        console.error("Failed to fetch owner orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Build a unique list of the owner's shops.
  const shops = Array.from(
    new Map(
      orders.flatMap((order) =>
        order.shopOrders.map((shopOrder) => [
          shopOrder.shop._id,
          shopOrder.shop,
        ]),
      ),
    ).values(),
  );

  // Update a shop order's status.
  const handleStatusChange = async (
    orderId: string,
    shopOrderId: string,
    status: OrderStatus,
  ) => {
    const response = await updateOrderStatus(orderId, shopOrderId, status);
    console.log("Status update response:", response);
    setOrderStatuses((prev) => ({
      ...prev,
      [shopOrderId]: status,
    }));
  };

  const handleVerifyPickupCode = async () => {
    if (!pickupCode.trim()) return;

    try {
      const response = await verifyPickupCode(pickupCode.trim());

      setVerifiedAssignment(response.assignment);
    } catch (error) {
      console.error("Failed to verify pickup code:", error);
      setVerifiedAssignment(null);
    }
  };

  const handleConfirmPickup = async () => {
    if (!verifiedAssignment) return;

    try {
      await confirmPickup(verifiedAssignment.deliveryAssignmentId);

      setVerifiedAssignment(null);
    } catch (error) {
      console.error("Failed to confirm pickup:", error);
    }
  };

  const handleOpenDeliveryDetails = async (
    orderId: string,
    shopOrderId: string,
  ) => {
    setSelectedDeliveryOrder({
      orderId,
      shopOrderId,
    });

    setDeliveryDetailsOpen(true);
    setDeliveryDetailsLoading(true);
    setDeliveryDetails(null);

    try {
      const response = await getDeliveryAssignmentDetails(orderId, shopOrderId);

      setDeliveryDetails(response.assignment);
    } catch (error) {
      console.error("Failed to fetch delivery details:", error);
    } finally {
      setDeliveryDetailsLoading(false);
    }
  };

  // Render the orders page.
  return (
    <div className="min-h-full w-full bg-[#fafafa] p-4 font-sans text-slate-900 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {selectedShopId === "all"
              ? "All Orders"
              : `Orders from ${
                  shops.find((shop) => shop._id === selectedShopId)?.name
                }`}
          </h1>
          <p className="mt-1 text-slate-500">
            Manage orders from all your shops
          </p>
        </div>

        {/* Filter orders by shop or status. */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-4 items-center justify-between mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="font-semibold px-2">Orders</span>

            <div className="relative w-full sm:w-150">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search orders"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <input
                type="text"
                value={pickupCode}
                onChange={(event) => setPickupCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleVerifyPickupCode();
                  }
                }}
                placeholder="Pickup code"
                className="w-full sm:w-36 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={handleVerifyPickupCode}
                className="rounded-md bg-[#581c87] px-4 py-2 text-sm font-medium text-white hover:bg-[#4c1a78]"
              >
                Find
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={selectedShopId}
              onChange={(event) => setSelectedShopId(event.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Shops</option>

              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>All Statuses</option>
              <option>Placed</option>
              <option>Preparing</option>
              <option>Out for Delivery</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Render each matching shop order. */}
        <div className="space-y-5">
          {orders.flatMap((order) => {
            const shopOrders =
              selectedShopId === "all"
                ? order.shopOrders
                : order.shopOrders.filter(
                    (shopOrder) => shopOrder.shop._id === selectedShopId,
                  );

            const visibleShopOrders = verifiedAssignment
              ? shopOrders.filter(
                  (shopOrder) =>
                    order._id === verifiedAssignment.orderId &&
                    shopOrder._id === verifiedAssignment.shopOrderId,
                )
              : shopOrders;

            return visibleShopOrders.map((shopOrder) => {
              const items = shopOrder.items;

              // Use the locally updated status when available.
              const status =
                orderStatuses[shopOrder._id] ?? shopOrder.orderStatus;

              return (
                <article
                  key={`${order._id}-${shopOrder._id}`}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                >
                  {/* Show order number and creation time. */}
                  <header className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                      Order #{order._id.slice(-6)}
                    </h2>
                    <time className="shrink-0 text-right text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </header>

                  {/* Show customer contact details. */}
                  <section className="border-b border-slate-100 py-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </p>
                    <p className="font-semibold text-slate-900">
                      {order.user?.name ?? "Unknown customer"}
                    </p>
                    <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:gap-5">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {order.user?.email ?? "No email provided"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {order.user?.mobile ?? "No phone provided"}
                      </span>
                    </div>
                  </section>

                  {/* Show the delivery address. */}
                  <section className="border-b border-slate-100 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MapPin className="h-4 w-4 text-[#581c87]" />
                      Delivery Address
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {order.deliveryAddress?.text ??
                        "No delivery address provided"}
                    </p>
                  </section>

                  {/* Show the first three order items. */}
                  <section className="mt-4 rounded-xl border border-slate-200 p-3 sm:p-4">
                    <div className="space-y-3">
                      {items.slice(0, 3).map((item, index) => {
                        const imageUrl = getImageUrl(item.image);

                        return (
                          <Fragment key={`${item.name}-${index}`}>
                            <div className="flex min-w-0 items-center gap-3">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100" />
                              )}
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="truncate text-sm font-medium text-slate-800">
                                  {item.name}
                                </span>
                                <span className="shrink-0 text-sm text-slate-600">
                                  Qty: {item.quantity} ×{" "}
                                  <strong className="font-semibold text-slate-800">
                                    ₹{item.price}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            {index < Math.min(items.length, 3) - 1 && (
                              <div className="border-t border-slate-100" />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                    {items.length > 3 && (
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-500">
                        <MoreHorizontal className="h-4 w-4" />+
                        {items.length - 3} more items
                      </div>
                    )}
                  </section>

                  {/* Show payment method and shop order total. */}
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 text-sm">
                    <span className="text-slate-600">
                      Payment:{" "}
                      <span className="font-medium text-slate-800">
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">
                      Total: ₹{shopOrder.itemTotal}
                    </span>
                  </div>

                  {/* Show and update the order status. */}
                  <footer className="flex items-center justify-between gap-3 pt-4">
                    <span className="text-sm font-semibold text-slate-700">
                      Status:{" "}
                      <span
                        className={`font-medium ${statusTextStyles[status]}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      {status === "outForDelivery" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDeliveryDetails(order._id, shopOrder._id)
                          }
                          className="rounded-md border border-[#581c87] px-4 py-2 text-sm font-medium text-[#581c87] hover:bg-[#581c87]/5 cursor-pointer"
                        >
                          Delivery Details
                        </button>
                      )}
                      {verifiedAssignment &&
                        order._id === verifiedAssignment.orderId &&
                        shopOrder._id === verifiedAssignment.shopOrderId && (
                          <button
                            type="button"
                            onClick={handleConfirmPickup}
                            className="rounded-md bg-[#581c87] px-4 py-2 text-sm font-medium text-white hover:bg-[#4c1a78]"
                          >
                            Pick Up
                          </button>
                        )}

                      <select
                        value={status}
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            shopOrder._id,
                            event.target.value as OrderStatus,
                          )
                        }
                        className={`cursor-pointer rounded-md border border-transparent px-3 py-1.5 text-sm font-medium outline-none focus:border-[#581c87] focus:ring-2 focus:ring-[#581c87]/20 ${statusStyles[status]}`}
                        aria-label={`Change status for order ${order._id}`}
                      >
                        {statuses.map((option) => (
                          <option
                            className="cursor-pointer"
                            key={option}
                            value={option}
                          >
                            {formatStatus(option)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </footer>
                </article>
              );
            });
          })}
        </div>

        <Dialog
          open={deliveryDetailsOpen}
          onOpenChange={setDeliveryDetailsOpen}
        >
          <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
            </DialogHeader>

            {deliveryDetailsLoading ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Loading delivery details...
              </div>
            ) : !deliveryDetails ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No delivery details found.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Order</p>

                  <p className="mt-1 text-base font-semibold text-slate-900">
                    #{selectedDeliveryOrder?.orderId.slice(-6)}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Status:{" "}
                    <span className="font-semibold text-green-700">
                      {deliveryDetails.status === "outForDelivery"
                        ? "Out for Delivery"
                        : deliveryDetails.status}
                    </span>
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Accepted By
                  </p>

                  {deliveryDetails.acceptedBy ? (
                    <div className="mt-2 space-y-1">
                      <p className="font-semibold text-slate-900">
                        {deliveryDetails.acceptedBy.name}
                      </p>

                      <p className="text-sm text-slate-600">
                        {deliveryDetails.acceptedBy.mobile ??
                          "No phone provided"}
                      </p>

                      <p className="text-sm text-slate-600">
                        {deliveryDetails.acceptedBy.email ??
                          "No email provided"}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No delivery boy has accepted this assignment yet.
                    </p>
                  )}
                </div>

                <div className="min-h-0 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Available Delivery Boys
                  </p>

                  {!deliveryDetails.broadcastedTo?.length ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No delivery boys are currently available in this area.
                    </p>
                  ) : (
                    <div className="mt-3 max-h-60 space-y-3 overflow-y-auto pr-2">
                      {(() => {
  const availableDeliveryBoys =
    deliveryDetails.broadcastedTo?.filter(
      (entry: any) => entry.status === "notified",
    ) ?? [];

  return availableDeliveryBoys.length === 0 ? (
    <p className="mt-3 text-sm text-slate-500">
      No delivery boys are currently available in this area.
    </p>
  ) : (
    <div className="mt-3 max-h-60 space-y-3 overflow-y-auto pr-2">
      {availableDeliveryBoys.map((entry: any) => (
        <div
          key={entry.deliveryBoy?._id}
          className="rounded-lg border border-slate-200 p-3"
        >
          <p className="font-semibold text-slate-900">
            {entry.deliveryBoy?.name ?? "Unknown"}
          </p>

          <p className="text-sm text-slate-600">
            {entry.deliveryBoy?.mobile ?? "No phone provided"}
          </p>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            {entry.status}
          </p>
        </div>
      ))}
    </div>
  );
})()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
