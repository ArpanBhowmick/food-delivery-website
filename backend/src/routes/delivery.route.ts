import express from "express";
import {
  acceptDeliveryAssignment,
  confirmPickup,
  getAvailableDeliveryAssignments,
  getDeliveryAssignmentDetails,
  getMyActiveDeliveries,
  getUserDeliveryTracking,
  requestDeliveryOtp,
  verifyDeliveryOtp,
  verifyPickupCode,
} from "../controllers/deliveryAssignment.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";


const deliveryRouter = express.Router();

// get available delivery assignments
deliveryRouter.get(
  "/availableAssignments",
  verifyJWT,
  getAvailableDeliveryAssignments,
);

// get active delivery assignments
deliveryRouter.get(
  "/activeAssignments",
  verifyJWT,
  getMyActiveDeliveries,
);

// accept delivery assignment
deliveryRouter.patch(
  "/:deliveryAssignmentId/accept",
  verifyJWT,
  acceptDeliveryAssignment,
);

// verify pickup 
deliveryRouter.post(
  "/verifyPickupCode",
  verifyJWT,
  verifyPickupCode,
);

// confirm pickup
deliveryRouter.patch(
  "/:deliveryAssignmentId/confirmPickup",
  verifyJWT,
  confirmPickup,
);


// request delivery OTP
deliveryRouter.post(
  "/:deliveryAssignmentId/requestDeliveryOtp",
  verifyJWT,
  requestDeliveryOtp,
);

// verify delivery OTP
deliveryRouter.patch(
  "/:deliveryAssignmentId/verifyDeliveryOtp",
  verifyJWT,
  verifyDeliveryOtp,
);


// get delivery assignments details
deliveryRouter.get(
  "/:orderId/:shopOrderId/deliveryDetails",
  verifyJWT,
  getDeliveryAssignmentDetails,
);

// get customer delivery tracking details
deliveryRouter.get(
  "/user/:orderId/tracking",
  verifyJWT,
  getUserDeliveryTracking,
);


export default deliveryRouter;