export interface Project {
  id: string;
  name: string;
  description: string;
  teamSize: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}