import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import DeliveryLocation from "./checkout/DeliveryLocation";
import RazorpayCheckout from "@razorpay/razorpay-js/checkout";
import { useEffect, useState } from "react";
import BillSummary from "./checkout/BillSummary";
import { clearCart, type CartItem } from "@/store/cartSlice";
import useOrderApi from "@/hook/useOrderApi";
import { useNavigate } from "react-router-dom";
import QRPaymentDrawer from "./checkout/QRPaymentDrawer";
import type { PaymentMethodType } from "@/types/payment";
import PaymentMethod from "./checkout/PaymentMethod";

// Define the checkout drawer inputs.
interface CheckoutDrawerProps {
  isCheckoutOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  cartItems: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  onCloseCart: () => void;
  onOpenCart: () => void;
}

const CheckoutDrawer = ({
  isCheckoutOpen,
  onOpenChange,
  onBack,
  cartItems,
  itemTotal,
  deliveryFee,
  onCloseCart,
  onOpenCart,
}: CheckoutDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  // Access the order creation API.
  const { createOrder, verifyCheckoutPayment } = useOrderApi();

  // Read the selected delivery location.
  const location = useSelector((state: RootState) => state.location);

  // Track the selected payment method.
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null,
  );

  // Track whether the order is being placed.
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState<{
    id: string;
    image_url: string;
    qrExpiresAt: string;
  } | null>(null);

  const [qrAmount, setQrAmount] = useState<number | null>(null);

  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // Calculate the amount payable.
  const finalTotal = itemTotal + deliveryFee;

  const handleCloseQrDrawer = () => {
    setQrOpen(false);
    onOpenChange(false);

    // Use setTimeout to ensure the drawer close animation begins before reopening the cart drawer
    // This avoids competing drawer animations.
    setTimeout(() => {
      onOpenCart();
    }, 300);
  };

  const handleQrPayment = async () => {
    if (isPlacingOrder) return;

    if (location.latitude === null || location.longitude === null) {
      console.error("Delivery location is not selected");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const result = await createOrder({
        cartItems,
        paymentMethod: "qr",
        deliveryAddress: {
          text: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      setQrData({
        id: result.qr.id,
        image_url: result.qr.image_url,
        qrExpiresAt: result.payment.qrExpiresAt,
      });
      setQrAmount(result.order.pricing.totalAmount);
      setQrOpen(true);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create QR payment:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Create the UPI order and open Razorpay Checkout automatically.
  const handleUpiPayment = async () => {
    if (isPlacingOrder) return;

    if (location.latitude === null || location.longitude === null) {
      console.error("Delivery location is not selected");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const result = await createOrder({
        cartItems,
        paymentMethod: "upi",
        deliveryAddress: {
          text: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      const checkoutData = result.razorpay;

      if (
        !checkoutData?.keyId ||
        !checkoutData?.orderId ||
        !checkoutData?.amount ||
        !checkoutData?.currency
      ) {
        throw new Error("Razorpay Checkout details are missing");
      }

      const checkout = await RazorpayCheckout({
        key: checkoutData.keyId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        order_id: checkoutData.orderId,
        name: "Food Delivery",
        description: "Order payment",
        modal: {
          ondismiss: () => {
            setIsRazorpayOpen(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verification = await verifyCheckoutPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verification.success) {
              throw new Error("Payment verification failed");
            }

            setOrderPlaced(true);
            dispatch(clearCart());
            onOpenChange(false);
            onCloseCart();
            navigate("/orderSuccess");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert(
              "We couldn't confirm your payment. Please check your order before trying again.",
            );
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);
        alert("Payment failed. You can try again.");
      });

      setIsRazorpayOpen(true);
      checkout.open();
    } catch (error) {
      console.error("Failed to start UPI payment:", error);
      alert("Unable to start UPI payment. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Validate checkout data and place the order.
  const handlePlaceOrder = async () => {
    if (orderPlaced || isPlacingOrder) return;

    if (!paymentMethod) return;

    if (location.latitude === null || location.longitude === null) {
      console.error("Delivery location is not selected");
      return;
    }

    if (paymentMethod === "upi") {
      await handleUpiPayment();
      return;
    }

    try {
      setIsPlacingOrder(true);

      const result = await createOrder({
        cartItems,
        paymentMethod,
        deliveryAddress: {
          text: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      console.log("Order created:", result);

      // COD success flow.
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

  useEffect(() => {
    const root = document.getElementById("root");

    if (!root) return;

    root.inert = isRazorpayOpen;

    return () => {
      root.inert = false;
    };
  }, [isRazorpayOpen]);

  // Render the checkout drawer.
  return (
    <>
      <Sheet
        open={isCheckoutOpen}
        onOpenChange={onOpenChange}
        modal={!isRazorpayOpen}
      >
        <SheetContent
          side="right"
          inert={isRazorpayOpen}
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
              onQrSelect={handleQrPayment}
              onUpiSelect={handleUpiPayment}
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
                ? "Processing..."
                : !paymentMethod
                  ? "Select Payment Method"
                  : paymentMethod === "cod"
                    ? `Pay ₹${finalTotal} On Delivery`
                    : `Pay ₹${finalTotal}`}
            </button>
          </div>
        </SheetContent>

        {/* Display the drawer overlay. */}
        <SheetOverlay className="!bg-black/50 !backdrop-blur-none" />
      </Sheet>

      <QRPaymentDrawer
        open={qrOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseQrDrawer();
          }
        }}
        qrData={qrData}
        amount={qrAmount ?? 0}
        address={location.address}
      />
    </>
  );
};

export default CheckoutDrawer;
