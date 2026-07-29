import type { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

// export interface JWTRequest extends Request {
//   userId: string;
// }
