import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DeliveryLocation from "./checkout/DeliveryLocation";
import PaymentMethod, {
  type PaymentMethodType,
} from "./checkout/PaymentMethod";
import { useEffect, useState } from "react";
import BillSummary from "./checkout/BillSummary";
import type { CartItem } from "@/store/cartSlice";

interface CheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  cartItems: CartItem[];
  itemTotal: number;
  deliveryFee: number;
}

const CheckoutDrawer = ({
  open,
  onOpenChange,
  onBack,
  cartItems,
  itemTotal,
  deliveryFee,
}: CheckoutDrawerProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null,
  );

  // You can adjust the final total logic (e.g., subtracting savings) as needed
  const finalTotal = itemTotal + deliveryFee;

  useEffect(() => {
    if (open) {
      setPaymentMethod(null);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[500px] !max-w-[500px] !p-0 !gap-0 flex flex-col bg-[#f2f5f8]"
        showCloseButton={false}
        showOverlay={false}
      >
        {/* Header Section */}
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

        {/* Sticky To Pay Bar */}
        <div className="shrink-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-t border-gray-100 z-10 px-4 py-3">
          <div className="text-base font-bold text-gray-900">
            To Pay: <span className="text-[#059669]">₹{finalTotal}</span>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 px-5 custom-scrollbar">
          {/* Delivery Location */}
          <DeliveryLocation />

          {/* 1. Pay by UPI */}

          <PaymentMethod
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />

          {/* bill summery  */}

          <BillSummary
            cartItems={cartItems}
            itemTotal={itemTotal}
            deliveryFee={deliveryFee}
          />
          <button
            type="button"
            disabled={!paymentMethod}
            className={`mt-3  h-14 w-full rounded-xl text-base font-bold transition-colors  ${
              paymentMethod
                ? "bg-[#e11d48] hover:bg-[#e11d48] text-white "
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {paymentMethod
              ? `Pay ₹${finalTotal} On Delivery`
              : "Select Payment Method"}
          </button>
        </div>
      </SheetContent>

      <SheetOverlay className="!bg-black/50 !backdrop-blur-none" />
    </Sheet>
  );
};

export default CheckoutDrawer;
