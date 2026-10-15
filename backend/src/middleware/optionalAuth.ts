import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { AuthRequest } from "../types/types.js";

// Attaches req.userId when a valid access token is present, but never blocks the
// request. Used on public routes that behave differently for logged in users.
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    // extract access token
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return next();
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET!,
    ) as JwtPayload & { id?: string };

    if (decoded.id) {
      req.userId = decoded.id;
    }
  } catch {
    // Invalid or expired token -> treat the request as a guest request.
  }

  return next();
};
