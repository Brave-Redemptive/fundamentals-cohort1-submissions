// src/services/task.service.ts

import apiClient from "./api.config";
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
} from "../types/task.types";

/**
 * Task Service
 * Handles all API calls related to tasks
 */
class TaskService {
  private readonly endpoint = "/tasks";

  /**
   * Get all tasks
   * @route GET /api/tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(this.endpoint);
    return response.data.data;
  }

  /**
   * Get a single task by ID
   * @route GET /api/tasks/:id
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(
      `${this.endpoint}/${id}`
    );
    return response.data.data;
  }

  /**
   * Create a new task
   * @route POST /api/tasks
   */
  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>(
      this.endpoint,
      taskData
    );
    return response.data.data;
  }

  /**
   * Update an existing task
   * @route PUT /api/tasks/:id
   */
  async updateTask(id: string, taskData: UpdateTaskDTO): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(
      `${this.endpoint}/${id}`,
      taskData
    );
    return response.data.data;
  }

  /**
   * Delete a task
   * @route DELETE /api/tasks/:id
   */
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

// Export a singleton instance
export const taskService = new TaskService();
