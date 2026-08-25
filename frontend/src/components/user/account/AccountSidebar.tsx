import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { RootState } from "@/store/store";
import { LogOut, MapPin, Package, User } from 'lucide-react'
import { useSelector } from "react-redux";



const AccountSidebar = () => {

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
    
    {/* Left Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          {/* Profile Card */}
          <Card className="mb-6 rounded-2xl shadow-sm border-slate-100">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-2 bg-slate-200">
                <AvatarFallback className="text-xl font-medium text-slate-600 bg-[#d5dae1]">
                  {user?.name
    ? user.name.charAt(0).toUpperCase()
    : ""}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-slate-900">{user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : ""}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {user?.mobile ? `+91 ${user.mobile}` : ""}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {user?.email}
              </p>
            </CardContent>
          </Card>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-3">
            <Button
              variant="default"
              className="w-full cursor-pointer justify-start gap-3 bg-[#3f4a5c] hover:bg-[#323b49] text-white h-12 rounded-xl text-base font-medium"
            >
              <Package className="w-5 h-5" />
              Orders
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-xl text-base font-medium"
            >
              <MapPin className="w-5 h-5" />
              Saved Addresses
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-xl text-base font-medium"
            >
              <User className="w-5 h-5" />
              Profile Settings
            </Button>

            <div className="my-2 border-t border-slate-200"></div>

            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-3 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl text-base font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>

    </>
  )
}

export default AccountSidebar