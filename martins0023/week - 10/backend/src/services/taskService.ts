import { v4 as uuidv4 } from 'uuid';
import { Task, ApiError } from '../types';

let tasks: Task[] = [];

export const taskService = {
  getAll: (page = 1, limit = 10, projectId?: string) => {
    let filteredTasks = tasks;

    // Filter by Project ID if provided
    if (projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === projectId);
    }

    // Pagination Logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      data: paginatedTasks,
      total: filteredTasks.length,
      page,
      limit
    };
  },

  getByStatus: (status: string): Task[] => {
    return tasks.filter((t) => t.status === status);
  },

  getById: (id: string): Task => {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');
    return task;
  },

  create: (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    // Validate required fields
    if (!data.title || !data.projectId) {
        throw new ApiError('Title and Project ID are required', 400, 'VALIDATION_ERROR');
    }

    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date(),
      ...data,
    };
    tasks.push(newTask);
    return newTask;
  },

  update: (id: string, data: Partial<Task>): Task => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
  },

  delete: (id: string): void => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new ApiError('Task not found', 404, 'NOT_FOUND');
    tasks = tasks.filter((t) => t.id !== id);
  },
};