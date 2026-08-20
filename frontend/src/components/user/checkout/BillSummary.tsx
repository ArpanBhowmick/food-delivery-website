import type { CartItem } from "@/store/cartSlice";

interface BillSummaryProps {
  itemTotal: number;
  deliveryFee: number;
  cartItems: CartItem[];
}

const BillSummary = ({
  itemTotal,
  cartItems,
  deliveryFee,
}: BillSummaryProps) => {
  return (
    <div>
      {/* Bill Summary */}
      <h3 className="font-bold text-gray-900 text-base mb-3">Bill Summary</h3>

      <div className="border border-gray-300 shadow-none rounded-xl p-4 mb-6 space-y-3.5 text-sm bg-white hover:shadow-md transition-shadow">
        {cartItems.map((cartItem) => (
          <div
            key={cartItem.item._id}
            className="flex justify-between text-gray-600"
          >
            <span>
              {cartItem.item.name}
              {cartItem.quantity > 1 && ` × ${cartItem.quantity}`}
            </span>

            <span className="text-gray-900 font-medium">
              ₹{cartItem.item.price * cartItem.quantity}
            </span>
          </div>
        ))}

        <div className="flex justify-between text-gray-600 border-t border-dashed border-gray-200 pt-3">
           <span>Delivery Fee</span>

  {deliveryFee === 0 ? (
    <span className="text-green-600 font-bold">FREE</span>
  ) : (
    <span className="text-gray-900 font-medium">
      ₹{deliveryFee}
    </span>
  )}
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
              ₹{itemTotal + deliveryFee}
            </span>

            <span className="text-gray-900 text-lg">₹{itemTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
