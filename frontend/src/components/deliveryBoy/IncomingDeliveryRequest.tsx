import { BellRing, Navigation } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { DeliveryRequest } from "@/types/delivery";

interface IncomingDeliveryRequestProps {
  isAvailable: boolean;
  requests: DeliveryRequest[];
}

const IncomingDeliveryRequest = ({
  isAvailable,
  requests,
}: IncomingDeliveryRequestProps) => {
  
  // const incomingRequests = [
  //   {
  //     id: "REQ-9901",
  //     restaurant: "Pizza Palace",
  //     dropoff: "New Town, Action Area 1",
  //     earnings: 65,
  //     distance: "3.5 km",
  //   },
  // ];

  return (
    <div>
      {isAvailable && requests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <BellRing className="w-5 h-5 animate-bounce" />
            <h2 className="text-lg font-bold">New Delivery Requests</h2>
          </div>

          {requests.map((req) => (
            <Card
              key={req.deliveryAssignmentId}
              className="border-orange-200 bg-orange-50/50 shadow-md"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-orange-100 text-orange-800 border-orange-300 mb-2"
                    >
                      Delivery-{req.deliveryAssignmentId.slice(-6)}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900">
                      ₹{req.itemTotal}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        Est. Earning
                      </span>
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-semibold text-gray-700 flex items-center sm:justify-end gap-1">
                      <Navigation className="w-4 h-4 text-gray-400" />
                      {/* {req.distance} total */}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row">
                  <div className="relative mb-0 flex-1 space-y-3 before:absolute before:inset-y-4 before:left-2.5 before:w-0.5 before:bg-gray-300">
                    <div className="flex gap-3 items-start relative z-10">
                      <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.shop.name}
                        </p>
                        <p className="text-xs text-gray-500">Pickup Location</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start relative z-10">
                      <div className="w-5 h-5 rounded-full bg-green-100 border-2 border-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.deliveryAddress.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          Dropoff Location
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col justify-end gap-3 md:w-auto md:min-w-[140px]">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700"
                    >
                      Decline
                    </Button>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Accept Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingDeliveryRequest;
