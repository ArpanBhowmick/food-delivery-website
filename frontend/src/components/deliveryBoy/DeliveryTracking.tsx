import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, MapPin } from "lucide-react";
import type { DeliveryRequest } from "@/types/delivery";

import scooterIcon from "@/assets/deliveryIcon.png";
import pickupIcon from "@/assets/pickup.png";
import dropoffIcon from "@/assets/dropOff.png";

import VisualMap from "../map/VisualMap";
import useDeliveryApi from "@/hook/useDeliveryApi";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useDeliveryRoute from "@/hook/useDeliveryRoute";

interface DeliveryTrackingProps {
  activeDeliveries: DeliveryRequest[];
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedDeliveryAssignmentId: string | null;
}

const DeliveryTracking = ({
  activeDeliveries,
  currentLocation,
  selectedDeliveryAssignmentId,
}: DeliveryTrackingProps) => {

  const { requestDeliveryOtp, verifyDeliveryOtp } = useDeliveryApi();

  const { getRoute } = useDeliveryRoute();

  const [otpRequested, setOtpRequested] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [deliveryRoute, setDeliveryRoute] = useState<
  { latitude: number; longitude: number }[]
>([]);

  const selectedDelivery = selectedDeliveryAssignmentId
    ? activeDeliveries.find(
        (delivery) =>
          delivery.deliveryAssignmentId === selectedDeliveryAssignmentId,
      )
    : null;

    

    const destination = selectedDelivery
  ? selectedDelivery.status === "accepted"
    ? {
        latitude: selectedDelivery.shop.location.coordinates[1],
        longitude: selectedDelivery.shop.location.coordinates[0],
      }
    : {
        latitude: selectedDelivery.deliveryAddress.latitude,
        longitude: selectedDelivery.deliveryAddress.longitude,
      }
  : null;

  const deliveriesToShow = selectedDelivery
    ? [selectedDelivery]
    : activeDeliveries;

  const markers = deliveriesToShow.flatMap((delivery) => [
    {
      id: `${delivery.deliveryAssignmentId}-pickup`,
      latitude: delivery.shop.location.coordinates[1],
      longitude: delivery.shop.location.coordinates[0],
      iconUrl: pickupIcon,
    },
    {
      id: `${delivery.deliveryAssignmentId}-dropoff`,
      latitude: delivery.deliveryAddress.latitude,
      longitude: delivery.deliveryAddress.longitude,
      iconUrl: dropoffIcon,
    },
  ]);

  useEffect(() => {
  if (!selectedDelivery || !currentLocation || !destination) {
    setDeliveryRoute([]);
    return;
  }

  const fetchRoute = async () => {
    const routePoints = await getRoute(currentLocation, destination);

    setDeliveryRoute(routePoints);

    console.log("DELIVERY ROUTE:", routePoints);
  };

  fetchRoute();
}, [
  selectedDelivery?.deliveryAssignmentId,
  selectedDelivery?.status,
]);



  const handleMarkAsDelivered = async () => {
    if (!selectedDelivery) return;

    try {
      setOtpLoading(true);

      await requestDeliveryOtp(selectedDelivery.deliveryAssignmentId);

      setOtpRequested(true);
      console.log("Delivery OTP requested successfully");
    } catch (error) {
      console.error("Failed to request delivery OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyDeliveryOtp = async () => {
    if (!selectedDelivery || !deliveryOtp.trim()) return;

    try {
      setOtpLoading(true);

      await verifyDeliveryOtp(
        selectedDelivery.deliveryAssignmentId,
        deliveryOtp.trim(),
      );

      console.log("Delivery completed successfully");

      setOtpRequested(false);
      setDeliveryOtp("");
    } catch (error) {
      console.error("Failed to verify delivery OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Current Zone
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Map will be implemented here */}

        {currentLocation ? (
          <VisualMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            zoom={13}
            markerIconUrl={scooterIcon}
            markers={markers}
            route={deliveryRoute}
          />
        ) : (
          <div className="h-80 w-full rounded-xl bg-slate-100 flex items-center justify-center">
            <p className="text-sm text-slate-500">Getting your location...</p>
          </div>
        )}

        {selectedDelivery?.status === "pickedUp" && (
          <div className="mt-4 space-y-3">
            {!otpRequested ? (
              <Button
                type="button"
                onClick={handleMarkAsDelivered}
                disabled={otpLoading}
                className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Mark as Delivered"
                )}
              </Button>
            ) : (
              <>
                <input
                  type="text"
                  value={deliveryOtp}
                  onChange={(event) => setDeliveryOtp(event.target.value)}
                  placeholder="Enter delivery OTP"
                  maxLength={6}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#581c87] focus:ring-2 focus:ring-[#581c87]/20"
                />

                <Button
                  type="button"
                  onClick={handleVerifyDeliveryOtp}
                  disabled={otpLoading || !deliveryOtp.trim()}
                  className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800"
                >
                  Verify OTP
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMarkAsDelivered}
                  disabled={otpLoading}
                  className="w-full cursor-pointer"
                >
                  Resend OTP
                </Button>
              </>
            )}
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-900">
            Active Deliveries: {activeDeliveries.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracking;
