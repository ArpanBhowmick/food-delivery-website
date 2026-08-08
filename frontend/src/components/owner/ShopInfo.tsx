import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Clock, MapPin, Phone, Utensils } from 'lucide-react'
import type { IShop } from '@/types/shop.types';

interface ShopInfoProps {
  shop: IShop;
}


export const ShopGeneralInfo = ({shop}: ShopInfoProps) => {
  return (
    <>
     {/* General Information Card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold uppercase tracking-wide">
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between mt-2">
                <div className="space-y-3 text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>
                      {shop.address}, {shop.city}, {shop.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-slate-500" />
                    <span>Cuisine: Italian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Contact: 123-456-7890 / manager@taste.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Hours: Mon-Sun: 11:00 AM - 10:00 PM</span>
                  </div>
                </div>
                {/* Placeholder for Google Map image */}
                <div className="w-32 h-24 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                  <img
                    src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png"
                    alt="Map location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
    </>
  )
}
