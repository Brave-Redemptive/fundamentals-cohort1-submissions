import { Request, Response } from "express";
import AuthService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);

    return res.status(201).json({
      message: "User registered",
      data: result,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return res
      .status(400)
      .json({ error: err.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);

    const { accessToken, refreshToken, user } = result;

    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return res.status(200).json({
      accessToken,
      user,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res
      .status(401)
      .json({ error: err.message || "Authentication failed" });
  }
};
