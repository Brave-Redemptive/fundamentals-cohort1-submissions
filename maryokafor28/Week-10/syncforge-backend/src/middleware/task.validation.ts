// src/middleware/task.validation.ts

import { Request, Response, NextFunction } from "express";
import { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";

/**
 * Validate task creation data
 */
export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, status, priority }: CreateTaskDTO = req.body;

  // Check required fields
  if (!title || title.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Title is required",
    });
    return;
  }

  if (!description || description.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Description is required",
    });
    return;
  }

  // Validate status if provided
  if (status && !["pending", "in-progress", "completed"].includes(status)) {
    res.status(400).json({
      success: false,
      message: "Invalid status. Must be: pending, in-progress, or completed",
    });
    return;
  }

  // Validate priority if provided
  if (priority && !["low", "medium", "high"].includes(priority)) {
    res.status(400).json({
      success: false,
      message: "Invalid priority. Must be: low, medium, or high",
    });
    return;
  }

  next(); // Validation passed, proceed to controller
};

/**
 * Validate task update data
 */
export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, status, priority }: UpdateTaskDTO = req.body;

  // Check if at least one field is provided
  if (!title && !description && !status && !priority) {
    res.status(400).json({
      success: false,
      message: "At least one field must be provided for update",
    });
    return;
  }

  // Validate title if provided
  if (title !== undefined && title.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Title cannot be empty",
    });
    return;
  }

  // Validate description if provided
  if (description !== undefined && description.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Description cannot be empty",
    });
    return;
  }

  // Validate status if provided
  if (status && !["pending", "in-progress", "completed"].includes(status)) {
    res.status(400).json({
      success: false,
      message: "Invalid status. Must be: pending, in-progress, or completed",
    });
    return;
  }

  // Validate priority if provided
  if (priority && !["low", "medium", "high"].includes(priority)) {
    res.status(400).json({
      success: false,
      message: "Invalid priority. Must be: low, medium, or high",
    });
    return;
  }

  next(); // Validation passed, proceed to controller
};
