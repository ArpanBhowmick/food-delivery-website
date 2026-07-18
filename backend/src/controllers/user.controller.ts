import type { Response } from "express";
import { User } from "../models/user.model.js";
import type { AuthRequest } from "../types/types.js";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User id not found",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// update location
export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { address, city, state, country, pincode, latitude, longitude } =
      req.body;

    const location = {
      address,
      city,
      state,
      country,
      pincode,
      latitude,
      longitude,
    };

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "user isn't authenticated",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        defaultAddress: location,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Location updated successfully",
      location: updatedUser.defaultAddress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
