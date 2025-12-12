export type NotificationType = "sms" | "email" | "push";
export type JobStatus = "pending" | "processing" | "sent" | "failed";

export interface Job {
  _id: string;
  type: NotificationType;
  to: string;
  payload: {
    message?: string;
    subject?: string;
    title?: string;
    body?: string;
    [key: string]: unknown;
  };
  status: JobStatus;
  attempts: number;
  maxRetries?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ApiResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
}
