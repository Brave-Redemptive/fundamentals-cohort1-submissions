// Standard Response Wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Project Interface
export interface Project {
  id: string;
  name: string;
  description: string;
  teamSize: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
}

// Task Interface
export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: string; // email or user name
  createdAt: Date;
}

// Custom Error Class
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}