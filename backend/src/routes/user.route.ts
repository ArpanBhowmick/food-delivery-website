import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  getCurrentUser,
  updateLocation,
  updateUserLocation,
} from "../controllers/user.controller.js";
import { requireRole } from "../middleware/requireRole.js";

const userRouter = express.Router();

// get current users route

userRouter.get("/me", verifyJWT, getCurrentUser);

// update user's default address
userRouter.put("/location", verifyJWT, updateLocation);

// update delivery boy's current location
userRouter.put(
   "/location/current",
  verifyJWT,
  requireRole("deliveryBoy"),
  updateUserLocation,
);


export default userRouter;
