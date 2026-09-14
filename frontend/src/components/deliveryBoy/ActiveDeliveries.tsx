import { Bike, Clock, MapPin, Navigation, Package } from "lucide-react";

import { Button } from "../ui/button";

import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

const activeDeliveries = [
  {
    id: "ORD-7782",
    restaurant: "Spice Symphony",
    dropoff: "Sector 4, Salt Lake",
    status: "Picked Up",
    distance: "2.1 km",
    estTime: "12 mins",
  },
  {
    id: "ORD-7785",
    restaurant: "Burger Station",
    dropoff: "DLF IT Park",
    status: "Heading to Restaurant",
    distance: "0.8 km",
    estTime: "5 mins",
  },
];

const ActiveDeliveries = () => {
  const MAX_CAPACITY = 3;
  const currentLoad = activeDeliveries.length;
  const capacityPercentage = (currentLoad / MAX_CAPACITY) * 100;

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 sm:text-xl">
              <Bike className="w-6 h-6 text-blue-600" />
              Active Deliveries
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your current active routes
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-sm font-bold text-gray-700">
              {currentLoad} / {MAX_CAPACITY} Slots Filled
            </span>
            <Progress
              value={capacityPercentage}
              className="h-2 w-full max-w-32 mt-2 bg-gray-200"
            />
          </div>
        </div>

        {activeDeliveries.length === 0 ? (
          <Card className="border-dashed bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Package className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">
                No active deliveries
              </p>
              <p className="text-sm">You are currently waiting for orders.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="border-b border-gray-100 bg-gray-50/50 p-3 flex flex-wrap justify-between items-center gap-2 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge
                        variant="secondary"
                        className="max-w-full whitespace-normal bg-blue-100 text-center text-blue-700 hover:bg-blue-100"
                      >
                        {delivery.id}
                      </Badge>
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {delivery.estTime}
                      </span>
                    </div>
                    <Badge
                      className={
                        delivery.status === "Picked Up"
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                      }
                    >
                      {delivery.status}
                    </Badge>
                  </div>

                  <div className="p-4 flex flex-col md:flex-row justify-between gap-5 sm:p-5 sm:gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-gray-100 p-2 rounded-full">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Pickup
                          </p>
                          <p className="font-medium text-gray-900">
                            {delivery.restaurant}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-gray-100 p-2 rounded-full">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Dropoff
                          </p>
                          <p className="font-medium text-gray-900">
                            {delivery.dropoff}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col justify-end gap-3 md:w-auto md:min-w-[140px]">
                      <Button className="w-full bg-slate-900 hover:bg-slate-800">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveDeliveries;
