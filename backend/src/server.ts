import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import shopRouter from "./routes/shop.route.js";
import itemRouter from "./routes/item.route.js";
import searchRouter from "./routes/search.route.js";
import { configureCloudinary } from "./config/cloudinary.js";
import orderRouter from "./routes/order.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket.js";
import { setIO } from "./socket/io.js";
import deliveryRouter from "./routes/delivery.route.js";
import paymentRouter from "./routes/payment.route.js";
import { razorpayWebhook } from "./controllers/webhook.controller.js";


dotenv.config();
configureCloudinary();

const app = express();

const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: corsOptions,
});

setIO(io);
initializeSocket(io);

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors(corsOptions));

// Razorpay webhook — preserve the original request body
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use(express.json());
// Read cookies sent by the browser and put them inside req.cookies.
app.use(cookieParser());

// routes
// auth routes
app.use("/api/auth", authRouter);

// user routes
app.use("/api/user", userRouter);

// shop routes
app.use("/api/shop", shopRouter);

// item routes
app.use("/api/item", itemRouter);

// search routes
app.use("/api/search", searchRouter);

// order routes
app.use("/api/order", orderRouter);

// payment routes
app.use("/api/payment", paymentRouter);

// delivery boy routes
app.use("/api/delivery", deliveryRouter);



connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
