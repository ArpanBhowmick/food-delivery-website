import jwt from "jsonwebtoken";
import type { IUser } from "../models/user.model.js";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
      // role:
    },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" },
  );
};

export const generateRefreshToken = async (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
};
