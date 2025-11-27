// src/types/task.types.ts

/**
 * Task Status Enum
 */
export type TaskStatus = "pending" | "in-progress" | "completed";

/**
 * Task Priority Enum
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task Interface - matches backend model
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Task DTO (Data Transfer Object)
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * Update Task DTO
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  errors?: string[];
  statusCode: number;
}
