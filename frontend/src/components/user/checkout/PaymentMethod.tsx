import type { PaymentMethodType } from "@/types/payment";
import { Banknote, ChevronRight, IndianRupee, QrCode } from "lucide-react";
import { FaGooglePay } from "react-icons/fa";

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType | null;
  onMethodChange: (method: PaymentMethodType) => void;
  onQrSelect: () => void;
  onUpiSelect: () => void;
}

const PaymentMethod = ({
  selectedMethod,
  onMethodChange,
  onQrSelect,
  onUpiSelect,
}: PaymentMethodProps) => {
  return (
    <section className="mb-6">
      {/* ================= UPI ================= */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            {/* <Smartphone className="h-4 w-4 text-blue-600" /> */}
            <QrCode className="h-4 w-4 text-blue-600" />
          </div>

          <h3 className="text-sm font-bold text-gray-900">Pay via QR Code</h3>
        </div>

        <button
          type="button"
          onClick={onQrSelect}
          className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <QrCode className="h-6 w-6 text-gray-500" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                Pay via QR Code
              </span>

              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                NEW
              </span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-pink-500" />
        </button>
      </div>

      {/* ================= CREDIT / DEBIT CARD ================= */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            <FaGooglePay className="h-6 w-6 text-blue-600" />
          </div>

          <h3 className="text-sm font-bold text-gray-900">
            Pay Using UPI, Cards & More
          </h3>
        </div>

        <button
          type="button"
          onClick={onUpiSelect}
          className="flex w-full items-center gap-4 rounded-xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <IndianRupee className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold text-gray-900">
              Pay Using UPI, Cards &amp; More
            </span>

            <span className="mt-0.5 text-xs text-emerald-600">
              UPI, Credit/Debit Cards, Net Banking
            </span>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-pink-500" />
        </button>
      </div>

      {/* ================= CASH ON DELIVERY ================= */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
            <Banknote className="h-4 w-4 text-rose-600" />
          </div>

          <h3 className="text-sm font-bold text-gray-900">Cash on Delivery</h3>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* COD option */}
          <button
            type="button"
            onClick={() => onMethodChange("cod")}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                selectedMethod === "cod" ? "border-rose-600" : "border-gray-400"
              }`}
            >
              {selectedMethod === "cod" && (
                <div className="h-2 w-2 rounded-full bg-rose-600" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Cash on Delivery
              </p>

              <p className="mt-0.5 flex items-center gap-1 text-xs text-rose-600">
                <Banknote className="h-3 w-3" />
                Pay when your order arrives
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethod;
