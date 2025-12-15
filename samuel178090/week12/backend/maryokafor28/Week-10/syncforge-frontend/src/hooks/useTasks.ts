// src/hooks/useTasks.ts

import { useState, useEffect } from "react";
import { taskService } from "../services/task.service";
import type { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";

/**
 * Custom hook for managing tasks
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all tasks
   */
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new task
   */
  const createTask = async (taskData: CreateTaskDTO): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing task
   */
  const updateTask = async (
    id: string,
    taskData: UpdateTaskDTO
  ): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
