// src/services/task.service.ts

import type { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";
import { v4 as uuidv4 } from "uuid";

/**
 * In-memory storage for tasks
 * In production, this would be a database
 */
let tasks: Task[] = [];

/**
 * Task Service - handles all business logic for task operations
 */
export class TaskService {
  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return tasks;
  }

  /**
   * Get a single task by ID
   */
  getTaskById(id: string): Task | undefined {
    return tasks.find((task) => task.id === id);
  }

  /**
   * Create a new task
   */
  createTask(taskData: CreateTaskDTO): Task {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      priority: taskData.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    return newTask;
  }

  /**
   * Update an existing task
   */
  updateTask(id: string, updateData: UpdateTaskDTO): Task | null {
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return null;
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return tasks[taskIndex];
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): boolean {
    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);
    return tasks.length < initialLength;
  }
}
