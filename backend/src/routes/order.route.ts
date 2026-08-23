import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const orderRouter = express.Router();

orderRouter.post("/create", verifyJWT, createOrder);

export default orderRouter;
