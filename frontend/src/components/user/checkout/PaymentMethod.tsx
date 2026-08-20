import {
  Banknote,
  ChevronRight,
  CreditCard,
  Plus,
  QrCode,
  Smartphone,
} from "lucide-react";
import { FaGooglePay } from "react-icons/fa";


export type PaymentMethodType = "cod" | "upi" | "card";

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType | null;
  onMethodChange: (method: PaymentMethodType) => void;
}

const PaymentMethod = ({
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) => {
  return (
    <section className="mb-6">
      {/* ================= UPI ================= */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            {/* <Smartphone className="h-4 w-4 text-blue-600" /> */}
            <FaGooglePay className="h-10 w-10 text-blue-600"/>    
          </div>
    
          <h3 className="text-sm font-bold text-gray-900">Pay by UPI</h3>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50">
            <CreditCard className="h-4 w-4 text-pink-500" />
          </div>

          <h3 className="text-sm font-bold text-gray-900">
            Credit & Debit Cards
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="flex w-full items-center gap-4 rounded-xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-pink-100 bg-pink-50">
            <Plus className="h-5 w-5 text-pink-500" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-pink-500">
              Add New Card
            </span>

            <span className="mt-0.5 text-xs text-gray-400">
              Visa, Mastercard, Rupay & more
            </span>
          </div>
        </button>
      </div>

      {/* ================= CASH ON DELIVERY ================= */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
            <Banknote className="h-4 w-4 text-emerald-600" />
          </div>

          <h3 className="text-sm font-bold text-gray-900">
            Cash on Delivery
          </h3>
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
                selectedMethod === "cod"
                  ? "border-emerald-500"
                  : "border-gray-400"
              }`}
            >
              {selectedMethod === "cod" && (
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Cash on Delivery
              </p>

              <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
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

// export type PaymentMethodType = "upi" | "card" | "cod";

// interface PaymentMethodProps {
//   selectedMethod: PaymentMethodType;
//   onMethodChange: (method: PaymentMethodType) => void;
//   totalAmount: number;
// }

// const PaymentMethod = ({
//   selectedMethod,
//   onMethodChange,
//   totalAmount,
// }: PaymentMethodProps) => {
//   return (
//     <section className="mb-6">
//       <h3 className="mb-3 text-sm font-bold text-gray-900">
//         Payment Method
//       </h3>

//       <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
//         {/* UPI */}
//         <button
//           type="button"
//           onClick={() => onMethodChange("upi")}
//           className="flex w-full items-center gap-3 px-4 py-4 text-left"
//         >
//           <div
//             className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//               selectedMethod === "upi"
//                 ? "border-pink-500"
//                 : "border-gray-400"
//             }`}
//           >
//             {selectedMethod === "upi" && (
//               <div className="h-2 w-2 rounded-full bg-pink-500" />
//             )}
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-gray-900">
//               UPI
//             </p>

//             <p className="mt-0.5 text-xs text-gray-500">
//               Pay using UPI
//             </p>
//           </div>
//         </button>

//         <div className="border-t border-gray-200" />

//         {/* Credit / Debit Card */}
//         <button
//           type="button"
//           onClick={() => onMethodChange("card")}
//           className="flex w-full items-center gap-3 px-4 py-4 text-left"
//         >
//           <div
//             className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//               selectedMethod === "card"
//                 ? "border-pink-500"
//                 : "border-gray-400"
//             }`}
//           >
//             {selectedMethod === "card" && (
//               <div className="h-2 w-2 rounded-full bg-pink-500" />
//             )}
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-gray-900">
//               Credit / Debit Card
//             </p>

//             <p className="mt-0.5 text-xs text-gray-500">
//               Visa, Mastercard, RuPay
//             </p>
//           </div>
//         </button>

//         <div className="border-t border-gray-200" />

//         {/* Cash on Delivery */}
//         <div>
//           <button
//             type="button"
//             onClick={() => onMethodChange("cod")}
//             className="flex w-full items-center gap-3 px-4 py-4 text-left"
//           >
//             <div
//               className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//                 selectedMethod === "cod"
//                   ? "border-pink-500"
//                   : "border-gray-400"
//               }`}
//             >
//               {selectedMethod === "cod" && (
//                 <div className="h-2 w-2 rounded-full bg-pink-500" />
//               )}
//             </div>

//             <div>
//               <p className="text-sm font-semibold text-gray-900">
//                 Cash on Delivery
//               </p>

//               <p className="mt-0.5 text-xs text-gray-500">
//                 Pay when your order arrives
//               </p>
//             </div>
//           </button>

//           {selectedMethod === "cod" && (
//             <div className="px-4 pb-4">
//               <button
//                 type="button"
//                 className="h-11 w-full rounded-lg bg-pink-500 text-sm font-bold text-white transition hover:bg-pink-600"
//               >
//                 Pay ₹{totalAmount} on delivery
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PaymentMethod;
