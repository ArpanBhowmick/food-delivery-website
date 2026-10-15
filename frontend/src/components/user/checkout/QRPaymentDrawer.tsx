import { useEffect, useState } from "react";
import { Clock, ImageOff, LoaderCircle, ScanLine, X } from "lucide-react";
import { FaGooglePay } from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";
import type { IconType } from "react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetOverlay,
} from "@/components/ui/sheet";
import usePaymentApi from "@/hook/usePaymentApi";
import PaymentCancelConfirmationModal from "@/components/modals/payment/PaymentCancelConfirmationModal";

interface RazorpayQrData {
  id: string;
  image_url: string;
  qrExpiresAt: string;
}

// Props passed by the checkout drawer.
interface QRPaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrData: RazorpayQrData | null;
  amount: number;
  address: string;
}

// One UPI app logo entry.
interface UpiAppLogo {
  name: string;
  Icon: IconType;
  color: string;
}

// UPI apps listed under the QR.
const upiAppLogos: UpiAppLogo[] = [
  { name: "Google Pay", Icon: FaGooglePay, color: "#4285F4" },
  { name: "PhonePe", Icon: SiPhonepe, color: "#5F259F" },
  { name: "Paytm", Icon: SiPaytm, color: "#00BAF2" },
];

const QRPaymentDrawer = ({
  open,
  onOpenChange,
  qrData,
  amount,
  address,
}: QRPaymentDrawerProps) => {
  const { cancelQrCode, expireQrCode } = usePaymentApi();

  // Broken QR image URL, if any.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // Seconds left on the QR.
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Modal for cancellation confirmation
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // QR image display flags.
  const imageUrl = qrData?.image_url;
  const isLoading = !imageUrl;
  const showQrImage = Boolean(imageUrl) && failedUrl !== imageUrl;

  // cancellation of QR
  const handleCancelQr = async () => {
  console.log("🟡 X clicked - starting QR cancellation");

  if (!qrData?.id) {
    console.error("🔴 QR ID is missing");
    return;
  }

  console.log("🟡 QR ID:", qrData.id);

  try {
    const result = await cancelQrCode(qrData.id);

    console.log("🟢 QR cancellation API succeeded:", result);

    onOpenChange(false);

    console.log("🟢 QR drawer closed");
  } catch (error) {
    console.error("🔴 QR cancellation failed:", error);
  }
};

  // Calculate the remaining time from Razorpay's expiration timestamp.
  useEffect(() => {
    if (!open || !qrData?.qrExpiresAt) return;

    let hasExpired = false;

    const updateCountdown = async () => {
      const expiresAt = new Date(qrData.qrExpiresAt).getTime();
      const now = Date.now();

      const remainingSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));

      setSecondsLeft(remainingSeconds);

      
if (remainingSeconds === 0 && !hasExpired) {
  hasExpired = true;
  console.log("⏰ QR EXPIRED — updating payment status");

  try {
    if (qrData?.id) {
      await expireQrCode(qrData.id);
    }
  } catch (error) {
    console.error("Failed to update expired QR payment:", error);
  } finally {
    onOpenChange(false);
  }
}

    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [open, qrData?.qrExpiresAt, onOpenChange]);



  useEffect(() => {
    setFailedUrl(null);
  }, [imageUrl]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="!w-[500px] !max-w-[500px] !p-0 !gap-0 flex flex-col bg-[#f2f5f8]"
          showCloseButton={false}
          showOverlay={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          {/* Screen-reader-only heading. */}
          <SheetTitle className="sr-only">
            Scan and pay using the UPI QR code
          </SheetTitle>

          {/* Screen-reader-only description. */}
          <SheetDescription className="sr-only">
            Scan the QR code with any UPI app and enter your UPI PIN to complete
            the payment.
          </SheetDescription>

          {/* Header: close button, title, address. */}
          <div className="shrink-0 bg-white pt-2">
            <div className="flex h-14 items-center gap-3 px-4">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-gray-900"
                aria-label="Close QR payment"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>

              <div className="flex min-w-0 flex-col">
                <h2 className="truncate text-lg font-extrabold leading-tight text-gray-900">
                  Scan &amp; Pay via UPI
                </h2>

                <p className="mt-0.5 truncate text-xs leading-tight text-gray-500">
                  {address}
                </p>
              </div>
            </div>

            {/* Sticky "To Pay" bar. */}
            <div className="shrink-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-t border-gray-100 z-10 px-4 py-3">
              <div className="text-base font-bold text-gray-900">
                To Pay: <span className="text-[#059669]">₹{amount}</span>
              </div>
            </div>
          </div>

          {/* Scrollable QR body. */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* White card: amount + QR. */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-base font-bold text-gray-900">
                  To Pay:{" "}
                  <span className="text-lg font-extrabold text-gray-900">
                    ₹{amount}
                  </span>
                </div>

                {/* QR image / loading / error states. */}
                <div className="relative h-72 w-72 overflow-hidden rounded-xl bg-white">
                  {showQrImage ? (
                    <img
                      src={imageUrl}
                      alt="UPI QR code to scan and pay"
                      onError={() => setFailedUrl(imageUrl ?? null)}
                      className="absolute left-1/2 top-1/2 h-[520px] w-[360px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                    />
                  ) : isLoading ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <LoaderCircle className="h-8 w-8 animate-spin text-gray-400" />

                      <p className="text-sm font-medium text-gray-600">
                        Generating your QR code...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                      <ImageOff className="h-8 w-8 text-gray-400" />

                      <p className="text-sm font-medium text-gray-600">
                        QR code could not be loaded
                      </p>

                      <p className="text-xs text-gray-500">
                        Close this drawer and try placing the order again.
                      </p>
                    </div>
                  )}
                </div>

                {/* Scan hint row. */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <ScanLine className="h-4 w-4 text-blue-600" />
                  Scan and pay using any UPI app
                </div>

                {/* UPI app logos. */}
                <div className="mt-5 flex items-center justify-center gap-6">
                  {upiAppLogos.map(({ name, Icon, color }) => (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-1.5"
                      aria-label={name}
                    >
                      <Icon className="h-8 w-8" style={{ color }} />

                      <span className="text-[11px] font-semibold text-gray-600">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Countdown label. */}
            <div className="mt-4 text-center text-sm font-semibold text-gray-900">
              QR code is valid for {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")} mins
            </div>
          </div>
          {/* Security note. */}
          <div className="shrink-0 bg-[#f2f5f8] px-5 py-4">
            <p className="text-center text-xs leading-relaxed text-gray-500">
              Share this QR code with trusted individuals, not publicly or with
              strangers. You are responsible for who you allow to pay.
            </p>
          </div>
          {/* Amber warning: don't close/refresh. */}
          <div className="shrink-0 bg-amber-50 px-5 py-3">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>
                Do not close or refresh this screen until the payment succeeds
              </span>
            </div>
          </div>
        </SheetContent>

        <SheetOverlay className="!bg-black/50 !backdrop-blur-none" />
      </Sheet>

      <PaymentCancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          setIsCancelModalOpen(false);
          handleCancelQr();
        }}
      />
    </>
  );
};

export default QRPaymentDrawer;
