import { Request, Response, NextFunction} from "express";
import { refreshAccessToken } from "../services/auth/refreshTokenService.js";
import registerUser from "../services/auth/registerService.js";
import loginUser from "../services/auth/loginService.js";
import logOutUser from "../services/auth/logOutService.js"



export const registerController = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const { name, email, password, role } = req.body;
    const result = await registerUser(name, email, password, role, res);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    });
  }catch (error: any) {
    console.error("Registration error:", error.message);
    res.status(400).json({ message: error.message });
    next(error);
  }
};


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password, res);
    res.status(200).json(response);
  } catch (err: any) {
      console.error("💥 LoginController Error:", err.message);
    next(err);
  }
};


export const refreshTokenController = async (req: Request, res: Response) => {
  try {
   await refreshAccessToken(req, res);
  } catch (err: any) {
    console.error("Refresh token error:", err.message);
    res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
  }
};


export const logoutUserController = async (req: Request, res: Response) => {
 try{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    await logOutUser(refreshToken)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: 'Logged out successfully' });
 }catch(err: any){
console.error("Logout error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Logout failed" 
    });
 }
};