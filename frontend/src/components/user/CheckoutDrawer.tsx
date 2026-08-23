// Import drawer, icons, state, and checkout components.
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import DeliveryLocation from "./checkout/DeliveryLocation";
import PaymentMethod, {
  type PaymentMethodType,
} from "./checkout/PaymentMethod";
import { useEffect, useState } from "react";
import BillSummary from "./checkout/BillSummary";
import { clearCart, type CartItem } from "@/store/cartSlice";
import useOrderApi from "@/hook/useOrderApi";
import { useNavigate } from "react-router-dom";

// Define the checkout drawer inputs.
interface CheckoutDrawerProps {
  isCheckoutOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  cartItems: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  onCloseCart: () => void;
}

const CheckoutDrawer = ({
  isCheckoutOpen,
  onOpenChange,
  onBack,
  cartItems,
  itemTotal,
  deliveryFee,
  onCloseCart,
}: CheckoutDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  // Read the selected delivery location.
  const location = useSelector((state: RootState) => state.location);

  // Track the selected payment method.
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null,
  );

  // Track whether the order is being placed.
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Access the order creation API.
  const { createOrder } = useOrderApi();

  // Calculate the amount payable.
  const finalTotal = itemTotal + deliveryFee;

  // Validate checkout data and place the order.
  const handlePlaceOrder = async () => {
    if (orderPlaced || isPlacingOrder) return;

    if (!paymentMethod) return;

    if (location.latitude === null || location.longitude === null) {
      console.error("Delivery location is not selected");
      return;
    }

    try {
      setIsPlacingOrder(true);

      await createOrder({
        cartItems,
        paymentMethod,
        deliveryAddress: {
          text: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      // Order was successfully created.
      setOrderPlaced(true);

      dispatch(clearCart());
      onOpenChange(false);
      onCloseCart();
      navigate("/orderSuccess");
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (isCheckoutOpen) {
      setPaymentMethod(null);
      setOrderPlaced(false);
    }
  }, [isCheckoutOpen]);

  // Render the checkout drawer.
  return (
    <Sheet open={isCheckoutOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[500px] !max-w-[500px] !p-0 !gap-0 flex flex-col bg-[#f2f5f8]"
        showCloseButton={false}
        showOverlay={false}
      >
        {/* Display the checkout header. */}
        <div className="shrink-0 bg-white relative z-20 pt-2">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="flex h-8 w-8 items-center justify-center text-gray-900 cursor-pointer"
              aria-label="Go back to cart"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
                Payment Options
              </h2>
              <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">
                Other - koyel apartment,flat no-4, 69A, Swinhoe Lane, Kolkata-
                70042...
              </p>
            </div>
          </div>
        </div>

        {/* Show the total payment amount. */}
        <div className="shrink-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-t border-gray-100 z-10 px-4 py-3">
          <div className="text-base font-bold text-gray-900">
            To Pay: <span className="text-[#059669]">₹{finalTotal}</span>
          </div>
        </div>

        {/* Display the scrollable checkout content. */}
        <div className="flex-1 overflow-y-auto p-4 px-5 custom-scrollbar">
          {/* Select the delivery location. */}
          <DeliveryLocation />

          {/* Select a payment method. */}
          <PaymentMethod
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />

          {/* Display the order bill summary. */}
          <BillSummary
            cartItems={cartItems}
            itemTotal={itemTotal}
            deliveryFee={deliveryFee}
          />
          {/* Submit the order. */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={!paymentMethod || isPlacingOrder}
            className={`mt-3  h-14 w-full rounded-xl text-base font-bold transition-colors cursor-pointer ${
              paymentMethod
                ? "bg-[#e11d48] hover:bg-[#e11d48] text-white "
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {isPlacingOrder
              ? "Placing Order..."
              : paymentMethod
                ? `Pay ₹${finalTotal} On Delivery`
                : "Select Payment Method"}
          </button>
        </div>
      </SheetContent>

      {/* Display the drawer overlay. */}
      <SheetOverlay className="!bg-black/50 !backdrop-blur-none" />
    </Sheet>
  );
};

export default CheckoutDrawer;
