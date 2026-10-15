import crypto from "crypto";

const webhookUrl =
  "https://k167h2bb-5000.inc1.devtunnels.ms/api/payment/webhook";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET is missing");
}

// Use the QR ID and payment amount from your MongoDB record.
const payload = {
  entity: "event",
  event: "qr_code.credited",
  payload: {
    qr_code: {
      entity: {
        id: "qr_Tn3gAnWTeh5lzS",
      },
    },
    payment: {
      entity: {
        id: "pay_test_simulated_001",
        status: "captured",
        amount: 18900,
        currency: "INR",
      },
    },
  },
};

const rawBody = JSON.stringify(payload);

const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(rawBody)
  .digest("hex");

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-razorpay-signature": signature,
  },
  body: rawBody,
});

console.log("HTTP status:", response.status);
console.log("Response:", await response.text());
