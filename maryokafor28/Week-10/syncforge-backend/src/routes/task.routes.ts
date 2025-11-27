// src/routes/task.routes.ts

import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../middleware/task.validation";

/**
 * Task Routes
 * Defines all API endpoints for task operations
 */
const router = Router();
const taskController = new TaskController();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
router.get("/", taskController.getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Public
 */
router.get("/:id", taskController.getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post("/", validateCreateTask, taskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Public
 */
router.put("/:id", validateUpdateTask, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public
 */
router.delete("/:id", taskController.deleteTask);

export default router;
