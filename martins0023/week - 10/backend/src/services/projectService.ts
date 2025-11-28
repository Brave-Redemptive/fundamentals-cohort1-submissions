import { v4 as uuidv4 } from 'uuid';
import { Project, ApiError } from '../types';

// In-memory storage
let projects: Project[] = [];

export const projectService = {
  getAll: (status?: string): Project[] => {
    if (status) {
      return projects.filter((p) => p.status === status);
    }
    return projects;
  },

  getById: (id: string): Project => {
    const project = projects.find((p) => p.id === id);
    if (!project) throw new ApiError('Project not found', 404, 'NOT_FOUND');
    return project;
  },

  create: (data: Omit<Project, 'id' | 'createdAt'>): Project => {
    const newProject: Project = {
      id: uuidv4(),
      createdAt: new Date(),
      ...data,
    };
    projects.push(newProject);
    return newProject;
  },

  update: (id: string, data: Partial<Project>): Project => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new ApiError('Project not found', 404, 'NOT_FOUND');

    projects[index] = { ...projects[index], ...data };
    return projects[index];
  },

  delete: (id: string): void => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new ApiError('Project not found', 404, 'NOT_FOUND');
    projects = projects.filter((p) => p.id !== id);
  },
};