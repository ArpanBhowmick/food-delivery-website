import jwt from "jsonwebtoken";
import type { IUser } from "../models/user.model.js";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
      // role:
    },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_SECRET!,
    { expiresIn: "7d" },
  );
};
