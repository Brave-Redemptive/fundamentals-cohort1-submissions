// src/controllers/task.controller.ts

import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import type { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";

const taskService = new TaskService();

/**
 * Task Controller - handles HTTP requests for task operations
 */
export class TaskController {
  /**
   * GET /api/tasks
   * Get all tasks
   */
  getAllTasks(_req: Request, res: Response): void {
    try {
      const tasks = taskService.getAllTasks();
      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/tasks/:id
   * Get a single task by ID
   */
  getTaskById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const task = taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * POST /api/tasks
   * Create a new task
   */
  createTask(req: Request, res: Response): void {
    try {
      const taskData: CreateTaskDTO = req.body;

      // Basic validation
      if (!taskData.title) {
        res.status(400).json({
          success: false,
          message: "Title is required",
        });
        return;
      }

      const newTask = taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * PUT /api/tasks/:id
   * Update an existing task
   */
  updateTask(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskDTO = req.body;

      const updatedTask = taskService.updateTask(id, updateData);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task
   */
  deleteTask(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const deleted = taskService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
