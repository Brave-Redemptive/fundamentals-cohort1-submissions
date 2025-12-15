import type { Request, Response, NextFunction } from "express";
import Jwt, { JwtPayload }  from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";


// an request interface to extend typescripts Request and add user since Request doesnt have user in it
export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}
/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
      console.log("❌ No access token in cookies");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    console.log("✅ Token found:", token.substring(0, 20) + "...");
      
     const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
     console.log("✅ Token decoded:", decoded);

     const decodedId = decoded.id

      // Fetch user from DB (without password)
      const user = await UserRepository.findById(decodedId);

      if (!user) {
        console.log("❌ User not found for ID:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ User authenticated:", user.email);
      
      req.user = {_id: user._id.toString(), email: user.email, role: user.role}; // Attach user to request
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  
};

export default protect;
