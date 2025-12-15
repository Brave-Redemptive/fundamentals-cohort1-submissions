import type { NextFunction, Request, Response } from "express";
import { getAllTasks } from "../services/task.services";
import type { Task, CreateTask } from "../types";
import { createTask } from "../services/task.services";

export const getTasks = (req: Request, res: Response): void => {
  const tasks: Task[] = getAllTasks();

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

export const addTask = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  try {
    const newTask: CreateTask = req.body;
    const task = createTask(newTask);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "A task with this exact message already exists") {
        return res.status(409).json({
          success: false,
          error: "Duplicate task",
          message: "A task with this exact message already exists",
          code: "DUPLICATE_MESSAGE",
        });
      }
    }
    next(error);
  }
};
