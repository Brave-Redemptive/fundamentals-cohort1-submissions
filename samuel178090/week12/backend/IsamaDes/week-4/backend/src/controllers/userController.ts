import type { Response } from "express";
import {AuthenticatedRequest} from "../middleware/authMiddleware.js";
import { UserRepository } from "../repositories/userRepository.js";

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user, 
    });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
