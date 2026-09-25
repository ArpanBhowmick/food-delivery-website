import { useParams } from "react-router-dom";

import VisualMap from "@/components/map/VisualMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import deliveryIcon from "@/assets/deliveryIcon.png";
import DeliveryPartnerCard from "@/components/user/trackOrder/DeliveryPartnerCard";
import OrderDetailsCard from "@/components/user/trackOrder/OrderDetailsCard";
import PaymentInformationCard from "@/components/user/trackOrder/PaymentInformationCard";
import StatusStepper from "@/components/user/trackOrder/StatusStepper";
import useOrderApi from "@/hook/useOrderApi";
import { useEffect, useState } from "react";
import useDeliveryApi from "@/hook/useDeliveryApi";
import useDeliveryRoute from "@/hook/useDeliveryRoute";

// Defines the order data displayed on the tracking page.
interface TrackOrderData {
  _id: string;
  createdAt: string;
  deliveredAt?: string;
  orderStatus: "placed" | "preparing" | "outForDelivery" | "delivered";

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

    shop: {
      id: string;
      name: string;
      owner: string;
    };
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



// Renders the customer order-tracking page.
export default function TrackOrder() {
  // Reads the order identifier from the route.
  const { orderId } = useParams();

  // Loads the customer's order and delivery APIs.
  const { getOrders } = useOrderApi();

  const { getUserDeliveryTracking } = useDeliveryApi();

  // Stores order and loading state.
  const [order, setOrder] = useState<TrackOrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // Stores delivery tracking and route state.
  const [tracking, setTracking] = useState<any[]>([]);

  const [deliveryPartner, setDeliveryPartner] = useState<{
    name: string;
    mobile: string;
  } | null>(null);

  const [deliveryStatus, setDeliveryStatus] = useState<
    "available" | "accepted" | "pickedUp" | "delivered" | null
  >(null);

  const { getRoute } = useDeliveryRoute();

  // Stores the route between the rider and customer.
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
    [],
  );

  // Finds the active delivery rider location.
  const activeRiders = tracking.filter(
    (assignment) =>
      assignment.status !== "delivered" &&
      assignment.deliveryBoy?.currentLocation,
  );

  const mapRider = activeRiders[0]?.deliveryBoy?.currentLocation;

  const mapCenter = mapRider
    ? {
        latitude: mapRider.coordinates[1],
        longitude: mapRider.coordinates[0],
      }
    : {
        latitude: order?.deliveryAddress.latitude ?? 0,
        longitude: order?.deliveryAddress.longitude ?? 0,
      };

  // Prepares the order display values.
  const orderNumber = order?._id.slice(-6) ?? "...";

  const currentStep = order?.orderStatus ?? "placed";

  // Fetches the selected customer's order.
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOrders();

        const matchedOrder = response.orders.find(
          (item: TrackOrderData) => item._id === orderId,
        );

        setOrder(matchedOrder ?? null);
      } catch (error) {
        console.error("Failed to fetch tracking order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Fetches delivery tracking data and builds the rider route.
  useEffect(() => {
    const fetchTracking = async () => {
      if (!orderId || !order) {
        return;
      }

      try {
        const response = await getUserDeliveryTracking(orderId);

      console.log("DELIVERY TRACKING:", response.tracking);

        setTracking(response.tracking);

        const partnerAssignment = response.tracking.find(
  (assignment: any) => assignment.deliveryBoy,
);

        setDeliveryPartner(partnerAssignment?.deliveryBoy ?? null);
        setDeliveryStatus(partnerAssignment?.status ?? null);

        

        const activeAssignment = response.tracking.find(
          (assignment: any) =>
            assignment.status !== "delivered" &&
            assignment.deliveryBoy?.currentLocation,
        );

        const riderLocation = activeAssignment?.deliveryBoy?.currentLocation;

        if (activeAssignment?.status === "pickedUp" && riderLocation) {
          const routePoints = await getRoute(
            {
              latitude: riderLocation.coordinates[1],
              longitude: riderLocation.coordinates[0],
            },
            {
              latitude: order.deliveryAddress.latitude,
              longitude: order.deliveryAddress.longitude,
            },
          );

          setRoute(routePoints);
        } else {
          setRoute([]);
        }
      } catch (error) {
        console.error("Failed to fetch delivery tracking:", error);
      }
    };

    fetchTracking();
  }, [orderId, order]);

  // Shows a loading state while the order is being fetched.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">
        <p className="text-sm text-slate-500">Loading order...</p>
      </div>
    );
  }

  // Shows an empty state when the order cannot be found.
  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">
        <p className="text-sm text-slate-500">Order not found.</p>
      </div>
    );
  }

  // Renders the complete order-tracking layout.
  return (
    <div className="min-h-full w-full bg-[#f4f6f9] p-4 font-sans text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Order header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#fc5a32]">
              Live order tracking
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Order #{orderNumber}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Placed {new Date(order.createdAt).toLocaleDateString()},{" "}
              {new Date(order.createdAt).toLocaleTimeString()} ·{" "}
              {order.shopOrders[0]?.shop?.name ?? "Shop"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="cursor-default rounded-lg border-0 bg-green-100 px-3 py-1 text-green-800"
            >
              {order.orderStatus === "outForDelivery"
                ? "Out for Delivery"
                : order.orderStatus.charAt(0).toUpperCase() +
                  order.orderStatus.slice(1)}
            </Badge>

          </div>
        </header>

        {/* Order progress stepper */}
        {/* <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <CardContent className="gap-0 p-0">
            <StatusStepper current={currentStep} />
          </CardContent>
        </Card> */}

        {/* Live map with rider and delivery location */}
        <section className="relative isolate z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <VisualMap
            latitude={mapCenter.latitude}
            longitude={mapCenter.longitude}
            zoom={13}
            markers={[
              {
                id: "customer",
                latitude: order.deliveryAddress.latitude,
                longitude: order.deliveryAddress.longitude,
              },

              ...activeRiders.map((assignment) => ({
                id: `delivery-boy-${assignment.deliveryAssignmentId}`,
                latitude: assignment.deliveryBoy.currentLocation.coordinates[1],
                longitude:
                  assignment.deliveryBoy.currentLocation.coordinates[0],
                iconUrl: deliveryIcon,
              })),
            ]}
            route={route}
          />
        </section>

        {/* Delivery partner and address cards */}
        <div className="grid grid-cols-1 gap-6">
          <DeliveryPartnerCard
            deliveryAddress={order.deliveryAddress.text}
            deliveryPartner={deliveryPartner}
            deliveryStatus={deliveryStatus}
          />

          {/* Delivery address card */}
     
        </div>

        {/* Order details and payment cards */}
        <div className="grid grid-cols-1 items-start gap-6">
          <OrderDetailsCard
  shopOrders={order.shopOrders}
  pricing={order.pricing}
/>

          <PaymentInformationCard />
        </div>
      </div>
    </div>
  );
}
