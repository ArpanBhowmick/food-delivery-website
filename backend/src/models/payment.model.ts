import mongoose from "mongoose";

export interface IPayment {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  method: "cod" | "qr" | "upi";

  status: "pending" | "paid" | "failed" | "refunded";

  amount: number;
  currency: "INR";

  provider?: "razorpay";

  providerOrderId?: string;
  providerPaymentId?: string;

  qrCodeId?: string;
  qrExpiresAt?: Date;

  paidAt?: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    method: {
      type: String,
      enum: ["cod", "qr", "upi"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
    },

    provider: {
      type: String,
      enum: ["razorpay"],
    },

    providerOrderId: {
      type: String,
    },

    providerPaymentId: {
      type: String,
    },

    qrCodeId: {
      type: String,
    },

    qrExpiresAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
