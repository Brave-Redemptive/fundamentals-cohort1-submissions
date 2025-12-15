import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const createTaskSchema = z.object({
  message: z
    .string({
      message: "Message is required",
    }).trim()
    .min(3, "Message must be at least 3 characters long")
    .max(500, "Message cannot exceed 500 characters")
    
});

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createTaskSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }
    throw error;
  }
};
