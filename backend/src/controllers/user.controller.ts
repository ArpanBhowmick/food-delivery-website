import type { Response } from "express";
import { User } from "../models/user.model.js";
import type { AuthRequest } from "../types/types.js";


// get current user 
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





// update user location(for delivery boy)
export const updateUserLocation = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { latitude, longitude } = req.body;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User isn't authenticated",
      });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: "Invalid latitude or longitude",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      {
        // new: true,
          returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current location updated successfully",
      location: updatedUser.currentLocation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



