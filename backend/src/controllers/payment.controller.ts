import type { Response } from "express";
import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { cancelRazorpayQr } from "../services/razorpay.service.js";
import type { AuthRequest } from "../types/types.js";

import { getRazorpayInstance } from "../config/razorpay.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

// Explicit user cancellation of the QR shown in the payment drawer.
export const cancelQrCode = async (req: AuthRequest, res: Response) => {
  try {
    const { qrCodeId } = req.body;

    // Validate the QR code id sent by the frontend.
    if (!qrCodeId || typeof qrCodeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "QR code ID is required",
      });
    }

    // Require an authenticated user.
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Load the payment that owns this QR, scoped to the authenticated user.
    const payment = await Payment.findOne({
      qrCodeId,
      user: req.userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this QR code",
      });
    }

    // Close the QR at Razorpay first. Nothing is marked cancelled on failure.
    await cancelRazorpayQr(qrCodeId);

    payment.status = "failed";
    await payment.save();

    // Cancel the linked order only when it still belongs to this user.
    await Order.findOneAndUpdate(
      { _id: payment.order, user: req.userId },
      { orderStatus: "cancelled" },
    );

    return res.status(200).json({
      success: true,
      message: "QR code cancelled successfully",
      payment,
    });
  } catch (error) {
    console.error("cancelQrCode:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel QR code",
    });
  }
};

export const expireQrCode = async (req: AuthRequest, res: Response) => {
  try {
    const { qrCodeId } = req.body;

    if (!qrCodeId || typeof qrCodeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "QR code ID is required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Only find this user's still-pending QR payment.
    const payment = await Payment.findOne({
      qrCodeId,
      user: req.userId,
      method: "qr",
      status: "pending",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Pending QR payment not found",
      });
    }

    // Do not expire it before the actual expiry time.
    if (!payment.qrExpiresAt || payment.qrExpiresAt.getTime() > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "QR code has not expired yet",
      });
    }

    // Atomically mark it failed only if it is still pending.
    const expiredPayment = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        status: "pending",
        qrExpiresAt: { $lte: new Date() },
      },
      { $set: { status: "failed" } },
      { new: true },
    );

    if (!expiredPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment status changed; refresh and check again",
      });
    }

    // Close the Razorpay QR if it is still open.
    // Failure to close it must not undo the local expiry update.
    try {
      await cancelRazorpayQr(qrCodeId);
    } catch (error) {
      console.error("Failed to close expired Razorpay QR:", error);
    }

    // Cancel the order only if it is still awaiting payment.
    await Order.findOneAndUpdate(
      {
        _id: expiredPayment.order,
        user: req.userId,
        orderStatus: "placed",
      },
      { $set: { orderStatus: "cancelled" } },
    );

    return res.status(200).json({
      success: true,
      message: "QR payment expired and marked as failed",
    });
  } catch (error) {
    console.error("expireQrCode:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to expire QR payment",
    });
  }
};

export const verifyCheckoutPayment = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body as {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
      };

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details are required",
      });
    }

    const payment = await Payment.findOne({
      providerOrderId: razorpay_order_id,
      user: req.userId,
      method: "upi",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    if (payment.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Payment is no longer pending",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    const isSignatureValid = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      keySecret,
    );

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Verify the payment status and amount with Razorpay.
    const razorpayPayment =
      await getRazorpayInstance().payments.fetch(razorpay_payment_id);

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.amount !== Math.round(payment.amount * 100) ||
      razorpayPayment.currency !== payment.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match the order",
      });
    }

    if (razorpayPayment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: "Payment has not been captured yet",
        paymentStatus: razorpayPayment.status,
      });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        status: "pending",
      },
      {
        $set: {
          status: "paid",
          providerPaymentId: razorpay_payment_id,
          paidAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedPayment) {
      const latestPayment = await Payment.findById(payment._id);

      if (latestPayment?.status === "paid") {
        return res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          payment: latestPayment,
        });
      }

      return res.status(409).json({
        success: false,
        message: "Payment status changed; refresh and check again",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("verifyCheckoutPayment:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};
