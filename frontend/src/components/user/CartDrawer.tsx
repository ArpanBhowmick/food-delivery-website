import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  BadgePercent,
  Clock,
  Calendar,
  Minus,
  Plus,
  Tag,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { decreaseQuantity, increaseQuantity } from "@/store/cartSlice";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DELIVERY_FEE = 40;

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemCount = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  

  // total billing
  const itemTotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[500px] !max-w-[500px] !p-0 !gap-0 flex flex-col bg-white "
        showCloseButton={false}
        showOverlay={false}
      >
        {/* Cart Header */}
        <div className="shrink-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.22)] relative z-20">
          <div className="flex items-center gap-3 px-4 h-12">
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close cart"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-bold text-gray-900">Cart</h2>
          </div>

          {/* Savings bar */}
          {cartItems.length > 0 && (
            <div className="h-7 flex items-center justify-center bg-[#e9f7ee] text-xs text-green-700">
              <Tag className="w-3.5 h-3.5 mr-1" />

              <span>
                You are saving{" "}
                <span className="font-bold">₹{DELIVERY_FEE}</span> on this
                order
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 px-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full rounded-2xl bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  Your cart is empty
                </h3>

                <Button
                  onClick={() => onOpenChange(false)}
                  className="mt-5 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white"
                >
                  Browse Products
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Coupons & Promos */}
              <div className="bg-[#f0f9f6] border border-[#c5e8d8] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BadgePercent className="w-5 h-5 text-pink-500 fill-pink-100" />
                  <span className="font-semibold text-gray-800 text-sm">
                    Coupons & Promos
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 border border-gray-300 shadow-sm rounded-lg bg-white overflow-hidden">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <div className="border border-dashed border-gray-400 w-4 h-4 rounded-sm"></div>
                    </div>
                    <Input
                      placeholder="Enter coupon code"
                      className="border-0 focus-visible:ring-0 pl-10 h-10 shadow-none"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="text-pink-500 border-pink-200 bg-pink-50/50 hover:bg-pink-50 hover:text-pink-600 h-10 px-6 font-semibold shadow-sm cursor-pointer"
                  >
                    Apply
                  </Button>
                </div>
                <button className="mt-3 w-full flex items-center justify-between bg-white border border-pink-300 shadow-sm rounded-lg px-3 h-10 hover:shadow-md hover:border-pink-400 transition-all cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pink-600 text-sm tracking-wide">
                      SAVE50
                    </span>
                    <span className="text-xs text-gray-500">
                      50% off up to ₹50
                    </span>
                  </div>
                  <span className="text-pink-500 font-semibold text-sm">
                    Apply
                  </span>
                </button>
              </div>

              {/* Delivery Info & Items Card */}
              <div className="border border-gray-300 shadow-none rounded-xl mb-6 bg-white overflow-hidden hover:shadow-md transition-shadow">
                {/* Delivery Time Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-800" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        Delivering in 6 mins
                      </h4>
                      <p className="text-xs text-gray-500">
                        {itemCount} item{itemCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold shadow-sm rounded-lg border-gray-300 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                    Schedule
                  </Button>
                </div>

                {/* Cart Items */}
                {cartItems.map((cartItem) => (
                  <div key={cartItem.item._id} className="p-4 flex gap-4">
                    <div className="w-16 h-16 border border-gray-200 rounded-lg p-1 shrink-0">
                      <img
                        src={cartItem.item.image?.url ?? "/placeholder-shop.jpg"}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h5 className="text-sm font-medium text-gray-800 leading-tight">
                            {cartItem.item.name}
                          </h5>

                          <p className="text-xs text-gray-400 mt-1">
                            {cartItem.item.category}
                          </p>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-4 bg-pink-50 text-pink-600 rounded-lg px-2.5 py-1.5 border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                            <button
                              onClick={() =>
                                dispatch(decreaseQuantity(cartItem.item._id))
                              }
                            >
                              <Minus className="w-3.5 h-3.5 cursor-pointer" />
                            </button>

                            <span className="text-sm font-semibold">
                              {cartItem.quantity}
                            </span>

                            <button
                              onClick={() =>
                                dispatch(increaseQuantity(cartItem.item._id))
                              }
                            >
                              <Plus className="w-3.5 h-3.5 cursor-pointer" />
                            </button>
                          </div>

                          <span className="font-bold text-sm text-green-700 mt-1.5">
                            ₹{cartItem.item.price * cartItem.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Items Prompt */}
                <div className="p-3 bg-[#fafafa] border-t border-gray-200 border-dashed text-center text-sm">
                  <span className="font-medium text-gray-900">
                    Forgot something?{" "}
                  </span>
                  <span className="text-pink-500 cursor-pointer font-semibold hover:underline">
                    Add More Items
                  </span>
                </div>
              </div>

              {/* Bill Summary */}
              <h3 className="font-bold text-gray-900 text-base mb-3">
                Bill Summary
              </h3>
              <div className="border border-gray-300 shadow-none rounded-xl p-4 mb-6 space-y-3.5 text-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="text-gray-900 font-medium">₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Handling Fee</span>
                  <div className="space-x-2">
                    <span className="line-through text-gray-400">₹40</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 mt-1 flex justify-between font-bold text-base items-center">
                  <span className="text-gray-900">To Pay</span>
                  <div className="space-x-2 flex items-center">
                    <span className="line-through text-gray-400 text-sm font-medium">
                      ₹{itemTotal + DELIVERY_FEE}
                    </span>
                    <span className="text-gray-900 text-lg">₹{itemTotal}</span>
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              <div className="bg-[#e2f6ea] rounded-xl p-4 border border-[#a6ddbf] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-green-700 mb-3 text-sm font-medium">
                  <Tag className="w-4 h-4 fill-green-200" />
                  <span>
                    You are saving{" "}
                    <span className="font-bold">₹{DELIVERY_FEE}</span> on this
                    order
                  </span>
                </div>
                <div className="bg-white rounded-lg p-2.5 px-3 flex justify-between items-center text-sm shadow-sm border border-[#cfece0]">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 rounded-full w-5 h-5 flex items-center justify-center">
                      <IndianRupee className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-800">Savings on Delivery Fee</span>
                  </div>
                  <span className="text-green-600 font-bold">₹{DELIVERY_FEE}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Checkout Button */}
        {cartItems.length > 0 && (
          <div className="shrink-0 p-4 bg-white border-t border-gray-200">
            <Button className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white h-14 rounded-xl flex justify-between px-6 text-lg font-medium shadow-md transition-all cursor-pointer">
              <span>Proceed to Checkout</span>
              <span className="font-bold">₹{itemTotal}</span>
            </Button>
          </div>
        )}
      </SheetContent>

      <SheetOverlay className="!bg-black/50 !backdrop-blur-none" />
    </Sheet>
  );
};

export default CartDrawer;