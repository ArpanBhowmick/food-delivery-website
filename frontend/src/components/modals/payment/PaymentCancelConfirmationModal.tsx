import React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";

interface PaymentCancelConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentCancelConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: PaymentCancelConfirmationModalProps) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Cancel Payment?
          </h3>

          <p className="mb-6 text-sm text-gray-500">
            Are you sure you want to cancel this payment? The current QR code will be cancelled and you will need to start over to complete your purchase.
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
            >
              Cancel Payment
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Keep Paying
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default PaymentCancelConfirmationModal;
