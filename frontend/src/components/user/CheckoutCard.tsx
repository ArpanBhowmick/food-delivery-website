import { ChevronRight, MapPin, Ticket } from 'lucide-react'
import React from 'react'

const CheckoutCard = () => {
  return (
    
    <>
    
    {/* RIGHT COLUMN: Sidebar / Order Menu */}
        <div className="xl:col-span-4 2xl:col-span-3">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm sticky top-6">
            {/* Address Details */}
            <div className="mb-8">
              <h3 className="text-gray-400 text-sm mb-2">Your Address</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="text-orange-500" size={20} />
                  <span className="font-bold text-gray-800">
                    Elm Street, 23
                  </span>
                </div>
                <button className="text-xs font-semibold text-orange-500 border border-orange-200 rounded-lg px-3 py-1 hover:bg-orange-50 cursor-pointer">
                  Change
                </button>
              </div>
              <p className="text-gray-400 text-xs mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                  Add Details
                </button>
                <button className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                  Add Note
                </button>
              </div>
            </div>

            {/* Order Menu */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Order Menu</h2>
              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=100"
                      alt="Pizza"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Pepperoni Pizza
                      </h4>
                      <p className="text-gray-400 text-xs">x1</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-800">
                    +$5.59
                  </span>
                </div>
                {/* Item 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=100"
                      alt="Burger"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Cheese Burger
                      </h4>
                      <p className="text-gray-400 text-xs">x1</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-800">
                    +$5.59
                  </span>
                </div>
                {/* Item 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100"
                      alt="Vegan Pizza"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Vegan Pizza
                      </h4>
                      <p className="text-gray-400 text-xs">x1</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-800">
                    +$5.59
                  </span>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Service</span>
                <span className="font-bold text-sm text-gray-800">+$1.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-extrabold text-xl text-gray-800">
                  <span className="text-orange-500">$</span>202.00
                </span>
              </div>
            </div>

            {/* Coupon Code */}
            <button className="w-full bg-orange-50 border border-orange-200 rounded-xl py-3 px-4 flex items-center justify-between mb-4 group hover:bg-orange-100 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 rounded-lg p-1.5 text-white">
                  <Ticket size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition">
                  Have a coupon code?
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </button>

            {/* Checkout Button */}
            <button className="w-full bg-[#f09319] hover:bg-orange-500 text-white font-bold rounded-xl py-4 transition duration-200 shadow-md shadow-orange-200 cursor-pointer">
              Checkout
            </button>
          </div>
        </div>

    </>

  )
}

export default CheckoutCard