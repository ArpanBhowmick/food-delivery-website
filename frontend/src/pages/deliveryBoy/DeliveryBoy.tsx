import { useCallback, useEffect, useState } from "react";
import { IndianRupee, Clock, CheckCircle } from "lucide-react";

import { Switch } from "@/components/ui/switch";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProTips from "@/components/deliveryBoy/ProTips";
import ActiveDeliveries from "@/components/deliveryBoy/ActiveDeliveries";
import IncomingDeliveryRequest from "@/components/deliveryBoy/IncomingDeliveryRequest";
import useUpdateLocation from "@/hook/useUpdateLocation";
import useSocket from "@/hook/useSocket";
import type { DeliveryRequest } from "@/types/delivery";
import useDeliveryApi from "@/hook/useDeliveryApi";
import DeliveryTracking from "@/components/deliveryBoy/DeliveryTracking";

// Mocking the existing location hook to ensure functionality remains intact

export default function DeliveryBoyDashboard() {
  const { getAvailableDeliveryAssignments, getMyActiveDeliveries } =
    useDeliveryApi();

  const [isAvailable, setIsAvailable] = useState(true);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(
    [],
  );
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRequest[]>(
    [],
  );

  const [selectedDeliveryAssignmentId, setSelectedDeliveryAssignmentId] =
    useState<string | null>(null);

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // Existing functionality preserved

  const handleLocationChange = useCallback(
    (latitude: number, longitude: number) => {
      setCurrentLocation({ latitude, longitude });
    },
    [],
  );

  useUpdateLocation(handleLocationChange);

  useSocket((request) => {
    console.log("Delivery request received:", request);

    setDeliveryRequests((prev) => [...prev, request]);
  });

  // Mock Data: To be replaced by backend queries
  const partnerInfo = {
    name: "Rahul M.",
    todayEarnings: 840,
    deliveriesToday: 12,
    onlineHours: "4h 30m",
  };
  console.log("CURRENT LOCATION:", currentLocation);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const [availableResponse, activeResponse] = await Promise.all([
          getAvailableDeliveryAssignments(),
          getMyActiveDeliveries(),
        ]);

        setDeliveryRequests(availableResponse.assignments);
        setActiveDeliveries(activeResponse.assignments);
      } catch (error) {
        console.error("Failed to fetch delivery data:", error);
      }
    };

    fetchDeliveryData();
  }, []);

  const handleDeliveryAccepted = (request: DeliveryRequest) => {
    setDeliveryRequests((prev) =>
      prev.filter(
        (item) => item.deliveryAssignmentId !== request.deliveryAssignmentId,
      ),
    );

    setActiveDeliveries((prev) => [
      ...prev,
      { ...request, status: "accepted" },
    ]);
  };

  const handleNavigate = (deliveryAssignmentId: string) => {
    console.log("Selected delivery:", deliveryAssignmentId);
    setSelectedDeliveryAssignmentId(deliveryAssignmentId);
  };

  const handleShowAllDeliveries = () => {
    setSelectedDeliveryAssignmentId(null);
  };

  console.log("DELIVERY REQUESTS STATE:", deliveryRequests);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pb-20 md:pb-8">
      {/* 1. HERO SECTION */}
      <div className="relative min-h-[420px] w-full bg-slate-900 rounded-b-3xl md:min-h-[320px] md:rounded-3xl overflow-hidden shadow-lg md:mt-4 md:mx-4 md:w-[calc(100%-2rem)]">
        {/* Temporary delivery-related background image */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative min-h-[420px] flex flex-col justify-between gap-8 p-4 sm:p-6 md:min-h-0 md:p-10 z-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm sm:h-14 sm:w-14">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
                  Hi, {partnerInfo.name}
                </h1>
                <p className="text-xs text-slate-300 font-medium sm:text-sm">
                  Ready for your next run?
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex w-fit items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 sm:gap-3 sm:px-4">
              <span
                className={`text-sm font-bold ${isAvailable ? "text-green-400" : "text-slate-400"}`}
              >
                {isAvailable ? "ONLINE" : "OFFLINE"}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                className="cursor-pointer data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          {/* Hero Quick Stats */}
          <div className="grid grid-cols-1 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 sm:grid-cols-3 sm:gap-4 sm:p-4">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1 sm:text-xs">
                Today's Earnings
              </span>
              <span className="text-xl font-bold text-white flex items-center sm:text-2xl">
                <IndianRupee className="w-5 h-5 mr-1 text-green-400" />
                {partnerInfo.todayEarnings}
              </span>
            </div>
            <div className="flex flex-col border-t border-white/10 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1 sm:text-xs">
                Completed
              </span>
              <span className="text-xl font-bold text-white flex items-center sm:text-2xl">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                {partnerInfo.deliveriesToday}
              </span>
            </div>
            <div className="flex flex-col border-t border-white/10 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1 sm:text-xs">
                Hours Online
              </span>
              <span className="text-xl font-bold text-white flex items-center sm:text-2xl">
                <Clock className="w-5 h-5 mr-2 text-orange-400" />
                {partnerInfo.onlineHours}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Active & Incoming */}
        <div className="min-w-0 lg:col-span-8 space-y-6 lg:space-y-8">
          {/* INCOMING REQUESTS SECTION */}
          <IncomingDeliveryRequest
            isAvailable={isAvailable}
            requests={deliveryRequests}
            onAccepted={handleDeliveryAccepted}
          />

          {/* CURRENT LOCATION CARD */}

          <DeliveryTracking
            activeDeliveries={activeDeliveries}
            currentLocation={currentLocation}
            selectedDeliveryAssignmentId={selectedDeliveryAssignmentId}
          />

          {/* ACTIVE DELIVERIES SECTION */}

          <ActiveDeliveries
            deliveries={activeDeliveries}
            onNavigate={handleNavigate}
            isDeliverySelected={selectedDeliveryAssignmentId !== null}
            onShowAllDeliveries={handleShowAllDeliveries}
          />
        </div>

        {/* Right Column: Location & Alerts */}

        <div className="min-w-0 lg:col-span-4 space-y-6">
          {/* pro tips */}

          <ProTips />
        </div>
      </div>
    </div>
  );
}
