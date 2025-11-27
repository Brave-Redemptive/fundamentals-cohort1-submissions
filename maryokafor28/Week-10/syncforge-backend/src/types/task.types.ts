// src/types/task.types.ts

/**
 * Task status options
 */
export type TaskStatus = "pending" | "in-progress" | "completed";

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Main Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data required to create a new task (without auto-generated fields) DTO(Data Transfer Object )
 */
export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus; // Optional, defaults to 'pending'
  priority?: TaskPriority; // Optional, defaults to 'medium'
}

/**
 * Data that can be updated in an existing task
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
