import type { Request, Response } from "express";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";

export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    // 1. Read configuration and request headers.
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");
      return res.status(500).send("Webhook secret not configured.");
    }

    const signatureHeader = req.headers["x-razorpay-signature"];

    // 2. Validate the signature header.
    if (!signatureHeader || typeof signatureHeader !== "string") {
      return res.status(400).send("Missing Razorpay signature");
    }

    // 3. Validate the raw request body.
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send("Expected a raw request body");
    }

    const rawBody = req.body;

    // 4. Verify the Razorpay webhook signature using HMAC-SHA256.
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const providedSignature = signatureHeader;

    // Reject malformed SHA-256 HMAC signatures.
    if (!/^[a-f0-9]{64}$/i.test(providedSignature)) {
      return res.status(400).send("Invalid signature format");
    }

    // Use constant-time comparison for signature verification.
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const providedBuffer = Buffer.from(providedSignature, "hex");

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return res.status(400).send("Invalid signature");
    }

    // 5. Parse the event payload from the raw request body.
    let event: any;
    try {
      event = JSON.parse(rawBody.toString("utf-8"));
    } catch (e) {
      return res.status(400).send("Invalid JSON payload");
    }

    // 6. Handle Razorpay Checkout payment captures.
    if (event?.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;

      if (
        !paymentEntity?.id ||
        !paymentEntity?.order_id ||
        typeof paymentEntity.amount !== "number" ||
        typeof paymentEntity.currency !== "string"
      ) {
        return res.status(400).send("Missing or invalid payment details");
      }

      // Find the application payment using Razorpay's order ID.
      const payment = await Payment.findOne({
        providerOrderId: paymentEntity.order_id,
        method: "upi",
      });

      if (!payment) {
        return res.status(404).send("Checkout payment not found");
      }

      // A duplicate webhook must not process an already-paid payment again.
      if (payment.status === "paid") {
        return res.status(200).send("Payment already processed");
      }

      // Do not process payments that are no longer pending.
      if (payment.status !== "pending") {
        return res.status(200).send("Payment is not pending");
      }

      // Verify the captured amount and currency against our database.
      const expectedAmountInPaise = Math.round(payment.amount * 100);

      if (
        paymentEntity.amount !== expectedAmountInPaise ||
        paymentEntity.currency !== payment.currency
      ) {
        console.error("Checkout webhook amount or currency mismatch", {
          razorpayOrderId: paymentEntity.order_id,
        });

        return res.status(400).send("Amount or currency mismatch");
      }

      // Mark the payment as paid only if it is still pending.
      const updatedPayment = await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status: "pending",
        },
        {
          $set: {
            status: "paid",
            providerPaymentId: paymentEntity.id,
            paidAt: new Date(),
          },
        },
        { new: true },
      );

      if (!updatedPayment) {
        return res.status(200).send("Payment already processed or not pending");
      }

      return res.status(200).send("Checkout payment updated successfully");
    }

    // 7. Continue to the existing QR payment handler.
    if (event?.event !== "qr_code.credited") {
      return res.status(200).send("Event ignored");
    }
    // 7. Extract and validate payment details from the webhook payload.
    const qrCodeEntity = event.payload?.qr_code?.entity;
    const paymentEntity = event.payload?.payment?.entity;

    const qrCodeId = qrCodeEntity?.id;
    const paymentId = paymentEntity?.id;
    const paymentStatus = paymentEntity?.status;
    const paymentAmountInPaise = paymentEntity?.amount;
    const paymentCurrency = paymentEntity?.currency;

    if (!qrCodeId || !paymentEntity || !paymentId) {
      return res.status(400).send("Missing required payload entities");
    }

    // 8. Validate that the payment is captured (successful).
    if (paymentStatus !== "captured") {
      return res.status(200).send("Payment not captured, ignored.");
    }

    // 9. Find the matching payment record using the QR code identifier.
    const payment = await Payment.findOne({
  qrCodeId,
  method: "qr",
});

    if (!payment) {
      return res.status(404).send("Payment not found for this QR code");
    }

    // 10. Handle duplicate or already-processed payments.
    if (payment.status === "paid") {
      return res.status(200).send("Payment already processed");
    }

    // 11. Validate amount and currency against the stored payment record.
    const expectedAmountInPaise = Math.round(payment.amount * 100);

    if (
      typeof paymentAmountInPaise !== "number" ||
      typeof paymentCurrency !== "string" ||
      paymentAmountInPaise !== expectedAmountInPaise ||
      paymentCurrency !== payment.currency
    ) {
      return res.status(400).send("Amount or currency mismatch");
    }

    // 13. Update the payment record with successful payment details.

    if (!paymentId) {
      return res.status(400).send("Missing payment ID");
    }

    // Update only if the payment is still pending.
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: payment._id, status: "pending" },
      {
        $set: {
          status: "paid",
          providerPaymentId: paymentId,
          paidAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedPayment) {
      return res.status(200).send("Payment already processed or not pending");
    }

    return res.status(200).send("Payment updated successfully");
  } catch (error) {
    console.error("razorpayWebhook:", error);
    return res.status(500).send("Internal server error processing webhook");
  }
};
