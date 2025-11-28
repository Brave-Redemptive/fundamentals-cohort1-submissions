import axios from 'axios';
import type { Project, Task, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },
  create: async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const response = await api.post<ApiResponse<Project>>('/projects', project);
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  }
};

export const taskService = {
  getAll: async (projectId: string) => {
    // Passing projectId as query param to filter on backend
    const response = await api.get<ApiResponse<Task[]>>(`/tasks?projectId=${projectId}`);
    return response.data.data;
  },
  create: async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const response = await api.post<ApiResponse<Task>>('/tasks', task);
    return response.data.data;
  },
  updateStatus: async (id: string, status: Task['status']) => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, { status });
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  }
};