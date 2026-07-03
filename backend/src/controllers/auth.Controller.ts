import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import type { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../util/token.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, role, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 characters" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      role,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // in production set secure: true and sameSite: "none" for cross-site cookies

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `sign up failed ${error}`,
    });
  }
};

// login user

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // in production set secure: true and sameSite: "none" for cross-site cookies

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `sign up failed ${error}`,
    });
  }
};

// google authentication

// refresh token controller

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing in cookies",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET!,
    ) as JwtPayload & { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({
        message: "Invalid Refresh Token",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
      error,
    });
  }
};



// logOut controller 

export const logOut = async (req: Request, res: Response) => {
  try {
    
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })

    // this is for locally testing in production set secure: true and sameSite: "none" for cross-site cookies

    return res.status(200).json({
      message: "Logged out successfully"
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error logging out", error
    })
  }
}




