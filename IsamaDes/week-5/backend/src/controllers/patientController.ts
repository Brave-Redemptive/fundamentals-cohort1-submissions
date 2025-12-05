import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository.js";

// Extend Request type for TypeScript
interface AuthenticatedRequest extends Request {
  user?: any;
}

// * Returns the logged-in patient's profile
 
export const getPatientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const patient = await UserRepository.findById(userId);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

