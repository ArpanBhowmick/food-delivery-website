import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { AuthRequest } from "../types/types.js";

export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access Token Missing",
      });
    }

    // extract access token
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        message: "Access Token Missing",
      });
    }

    // verifyu token
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET!,
    ) as JwtPayload & { id: string };

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Access Token Missing",
    });
  }
};
