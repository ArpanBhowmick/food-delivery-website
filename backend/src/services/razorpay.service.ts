import type { Orders } from "razorpay/dist/types/orders.js";
import { getRazorpayInstance } from "../config/razorpay.js";





// Store Razorpay conversion and validation rules.
const PAISE_PER_RUPEE = 100;
const MINIMUM_AMOUNT_IN_PAISE = 100;
const MAXIMUM_RECEIPT_LENGTH = 40;

// This application only charges in rupees.
const PAYMENT_CURRENCY = "INR";

// A Razorpay order created through the Orders API.
export type RazorpayOrder = Orders.RazorpayOrder;

// The values the order controller provides to create a Razorpay order.
export interface CreateRazorpayOrderInput {
  amountInRupees: number;
  receipt: string;
}

// Return the public Razorpay key for Checkout.
export const getRazorpayKeyId = (): string => {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

  if (!razorpayKeyId) {
    throw new Error("Razorpay key is not configured.");
  }

  return razorpayKeyId;
};

// Convert the order amount from rupees to paise.
const toAmountInPaise = (amountInRupees: number): number => {
  if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) {
    throw new Error("Payment amount must be a valid number greater than zero.");
  }

  const amountInPaise = Math.round(amountInRupees * PAISE_PER_RUPEE);

  if (amountInPaise < MINIMUM_AMOUNT_IN_PAISE) {
    throw new Error("Payment amount must be at least INR 1.00.");
  }

  return amountInPaise;
};

// Validate the receipt before sending it to Razorpay.
const validateReceipt = (receipt: string): string => {
  if (typeof receipt !== "string" || !receipt.trim()) {
    throw new Error("A receipt is required to create a Razorpay order.");
  }

  const trimmedReceipt = receipt.trim();

  // Razorpay does not accept a receipt longer than 40 characters.
  if (trimmedReceipt.length > MAXIMUM_RECEIPT_LENGTH) {
    throw new Error(
      `Receipt cannot be longer than ${MAXIMUM_RECEIPT_LENGTH} characters.`,
    );
  }

  return trimmedReceipt;
};

// Create a Razorpay order.
export const createRazorpayOrder = async ({
  amountInRupees,
  receipt,
}: CreateRazorpayOrderInput): Promise<RazorpayOrder> => {
  const razorpayOrderRequest: Orders.RazorpayOrderCreateRequestBody = {
    amount: toAmountInPaise(amountInRupees),
    currency: PAYMENT_CURRENCY,
    receipt: validateReceipt(receipt),
  };

  try {
    return await getRazorpayInstance().orders.create(razorpayOrderRequest);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Failed to create the Razorpay order: ${reason}`);
  }
};

// Create a single-use Razorpay UPI QR for an order.
export const createRazorpayQr = async (
  amountInRupees: number,
  orderId: string,
) => {
  const closeBy = Math.floor(Date.now() / 1000) + 5 * 60;

   return await getRazorpayInstance().qrCode.create({
    type: "upi_qr",
    name: "Zest",
    usage: "single_use",
    fixed_amount: true,
    payment_amount: Math.round(amountInRupees * 100),
    description: `Payment for order ${orderId}`,
    close_by: closeBy,
    notes: {
      orderId,
    },
  });
};


// export const expireRazorpayQr = async (qrCodeId: string) => {
//   return await getRazorpayInstance().qrCode.close(qrCodeId);
// };


// cancellation of the QR
export const cancelRazorpayQr = async (qrCodeId: string) => {
  const razorpay = getRazorpayInstance();

  return await razorpay.qrCode.close(qrCodeId);
  
};

// export const cancelRazorpayQr = async (qrCodeId: string) => {
//   const razorpay = getRazorpayInstance();

//   const result = await razorpay.qrCode.close(qrCodeId);

//   console.log("🛑 Razorpay QR closed:", result);

//   return result;
// };