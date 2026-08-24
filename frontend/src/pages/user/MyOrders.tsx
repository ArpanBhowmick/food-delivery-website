import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  MapPin, 
  User, 
  LogOut, 
  Store, 
  RotateCcw 
} from "lucide-react";

// Mock data for the orders
const orderHistory = [
  {
    id: "1",
    store: "Fresh Greens Supermarket",
    date: "Aug 24, 2023",
    status: "Delivered",
    total: "42.50",
    items: [
      { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
      { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
    ],
  },
  {
    id: "2",
    store: "Fresh Greens Supermarket",
    date: "Aug 29, 2023",
    status: "Processing",
    total: "42.50",
    items: [
      { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
      { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
      { id: "i3", icon: "🥛", bg: "bg-[#c8e0f0]" },
    ],
  },
  {
    id: "3",
    store: "Fresh Greens Supermarket",
    date: "Jun 20, 2023",
    status: "Processing",
    total: "42.50",
    items: [
      { id: "i1", icon: "🥑", bg: "bg-[#b8d090]" },
      { id: "i2", icon: "🍞", bg: "bg-[#d8c0a0]" },
    ],
  },
];

export default function MyOrders() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          {/* Profile Card */}
          <Card className="mb-6 rounded-2xl shadow-sm border-slate-100">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4 bg-slate-200">
                <AvatarFallback className="text-xl font-medium text-slate-600 bg-[#d5dae1]">JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-slate-900">John Doe</h2>
              <p className="text-sm text-slate-500 mt-1">john.doe@example.com</p>
            </CardContent>
          </Card>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-3">
            <Button 
              variant="default" 
              className="w-full justify-start gap-3 bg-[#3f4a5c] hover:bg-[#323b49] text-white h-12 rounded-xl text-base font-medium"
            >
              <Package className="w-5 h-5" />
              Orders
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-xl text-base font-medium"
            >
              <MapPin className="w-5 h-5" />
              Saved Addresses
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-xl text-base font-medium"
            >
              <User className="w-5 h-5" />
              Profile Settings
            </Button>

            <div className="my-2 border-t border-slate-200"></div>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl text-base font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Breadcrumb / Header Line */}
          <div className="border-b border-slate-200 mb-8">
            <span className="border-b-2 border-slate-900 pb-3 inline-block text-sm font-semibold text-slate-900">
              Your Orders
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Orders</h1>
            <p className="text-slate-600">Track, manage, and reorder your recent purchases.</p>
          </div>

          {/* Order List */}
          <div className="flex flex-col gap-5">
            {orderHistory.map((order) => (
              <Card key={order.id} className="rounded-2xl shadow-sm border-slate-100 overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="p-5 sm:p-6 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-2.5 rounded-xl">
                        <Store className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base">{order.store}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{order.date}</p>
                      </div>
                    </div>
                    <Badge 
                      className={`px-3 py-1 rounded-full font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-[#3db075] hover:bg-[#3db075]/90 text-white' 
                          : 'bg-[#3a82f7] hover:bg-[#3a82f7]/90 text-white'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  
                  <Separator />

                  {/* Order Body */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                    {/* Items */}
                    <div className="flex items-center gap-6 flex-wrap">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm ${item.bg}`}>
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium text-slate-700">x 1</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions & Total */}
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                      <div className="flex justify-between w-full md:w-auto gap-12 text-sm">
                        <span className="text-slate-600 font-medium">Total</span>
                        <span className="font-bold text-slate-900">${order.total}</span>
                      </div>
                      
                      <div className="flex gap-3 w-full md:w-auto">
                        <Button 
                          variant="outline" 
                          className="flex-1 md:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg h-10 px-5"
                        >
                          View Details
                        </Button>
                        <Button 
                          className="flex-1 md:flex-none bg-[#3f4a5c] hover:bg-[#323b49] text-white gap-2 font-medium rounded-lg h-10 px-5"
                        >
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
    </div>
  );
}