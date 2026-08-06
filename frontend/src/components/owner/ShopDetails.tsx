import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Eye,
  Pencil,
  Trash2,
  Settings,
  Folder,
  List,
  MapPin,
  Utensils,
  Phone,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import RecentOrders from "./RecentOrders";
import ShopInfo from "./ShopInfo";
import { MenuOverview } from "./MenuOverview";
import { AddFirstItem } from "./AddFirstItem";

export default function ShopDetails() {

  // const recentOrders = [
  //   {
  //     id: "#10123",
  //     customer: "Emily J.",
  //     items: "2x Margherita",
  //     date: "Oct 26, 7:15 PM",
  //     status: "Completed",
  //     total: "$38.50",
  //   },
  //   {
  //     id: "#10124",
  //     customer: "Mike D.",
  //     items: "1x Lasagna\n1x Gelato",
  //     date: "Oct 26, 7:10 PM",
  //     status: "Completed",
  //     total: "$29.00",
  //   },
  //   {
  //     id: "#10125",
  //     customer: "Sarah K.",
  //     items: "1x Risotto",
  //     date: "Oct 26, 7:05 PM",
  //     status: "In Progress",
  //     total: "$21.50",
  //   },
  //   {
  //     id: "#10126",
  //     customer: "David L.",
  //     items: "3x Ravioli",
  //     date: "Oct 26, 6:55 PM",
  //     status: "Completed",
  //     total: "$55.00",
  //   },
  // ];

  const menuItems = [];

  const { shopId } = useParams();
  const shop = useSelector((state: RootState) =>
    state.shop.shops.find((shop) => shop._id === shopId),
  );

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 text-slate-600 font-semibold rounded-md border-slate-300"
          >
            <Link to="/owner">
              <ArrowLeft className="w-4 h-4" />
              BACK TO ALL SHOPS
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {shop.name} - Shop Details
          </h1>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Dynamic date: <span className="text-slate-800">October 26, 2023</span>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6 shadow-sm">
        {/* Placeholder for the pizza oven image */}
        <img
          src={shop.image.url || "/placeholder-shop.jpg"}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold">{shop.name}</h2>
              <Badge className="bg-green-200 text-green-800 hover:bg-green-200 border-none font-semibold px-2 py-0.5">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <span className="flex items-center gap-1 text-white">
                4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <span>|</span>
              <span>$24.5k Revenue</span>
              <span>|</span>
              <span>1,120 Orders</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Middle Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

     {menuItems.length === 0 ? (
    <AddFirstItem shopId={shop._id} />
  ) : (
    <MenuOverview />
  )}
      

<ShopInfo shop={shop}/>

      </div>

     

      <RecentOrders/>

    </div>
  );
}
