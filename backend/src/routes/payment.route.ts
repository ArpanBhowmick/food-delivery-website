import { Router } from "express";
import { cancelQrCode, expireQrCode, verifyCheckoutPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const paymentRouter = Router();

// Explicit user cancellation of the QR payment drawer.
paymentRouter.post("/qr/cancel", verifyJWT, cancelQrCode);

// Explicit user expiration of the QR payment drawer.
paymentRouter.post("/qr/expire", verifyJWT, expireQrCode);


// Verify a Razorpay Checkout payment.
paymentRouter.post("/checkout/verify", verifyJWT, verifyCheckoutPayment);


export default paymentRouter;
