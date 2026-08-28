import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const orderRouter = express.Router();

// Create a new order.
orderRouter.post("/createOrder", verifyJWT, createOrder);

// Get orders by user.
// orderRouter.get("/userOrders", verifyJWT, getUserOrders);

// Get orders by owner.
// orderRouter.get("/ownerOrders", verifyJWT, getOwnerOrders);

// get orders
orderRouter.get("/getOrders", verifyJWT, getOrders);

// update order status
orderRouter.patch(
  "/:orderId/:shopOrderId/status",
  verifyJWT,
  updateOrderStatus,
);

export default orderRouter;
