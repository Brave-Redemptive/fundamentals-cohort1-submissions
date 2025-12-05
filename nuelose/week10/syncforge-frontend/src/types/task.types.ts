export interface Task {
  id: string;
  message: string;
  createdAt: string;
}

export interface CreateTaskDto {
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  code?: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}
