import Razorpay from "razorpay";

// Keep the Razorpay client so it is created only once.
let razorpayInstance: Razorpay | null = null;

// Create the Razorpay client when it is first needed.
export const getRazorpayInstance = (): Razorpay => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error(
      "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  }

  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });

  return razorpayInstance;
};
