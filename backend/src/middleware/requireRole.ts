import type { NextFunction, Response } from "express";
import { User, type IUser } from "../models/user.model.js";
import type { AuthRequest } from "../types/types.js";

export const requireRole = (...allowedRoles: IUser["role"][]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "User is not authenticated",
        });
      }

      const user = await User.findById(req.userId).select("role");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      return next();
    } catch (error) {
      console.error("requireRole:", error);

      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};